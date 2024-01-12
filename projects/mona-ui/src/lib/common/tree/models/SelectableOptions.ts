export type SelectableOptions = {
    childrenOnly: boolean;
    enabled: boolean;
} & ({ mode: "single"; toggleable?: boolean } | { mode: "multiple" });
