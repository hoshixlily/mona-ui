import { PreventableEvent } from "../../utils/PreventableEvent";
export declare class CellEditEvent extends PreventableEvent {
    #private;
    constructor(options: CellEditEventOptions);
    get field(): string;
    get newValue(): any;
    get oldValue(): any;
    get rowData(): any;
    setNewValue(value: any): void;
}
export interface CellEditEventOptions {
    field: string;
    newValue: any;
    oldValue: any;
    rowData: any;
    setNewValue: (value: any) => void;
}
