import { signal, WritableSignal } from "@angular/core";

export interface ListItemOptions {
    data: any;
    text: string;
    textField?: string;
    value: any;
    valueField?: string;
    disabled?: boolean;
}

export class PopupListItem {
    public data: any;
    public disabled: boolean;
    public highlighted: WritableSignal<boolean> = signal(false);
    public selected: WritableSignal<boolean> = signal(false);
    public text: string;
    public textField?: string;
    public value: any;
    public valueField?: string;

    public constructor(options: ListItemOptions) {
        this.data = options.data;
        this.text = options.text;
        this.textField = options.textField;
        this.value = options.value;
        this.valueField = options.valueField;
        this.disabled = options.disabled ?? false;
    }

    public dataEquals(other: any): boolean {
        if (!other) {
            return false;
        }
        if (this.valueField) {
            return this.data[this.valueField] === other[this.valueField];
        }
        return this.value === other;
    }
}
