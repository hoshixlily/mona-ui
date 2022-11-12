import { DropPosition } from "./DropPosition";
import { Node } from "./Node";

export interface DropPositionChangeEvent {
    node?: Node;
    position: DropPosition;
}
