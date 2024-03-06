import { MemoizeDict } from "vue-memoize-dict";

type DictData = {
  name: string;
  id: number;
  parent_id: number;
};

export const remoteDict = new MemoizeDict<DictData>({
  fieldNames: {
    label: "name",
    value: "id",
    parent: "parent_id",
  },
  config: new Proxy({},
    {
      get: (_, key: string) => ({
        data: async () => {
          return fetch(`./static/${key}.json?${Date.now()}`)
            .then((res) => res.json());
        },
      }),
    }
  ),
});

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.remoteDict = remoteDict;
}
