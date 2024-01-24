import { computedAsync, useMemoize } from "@vueuse/core";

type AsyncComputedReturnType<T> = ReturnType<typeof computedAsync<T>>;

type NumericOrString = number | string;

export class MemoizeDict<DictItem = Record<string, unknown>> {
  private options;
  private memoFetch;
  private computedMap: Map<string, AsyncComputedReturnType<DictItem[] | undefined>> = new Map();

  constructor(options: DatasetOptions<DictItem>) {
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

  /**
   * Call memoized function
   */
  public fetch(dictName: string) {
    return this.memoFetch(dictName);
  }

  /**
   * Call memoized function and update cache
   */
  public load(dictName: string) {
    return this.memoFetch.load(dictName);
  }

  /**
   * Clear cache
   */
  public clear() {
    return this.memoFetch.clear();
  }

  /**
   * Delete cache of given key
   */
  public delete(dictName: string) {
    return this.memoFetch.delete(dictName);
  }

  public find(dictName: string, value: keyof DictItem | NumericOrString): DictItem | undefined {
    const dict = this.get(dictName);
    return dict?.find((item) => item[this._valueFieldName!] === value);
  }

  public label(dictName: string, value: keyof DictItem | NumericOrString): string {
    const item = this.find(dictName, value);
    return item?.[this._labelFieldName!] as string || value as string;
  }

  public fullLabel(dictName: string, value: NumericOrString): string {
    const item = this.find(dictName, value);
    if (!item) return "";

    let fullLabel = this.label(dictName, value);
    let currentItem = item;

    while (currentItem[this._parentFieldName!]) {
      const parentItem = this.find(dictName, currentItem[this._parentFieldName!] as string);
      if (!parentItem) break;
      fullLabel = `${this.label(dictName, parentItem[this._labelFieldName!] as string)}-${fullLabel}`;
      currentItem = parentItem;
    }

    return fullLabel
  }

  private async _fetch(dictName: string): Promise<DictItem[]> {
    const config = this.options.config[dictName];
    if (!config) {
      throw new Error(`config not found: ${dictName}`);
    }
    return (await config.data()) as DictItem[];
  }
  private get _valueFieldName() {
    return this.options.fieldNames?.value || "value" as keyof DictItem;
  }
  private get _labelFieldName() {
    return this.options.fieldNames?.label || "label" as keyof DictItem;
  }
  private get _parentFieldName() {
    return this.options.fieldNames?.parent || "parent" as keyof DictItem;
  }
}
interface FieldNamesConfig<DictItem> {
  label?: keyof DictItem;
  value?: keyof DictItem;
  parent?: keyof DictItem;
}

// type DictArray<T> = Array<T>;

interface DatasetConfig<DictItem = Record<string, unknown>> {
  data(/* params?: Recordable<unknown> */): Promise<DictItem[]>;
}
interface DatasetOptions<DictItem> {
  config: Record<string, DatasetConfig<DictItem> | undefined>;
  fieldNames?: FieldNamesConfig<DictItem>;
}
