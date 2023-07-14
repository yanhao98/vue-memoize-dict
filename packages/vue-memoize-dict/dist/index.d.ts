export declare class MemoizeDict<DictItem = Record<string, unknown>> {
    private options;
    private memoFetch;
    private asyncComputedMap;
    constructor(options: DatasetOptions);
    get(dictName: string): DictItem[] | undefined;
    fetch(dictName: string): Promise<DictItem[]>;
    load(dictName: string): Promise<DictItem[]>;
    clear(): void;
    delete(dictName: string): void;
    find(dictName: string, value: string | number): DictItem | undefined;
    label(dictName: string, value: string | number): NonNullable<DictItem>[keyof NonNullable<DictItem>] | undefined;
    private _fetch;
}
type Nullable<T> = T | undefined;
interface FieldNamesConfig {
    label?: string;
    value?: string;
}
export interface DatasetConfig {
    data(): Promise<unknown[]>;
}
interface DatasetOptions {
    config: Record<string, Nullable<DatasetConfig>>;
    fieldNames?: FieldNamesConfig;
}
export {};
