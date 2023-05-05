import { Column } from "./Column";
import { Row } from "./Row";
export interface GridGroup {
    collapsed: boolean;
    column: Column;
    rows: Row[];
}
