// https://github.com/yanhao98/vue-memoize-dict/blob/a1f73b60b0b51823ffb3dc5ed4606f3f8d0bb644/packages/playground/src/components/MemoizeDict.vue
// https://github.dev/vueuse/vueuse/blob/main/packages/core/useMemoize/index.ts

import { computedAsync, useMemoize } from "@vueuse/core";
export class MemoizeDict<DictItem = Record<string, unknown>> {
  private options;
  private memoFetch;

  constructor(options: DatasetOptions<DictItem>) {
    this.options = options;
    this.memoFetch = useMemoize(
      this._fetch.bind(this),
      {
        getKey: (dictName: string) => dictName,
      }
    );
  }

  public get(dictName: string): DictItem[] | undefined {
    if (!this.memoFetch.cache.has(dictName))
      this.memoFetch(dictName);

    const cachedPromise = this.memoFetch.cache.get(dictName)!;
    cachedPromise!.__computedAsyncRef__ ??= computedAsync(() => cachedPromise);
    return cachedPromise!.__computedAsyncRef__.value;
  }

  /**
   * Get result from cache or call memoized function
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
  public item(...args: Parameters<typeof this.find>) {
    return this.find(...args);
  }

  public label(dictName: string, value: DictItem[keyof DictItem]): string {
    if (!value) return '';

    const item = this.find(dictName, value);
    return item?.[this._labelFieldName] as string || `${value}`
  }
  public labels(dictName: string, values: DictItem[keyof DictItem][]): string[] {
    if (values === undefined || values === null)
      return []

    if (!Array.isArray(values)) {
      console.error('[vue-memoize-dict] labels: values is not array', values)
      return values
    }

    return values
      .filter((value) => value !== null && value !== undefined && value !== '')
      .map((value) => this.label(dictName, value));
  }

  public treeLabel(dictName: string, value: DictItem[keyof DictItem]): string {
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
  public fullLabel(...args: Parameters<typeof this.treeLabel>) {
    return this.treeLabel(...args);
  }


  private _fetch(dictName: string): Promise<DictItem[]> & { __computedAsyncRef__?: ReturnType<typeof computedAsync<DictItem[]>> } {
    const config = this.options.config[dictName];
    if (!config) {
      throw new Error(`config not found: ${dictName}`);
    }
    let promise = config.data() as ReturnType<typeof this._fetch>;
    if (!(promise instanceof Promise)) {
      promise = Promise.resolve(promise);
    }
    promise.__computedAsyncRef__ = undefined;
    return promise;
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

interface DatasetConfig<DictItem = Record<string, unknown>> {
  data(/* params?: Recordable<unknown> */): Promise<DictItem[]> | DictItem[];
}
interface DatasetOptions<DictItem> {
  config: Record<string, DatasetConfig<DictItem> | undefined>;
  fieldNames?: FieldNamesConfig<DictItem>;
}

