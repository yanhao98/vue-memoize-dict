# vue-memoize-dict

## Install

```bash
pnpm add vue-memoize-dict
```

## Usage

```ts
import { MemoizeDict, type DatasetConfig } from "vue-memoize-dict";

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
            await new Promise(r => setTimeout(r, 1000));
            return Array.from({ length: 2 }).map((_, index) => ({
              label: `${String(key)} ${index}`,
              value: `${index}`.padStart(3, '0'),
            }));
          },
        }
      },
    }
  )
});
```
