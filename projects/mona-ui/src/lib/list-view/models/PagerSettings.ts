export interface PagerSettings {
    enabled: boolean;
    firstLast?: boolean;
    info?: boolean;
    pageSizeValues: number[] | boolean;
    previousNext: boolean;
    type: "numeric" | "input";
    visiblePages: number;
}
