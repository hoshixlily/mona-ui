import { DropPosition } from "./DropPosition";
import { NodeLookupItem } from "./NodeLookupItem";

export class NodeDragEvent {
    public readonly node: NodeLookupItem;
    public readonly destinationNode?: NodeLookupItem;
    public readonly position?: DropPosition;
    public readonly originalEvent?: MouseEvent | TouchEvent;

    public constructor(
        node: NodeLookupItem,
        destinationNode?: NodeLookupItem,
        position?: DropPosition,
        originalEvent?: MouseEvent | TouchEvent
    ) {
        this.node = node;
        this.destinationNode = destinationNode;
        this.position = position;
        this.originalEvent = originalEvent;
    }
}
