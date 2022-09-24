export interface ListItemOptions<T = any> {
    data: T;
    disabled?: boolean;
    index: number;
    selected?: boolean;
    text: string;
    textField: string;
    value: string;
    valueField: string;
}

export class ListItem<T = any> {
    public readonly data: T;
    public readonly index: number;
    public readonly text: string;
    public readonly textField: string = "";
    public readonly value: string;
    public readonly valueField: string = "";
    public disabled?: boolean;
    public selected?: boolean;

    public constructor(options: ListItemOptions<T>) {
        this.data = options.data;
        this.disabled = options.disabled;
        this.index = options.index;
        this.selected = options.selected;
        this.text = options.text;
        this.textField = options.textField;
        this.value = options.value;
        this.valueField = options.valueField;
    }

    public dataEquals(other: any): boolean {
        if (this.valueField) {
            const dataValue = (this.data as any)[this.valueField];
            return dataValue === other[this.valueField];
        }
        return this.data === other;
    }

    public equals(other: ListItem<T> | null): boolean {
        return this.value === other?.value;
    }
}
