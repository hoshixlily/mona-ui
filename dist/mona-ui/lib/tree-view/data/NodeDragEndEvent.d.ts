import { NodeLookupItem } from "./NodeLookupItem";
export declare class NodeDragEndEvent {
    readonly node: NodeLookupItem;
    readonly originalEvent?: MouseEvent | TouchEvent;
    constructor(node: NodeLookupItem, originalEvent?: MouseEvent | TouchEvent);
}
