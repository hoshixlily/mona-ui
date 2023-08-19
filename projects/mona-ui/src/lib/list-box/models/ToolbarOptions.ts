import { Position } from "../../models/Position";

export interface ToolbarOptions {
    actions: ToolbarAction[];
    position: Position;
}

export type ToolbarAction =
    | "moveDown"
    | "moveUp"
    | "remove"
    | "transferAllFrom"
    | "transferAllTo"
    | "transferFrom"
    | "transferTo";
