import { PreventableEvent } from "../../utils/PreventableEvent";

export class CellEditEvent extends PreventableEvent {
    readonly #options: CellEditEventOptions;
    public constructor(options: CellEditEventOptions) {
        super("cellEdit");
        this.#options = options;
    }

    public get field(): string {
        return this.#options.field;
    }

    public get newValue(): any {
        return this.#options.newValue;
    }

    public get oldValue(): any {
        return this.#options.oldValue;
    }

    public get rowData(): any {
        return this.#options.rowData;
    }

    public setNewValue(value: any): void {
        this.#options.setNewValue(value);
    }
}

export interface CellEditEventOptions {
    field: string;
    newValue: any;
    oldValue: any;
    rowData: any;
    setNewValue: (value: any) => void;
}
