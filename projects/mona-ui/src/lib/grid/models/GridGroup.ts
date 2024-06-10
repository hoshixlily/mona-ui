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
    key: string;
    rows: Row[] | VirtualGridGroup[];
    title: string;
}

export type VirtualGridRow = {
    column: Column;
    level: number;
    groupId: string;
    parentList: VirtualGridRow[];
} & ({ type: "group"; groupTitle: string } | { type: "row"; row: Row });
