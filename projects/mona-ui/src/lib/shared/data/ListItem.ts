export interface ListItem<T = any> {
    data: T;
    disabled?: boolean;
    index: number;
    text: string;
    value: string;
}
