import { PreventableEvent } from "../../utils/PreventableEvent";

export class PageSizeChangeEvent extends PreventableEvent {
    public readonly newPageSize: number;
    public readonly oldPageSize: number;
    public constructor(newPageSize: number, oldPageSize: number) {
        super("pageSizeChange");
        this.newPageSize = newPageSize;
        this.oldPageSize = oldPageSize;
    }
}
