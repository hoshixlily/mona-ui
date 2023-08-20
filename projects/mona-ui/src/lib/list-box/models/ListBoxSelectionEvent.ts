export interface ListBoxSelectionEvent<T = any> {
    current: { item: T; index: number } | null;
    previous: { item: T; index: number } | null;
}
