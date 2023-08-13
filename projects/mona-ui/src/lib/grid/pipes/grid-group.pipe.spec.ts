import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { Column } from "../models/Column";
import { Row } from "../models/Row";
import { GridService } from "../services/grid.service";
import { GridGroupPipe } from "./grid-group.pipe";

describe("GridGroupPipe", () => {
    let spectator: SpectatorPipe<GridGroupPipe>;
    const createPipe = createPipeFactory({
        pipe: GridGroupPipe,
        providers: [GridService]
    });

    let column: Column;
    let rows: Row[] = [];

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
    });

    it("should create", () => {
        spectator = createPipe("{{ rows | gridGroup:column:page }}", {
            hostProps: {
                rows: rows,
                column: column,
                page: 1
            }
        });
        expect(spectator).toBeDefined(); // TODO: Placeholder test, change this!
    });
});
