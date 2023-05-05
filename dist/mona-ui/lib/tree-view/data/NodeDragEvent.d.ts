import { DropPosition } from "./DropPosition";
import { NodeLookupItem } from "./NodeLookupItem";
export declare class NodeDragEvent {
    readonly node: NodeLookupItem;
    readonly destinationNode?: NodeLookupItem;
    readonly position?: DropPosition;
    readonly originalEvent?: MouseEvent | TouchEvent;
    constructor(node: NodeLookupItem, destinationNode?: NodeLookupItem, position?: DropPosition, originalEvent?: MouseEvent | TouchEvent);
}
