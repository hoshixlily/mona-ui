import { PreventableEvent } from "../../utils/PreventableEvent";
import { DropPosition } from "./DropPosition";
import { NodeLookupItem } from "./NodeLookupItem";

export class NodeDropEvent extends PreventableEvent<MouseEvent | TouchEvent> {
    public readonly node: NodeLookupItem;
    public readonly destinationNode?: NodeLookupItem;
    public readonly position?: DropPosition;

    public constructor(
        node: NodeLookupItem,
        destinationNode?: NodeLookupItem,
        position?: DropPosition,
        event?: MouseEvent | TouchEvent
    ) {
        super("drop", event);
        this.node = node;
        this.destinationNode = destinationNode;
        this.position = position;
    }
}
