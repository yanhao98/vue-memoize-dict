// https://github.com/yanhao98/vue-memoize-dict/blob/a1f73b60b0b51823ffb3dc5ed4606f3f8d0bb644/packages/playground/src/components/MemoizeDict.vue
import { computedAsync, useMemoize } from "@vueuse/core";

type AsyncComputedReturnType<T> = ReturnType<typeof computedAsync<T>>;

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

  public find(dictName: string, value: DictItem[keyof DictItem]): DictItem | undefined {
    const dict = this.get(dictName);
    return dict?.find((item) => item[this._valueFieldName] === value);
  }

  public label(dictName: string, value: DictItem[keyof DictItem]): string {
    if (!value) return '';

    const item = this.find(dictName, value);
    return item?.[this._labelFieldName] as string || `${value}`
  }

  public fullLabel(dictName: string, value: DictItem[keyof DictItem]): string {
    if (!value) return '';

    const item = this.find(dictName, value);
    if (!item) return `${value}`;

    let fullLabel = this.label(dictName, value);
    let currentItem = item;

    while (currentItem[this._parentFieldName]) {
      const parentItem = this.find(dictName, currentItem[this._parentFieldName]);
      if (!parentItem) break;
      fullLabel = `${this.label(dictName, parentItem[this._labelFieldName])}-${fullLabel}`;
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
    return (this.options.fieldNames?.value || "value") as keyof DictItem;
  }
  private get _labelFieldName() {
    return (this.options.fieldNames?.label || "label") as keyof DictItem;
  }
  private get _parentFieldName() {
    return (this.options.fieldNames?.parent || "parent") as keyof DictItem;
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
