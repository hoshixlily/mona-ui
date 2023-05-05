import { PreventableEvent } from "../../utils/PreventableEvent";
import { NodeLookupItem } from "./NodeLookupItem";
export declare class NodeClickEvent extends PreventableEvent<MouseEvent | TouchEvent> {
    readonly node: NodeLookupItem;
    constructor(node: NodeLookupItem, event: MouseEvent | TouchEvent, type: string);
}
