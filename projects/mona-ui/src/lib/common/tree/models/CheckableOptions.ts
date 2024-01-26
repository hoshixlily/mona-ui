export interface CheckableOptions {
    checkChildren?: boolean;
    checkDisabledChildren?: boolean;
    checkParents?: boolean;
    childrenOnly?: boolean;
    enabled?: boolean;
    mode?: "multiple" | "single";
}
