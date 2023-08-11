import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { Column } from "../models/Column";
import { Row } from "../models/Row";
import { GridGroupPipe } from "./grid-group.pipe";

describe("GridGroupPipe", () => {
    let spectator: SpectatorPipe<GridGroupPipe>;
    const createPipe = createPipeFactory(GridGroupPipe);

    let column: Column;
    let rows: Row[];

    beforeEach(() => {
        column = new Column();
        column.field = "test";
        const dataList = [
            { test: "a" },
            { test: "b" },
            { test: "c" },
            { test: "a" },
            { test: "b" },
            { test: "c" },
            { test: "a" }
        ];
        dataList.forEach(data => {
            const row = new Row(data);
            rows.push(row);
        });

        spectator = createPipe();
    });
});
