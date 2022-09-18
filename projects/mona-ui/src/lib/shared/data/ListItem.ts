export interface ListItem<T = any> {
    data: T;
    disabled?: boolean;
    index: number;
    selected?: boolean;
    text: string;
    value: string;
}
