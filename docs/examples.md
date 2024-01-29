# Examples
<!-- https://github.com/yanhao98/vue-memoize-dict/blob/a1f73b60b0b51823ffb3dc5ed4606f3f8d0bb644/packages/playground/src/components/MemoizeDict.vue -->


```vue preview
<template>
  {{ remoteDict.get('food') }}
</template>
<script setup lang="ts">
import { MemoizeDict } from "vue-memoize-dict";

type DictData = {
  name: string;
  id: number;
};

const remoteDict = new MemoizeDict<DictData>({
  fieldNames: {
    label: "name",
    value: "id",
    parent: "parent_id",
  },
  config: new Proxy(
    {},
    {
      get: (_, key) => {
        return {
          data: async () => {
            return [
              {
                name: "🍕披萨",
                id: 1,
              },
              {
                name: "🥗沙拉",
                id: 2,
              },
            ];
          },
        };
      },
    }
  ),
});
</script>

```
