import { createFetch } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'

export function getServerDomain(subDomain?: string, inputPort?: string): string {
  // execute only in client
  const hostname = window.location.hostname
  const rootDomain = hostname.replace(
    /^(console.|kubedb.|marketplace.|deploy.|grafana.|accounts.|modules.|docs.)/,
    '',
  )
  const protocol = window.location.protocol || 'http'

  let host = `${protocol}//${subDomain ? `${subDomain}.` : ''}${rootDomain}`
  if (hostname.search('bb.test') !== -1) {
    // dev
    const port = subDomain ? inputPort || window.location.port : '8080'
    host += port ? `:${port}` : ''
  }
  return host
}

const cookies = useCookies(['_csrf'])

export const useFetch = createFetch({
  baseUrl: `${getServerDomain('api', '3003')}/api/v1`,
  options: {
    timeout: 100000,
  },
  fetchOptions: {
    credentials: 'include',
    headers: {
      'x-csrf-token': cookies.get('_csrf'),
      'X-Requested-With': 'xmlhttprequest',
    },
  },
})
