import { NodeLookupItem } from "./NodeLookupItem";

export class NodeDragEndEvent {
    public readonly node: NodeLookupItem;
    public readonly originalEvent?: MouseEvent | TouchEvent;

    public constructor(node: NodeLookupItem, originalEvent?: MouseEvent | TouchEvent) {
        this.node = node;
        this.originalEvent = originalEvent;
    }
}
