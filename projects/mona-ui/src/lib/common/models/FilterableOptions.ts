export type FilterOperator = "contains" | "endsWith" | "startsWith" | ((value: string, filter: string) => boolean);

export interface FilterableOptions {
    caseSensitive: boolean;
    debounce: number;
    enabled: boolean;
    operator: FilterOperator;
}
