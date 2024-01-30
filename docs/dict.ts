import { MemoizeDict } from "vue-memoize-dict";

type DictData = {
  name: string;
  id: number;
};

export const remoteDict = new MemoizeDict<DictData>({
  fieldNames: {
    label: "name",
    value: "id",
    // parent: "parent_id",
  },
  config: new Proxy(
    {},
    {
      get: (_, key: string) => ({
        data: async () => {
          const res = await fetch(`./static/${key}.json`);
          return res.json();
        },
      }),
    }
  ),
});

// @ts-ignore
window.remoteDict = remoteDict;
