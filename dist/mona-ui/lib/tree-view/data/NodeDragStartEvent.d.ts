import { PreventableEvent } from "../../utils/PreventableEvent";
import { NodeLookupItem } from "./NodeLookupItem";
export declare class NodeDragStartEvent extends PreventableEvent<MouseEvent | TouchEvent> {
    readonly node: NodeLookupItem;
    constructor(node: NodeLookupItem, event: MouseEvent | TouchEvent);
}
