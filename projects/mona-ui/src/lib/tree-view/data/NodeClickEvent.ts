import { PreventableEvent } from "../../utils/PreventableEvent";
import { NodeLookupItem } from "./NodeLookupItem";

export class NodeClickEvent extends PreventableEvent<MouseEvent | TouchEvent> {
    public readonly node: NodeLookupItem;

    public constructor(node: NodeLookupItem, event: MouseEvent | TouchEvent, type: string) {
        super(type, event);
        this.node = node;
    }
}
