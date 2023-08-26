import { PreventableEvent } from "../../utils/PreventableEvent";
import { NodeLookupItem } from "./NodeLookupItem";

export class NodeDragStartEvent extends PreventableEvent<MouseEvent | TouchEvent> {
    public readonly node: NodeLookupItem;

    public constructor(node: NodeLookupItem, event: MouseEvent | TouchEvent) {
        super("dragstart", event);
        this.node = node;
    }
}
