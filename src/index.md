---
home: true
---

<script setup lang="ts">
  import {useUserStore} from "../.vitepress/theme/store/user"
  const userStore = useUserStore();
</script>

# Bytebuilders
hi, this is bytebuilders

```json-vue
{{ userStore.user }}
```
