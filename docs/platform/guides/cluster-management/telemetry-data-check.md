---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: cluster-management-telemetry-data-check
    name: Verifying Telemetry Data
    parent: cluster-management
    weight: 100
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

# Verifying Telemetry Data (Logs & Metrics)

This guide shows how to confirm your logs and metrics are actually being stored — not just
collected — in the monitoring stack: **ClickHouse** for logs, **Thanos + S3** for metrics.
See [OpenTelemetry Monitoring](otel-monitoring.md) for how the stack is set up.

## Basics

- Logs and metrics are stored in the **same S3 bucket**, under different prefixes:
  - Logs → `<bucket>/logs/`
  - Metrics → `<bucket>/metrics/`
- Bucket, endpoint, and prefixes are defined in your `TelemetryStack` resource:
  ```bash
  kubectl get telemetrystack -n monitoring -o yaml
  ```
  Look under `spec.logs.clickhouse.s3` and `spec.metrics.thanos.s3`.
- ClickHouse database name is your tenant ID, not a fixed name like `otel` or `default`.
  Find it with `SHOW DATABASES` (see below) — the table inside is `otel_logs`.
- All checks below run from inside the cluster via `kubectl exec`, so no port-forwarding
  or extra credentials are required except for the optional S3 listing step.

---

## 1. Check logs are landing in ClickHouse

Find the ClickHouse pod:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=clickhouse
```

List databases and confirm the `otel_logs` table exists:

```bash
kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query "SHOW DATABASES"
kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query "SHOW TABLES FROM <your-tenant-db>"
```

Check row count and freshness:

```bash
kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query \
  "SELECT count(), min(Timestamp), max(Timestamp), now() FROM <your-tenant-db>.otel_logs"

kubectl exec -n monitoring <clickhouse-pod> -- clickhouse-client --query \
  "SELECT count() FROM <your-tenant-db>.otel_logs WHERE Timestamp > now() - INTERVAL 5 MINUTE"
```

**Healthy result:** `max(Timestamp)` is close to `now()`, and the 5-minute count is greater
than zero. If both queries return recent data, logs are flowing end-to-end.

---

## 2. Check metrics are landing in Thanos / S3

Find the Thanos query pod:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=thanos-query
```

Ask it which StoreAPIs it's talking to and what time range each one covers:

```bash
kubectl exec -n monitoring <thanos-query-pod> -- \
  wget -qO- --header="THANOS-TENANT: <your-tenant>" "http://localhost:9090/api/v1/stores"
```

Look at the `minTime`/`maxTime` fields (Unix epoch **milliseconds**) for each store:

```bash
date -u -d @<maxTime-in-seconds>   # drop the last 3 digits first to convert ms -> s
```

**Healthy result:** `maxTime` should be within the last few minutes for the live/receive
store, and within your compaction interval for the long-term S3-backed store.

For a second confirmation, check the ingester's own TSDB head timestamp:

```bash
kubectl get pods -n monitoring -l app.kubernetes.io/name=thanos-receive-ingester
kubectl exec -n monitoring <thanos-receive-ingester-pod> -- wget -qO- http://localhost:10902/metrics \
  | grep prometheus_tsdb_head_max_time
```

If this timestamp is stale (not advancing over successive checks), metrics are not being
ingested. Check that Prometheus (or your agent) has `remoteWrite` configured to point at
the Thanos receive router:

```bash
kubectl get prometheus -n monitoring <prometheus-name> -o jsonpath='{.spec.remoteWrite}'
```

An empty result means nothing is shipping samples to Thanos, regardless of whether
Prometheus itself is scraping normally.

---

## 3. Check the S3 bucket directly (optional)

Read the bucket, endpoint, and credentials from the `TelemetryStack` spec first — the same
values back both the ClickHouse and Thanos configs:

```bash
kubectl get telemetrystack -n monitoring -o jsonpath='{.spec.metrics.thanos.s3}'
```

Which client you use depends on where the bucket actually lives. The backend is
S3-compatible in every case, so pick the matching variant below.

### a. MinIO (in-cluster or S3-compatible with a custom endpoint)

Use the MinIO client (`mc`) with the endpoint and access credentials from the spec.
The `--insecure` flag is only needed when the endpoint serves a self-signed certificate:

```bash
kubectl run mc-check -n monitoring --rm -it --restart=Never --image=minio/mc:latest -- sh
mc alias set myminio <endpoint> <accessKey> <secretKey> --insecure
mc ls myminio/<bucket>/logs/    --insecure --recursive | tail
mc ls myminio/<bucket>/metrics/ --insecure --recursive | tail
```

### b. Real AWS S3

When the bucket is a genuine AWS S3 bucket, there is no custom endpoint — just pass the
AWS access key, secret, and region. Drop `--endpoint-url` entirely so the CLI talks to
the regional AWS endpoint:

```bash
kubectl run aws-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/logs/    --recursive | tail
# repeat for the metrics prefix
kubectl run aws-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/metrics/ --recursive | tail
```

### c. s3grid (S3-compatible service with a custom endpoint)

s3grid is S3-compatible but reached through its own endpoint, so use the AWS CLI with
`--endpoint-url` pointing at the s3grid endpoint from the spec:

```bash
kubectl run s3grid-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/logs/ --endpoint-url <s3grid-endpoint> --recursive | tail
# repeat for the metrics prefix
kubectl run s3grid-check -n monitoring --rm -it --restart=Never --image=amazon/aws-cli:latest \
  --env AWS_ACCESS_KEY_ID=<accessKey> \
  --env AWS_SECRET_ACCESS_KEY=<secretKey> \
  --env AWS_DEFAULT_REGION=<region> \
  -- s3 ls s3://<bucket>/metrics/ --endpoint-url <s3grid-endpoint> --recursive | tail
```

> The same `mc`-based flow from (a) works against s3grid too — `mc alias set` accepts any
> S3-compatible endpoint. Use whichever client you already have handy.

**Healthy result (any variant):** recent objects under both prefixes, with timestamps
matching your retention/compaction schedule.

---

## Summary

| Pipeline | Where to look | Healthy signal |
|---|---|---|
| Logs | ClickHouse `<tenant-db>.otel_logs` | `max(Timestamp)` ≈ now, non-zero rows in last 5 min |
| Metrics | Thanos Query `/api/v1/stores`, receive ingester `/metrics` | `maxTime`/head timestamp advancing, close to now |
| S3 | `<bucket>/logs/` and `<bucket>/metrics/` prefixes | Recent objects under both prefixes |

---

## Troubleshooting: metrics stale but logs healthy

Logs and metrics are independent paths through the same `TelemetryStack` — one being
healthy says nothing about the other, so always run both checks above rather than
assuming one implies the other.

If the metrics checks show a stale `maxTime`/head timestamp that isn't advancing, the
most common cause is that nothing is configured to remote-write samples into Thanos.
Check the `Prometheus` CR's remote-write config:

```bash
kubectl get prometheus -n monitoring <prometheus-name> -o jsonpath='{.spec.remoteWrite}'
```

An empty result means Prometheus may be scraping fine locally, but nothing is shipping
samples to the Thanos receive router. Also check for a `PrometheusAgent` resource that
might be expected to do remote-write instead:

```bash
kubectl get prometheusagents -A
```

**Fix:** add `spec.remoteWrite` to the `Prometheus` CR, pointing at the Thanos receive
router's remote-write endpoint (`http://thanos-receive-router-<stack>.monitoring.svc:19291/api/v1/receive`)
with the tenant header the router's hashring expects (e.g. `THANOS-TENANT: <tenant>`).
After applying, re-run the `prometheus_tsdb_head_max_time` check above over a couple of
minutes to confirm the timestamp starts advancing.
