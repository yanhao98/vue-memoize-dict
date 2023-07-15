# vue-memoize-dict

vue-memoize-dict

## Install

```bash
pnpm add vue-memoize-dict
```

## Usage

```ts
import { MemoizeDict } from "vue-memoize-dict";
import type { DatasetConfig } from "vue-memoize-dict";

const remoteDict = new MemoizeDict<any>({
  fieldNames: {
    // label: '',
    // value: ''
  },
  config: new Proxy(
    {},
    {
      get: (target, key): DatasetConfig => {
        return {
          data: async () => {
            await new Promise((r) => setTimeout(r, 1000));
            return Array.from({ length: 2 }).map((_, index) => ({
              label: `${String(key)} ${index}`,
              value: `${index}`.padStart(3, "0"),
            }));
          },
        };
      },
    }
  ),
});
```

## Reference Links

- vue-reactive-dataset

  - https://github.com/HuangZhaoPing/vue-reactive-dataset

  - https://www.npmjs.com/package/tiny-dict-vue

  - https://juejin.cn/post/7118759300742414373#heading-3

- Memorization

  - https://medium.com/@saravanaeswari22/memorization-in-javascript-f312d66402b2

  - https://betterprogramming.pub/understanding-javascript-typescript-memoization-6e0333b62406

  - https://gist.github.com/greyd/2771684

  - https://juejin.cn/post/6844903494256705543
  - https://www.npmjs.com/package/memoize-one

- decorators
  - https://juejin.cn/post/6844903876605280269
  - https://github.com/darrylhodgins/typescript-memoize
- https://vueuse.org/core/useMemoize
