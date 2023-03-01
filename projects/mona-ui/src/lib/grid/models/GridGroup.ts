import { Column } from "./Column";

export interface GridGroup {
    column?: Column | null;
    rowData: {
        groupHeaderRow: boolean;
        rows: any[];
    };
}
