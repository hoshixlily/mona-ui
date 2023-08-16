import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { ListViewService } from "../services/list-view.service";
import { ListViewSelectableDirective } from "./list-view-selectable.directive";

describe("ListViewSelectableDirective", () => {
    let spectator: SpectatorDirective<ListViewSelectableDirective>;
    const createDirective = createDirectiveFactory({
        directive: ListViewSelectableDirective,
        providers: [ListViewService]
    });

    beforeEach(() => (spectator = createDirective(`<mona-list-view monaListViewSelectable></mona-list-view>`)));

    it("should create an instance", () => {
        expect(spectator.directive).toBeTruthy();
    });
});
