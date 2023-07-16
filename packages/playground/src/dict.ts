import { MemoizeDict } from "vue-memoize-dict";

type DictData = {
  label: string;
  value: string;
};

type RemoteDict = MemoizeDict<DictData>;

export const remoteDict: RemoteDict = new MemoizeDict({
  fieldNames: {
    // label: '',
    // value: ''
  },
  config: new Proxy(
    {},
    {
      get: (target, key): RemoteDict['options']['config'][string] => {
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
