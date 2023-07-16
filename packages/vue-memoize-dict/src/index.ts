import { computedAsync, useMemoize } from "@vueuse/core";

type AsyncComputedReturnType<T> = ReturnType<typeof computedAsync<T>>;

export class MemoizeDict<DictItem = Record<string, unknown>> {
  private options: DatasetOptions;
  private memoFetch;
  private computedMap: Map<string, AsyncComputedReturnType<DictItem[] | undefined>> = new Map();

  constructor(options: DatasetOptions) {
    this.options = options;
    this.memoFetch = useMemoize(this._fetch.bind(this));
  }

  public get(dictName: string) {
    if (!this.computedMap.has(dictName)) {
      const asyncComputedRef = computedAsync(() => {
        return this.memoFetch(dictName);
      });
      this.computedMap.set(dictName, asyncComputedRef);
    }
    const computedRef = this.computedMap.get(dictName)!;
    return computedRef.value;
  }

  public fetch(dictName: string) {
    return this.memoFetch(dictName);
  }

  public load(dictName: string) {
    return this.memoFetch.load(dictName);
  }

  public clear() {
    return this.memoFetch.clear();
  }

  public delete(dictName: string) {
    return this.memoFetch.delete(dictName);
  }

  public find(dictName: string, value: string | number) {
    const valueFieldName = this.options.fieldNames?.value || "value";
    const dict = this.get(dictName);
    return dict?.find((item) => item[valueFieldName as keyof typeof item] === value);
  }

  public label(dictName: string, value: string | number) {
    const labelFieldName = this.options.fieldNames?.label || "label";
    const item = this.find(dictName, value);
    return item?.[labelFieldName as keyof typeof item];
  }

  private async _fetch(dictName: string): Promise<DictItem[]> {
    const config = this.options.config[dictName];
    if (!config) {
      throw new Error(`config not found: ${dictName}`);
    }
    return (await config.data()) as DictItem[];
  }
}
interface FieldNamesConfig {
  label?: string;
  value?: string;
}

// type DictItem = ;
// type DictArray<T> = Array<T>;

export interface DatasetConfig {
  data(/* params?: Recordable<unknown> */): Promise<unknown[]>;
}
interface DatasetOptions {
  config: Record<string, DatasetConfig | undefined>;
  fieldNames?: FieldNamesConfig;
}
