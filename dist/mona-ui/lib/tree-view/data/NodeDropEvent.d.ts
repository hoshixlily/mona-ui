import { PreventableEvent } from "../../utils/PreventableEvent";
import { DropPosition } from "./DropPosition";
import { NodeLookupItem } from "./NodeLookupItem";
export declare class NodeDropEvent extends PreventableEvent<MouseEvent | TouchEvent> {
    readonly node: NodeLookupItem;
    readonly destinationNode?: NodeLookupItem;
    readonly position?: DropPosition;
    constructor(node: NodeLookupItem, destinationNode?: NodeLookupItem, position?: DropPosition, event?: MouseEvent | TouchEvent);
}
