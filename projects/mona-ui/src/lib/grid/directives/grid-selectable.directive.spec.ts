import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { GridService } from "../services/grid.service";
import { GridSelectableDirective } from "./grid-selectable.directive";

describe("GridSelectableDirective", () => {
    let spectator: SpectatorDirective<GridSelectableDirective>;
    const createDirective = createDirectiveFactory({
        directive: GridSelectableDirective,
        providers: [GridService]
    });
    let gridData = [
        { id: 1, name: "test1" },
        { id: 2, name: "test2" },
        { id: 3, name: "test3" }
    ];
    let selectedKeys = [1, 2];

    beforeEach(() => {
        spectator = createDirective(`<mona-grid monaGridSelectable></mona-grid>`, {
            hostProps: {
                data: gridData
            },
            props: {
                selectionKey: "id",
                selectedKeys: selectedKeys
            }
        });
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
