export interface ListItemOptions {
    data: any;
    text: string;
    textField?: string;
    value: any;
    valueField?: string;
    disabled?: boolean;
}
export declare class PopupListItem {
    data: any;
    disabled: boolean;
    highlighted: boolean;
    selected: boolean;
    text: string;
    textField?: string;
    value: any;
    valueField?: string;
    constructor(options: ListItemOptions);
    dataEquals(other: any): boolean;
}
