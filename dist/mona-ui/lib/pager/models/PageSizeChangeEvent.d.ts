import { PreventableEvent } from "../../utils/PreventableEvent";
export declare class PageSizeChangeEvent extends PreventableEvent {
    readonly newPageSize: number;
    readonly oldPageSize: number;
    constructor(newPageSize: number, oldPageSize: number);
}
