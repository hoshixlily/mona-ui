import { WritableSignal } from "@angular/core";
import { Column } from "./Column";
import { Row } from "./Row";

export interface GridGroup {
    collapsed: boolean;
    column: Column;
    rows: Row[];
}

export interface VirtualGridGroup {
    column: Column;
    rows: Row[] | VirtualGridGroup[];
    title: string;
    uid: string;
}

export type VirtualGridRow = {
    column: Column;
    level: number;
    groupId: string;
    parent: VirtualGridRow | null;
} & ({ type: "group"; groupTitle: string } | { type: "row"; row: Row });
