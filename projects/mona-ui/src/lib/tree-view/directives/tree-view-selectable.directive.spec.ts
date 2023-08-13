import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewService } from "../services/tree-view.service";
import { TreeViewSelectableDirective } from "./tree-view-selectable.directive";

describe("TreeViewSelectableDirective", () => {
    let spectator: SpectatorDirective<TreeViewSelectableDirective>;
    const createDirective = createDirectiveFactory({
        directive: TreeViewSelectableDirective,
        providers: [TreeViewService]
    });

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewSelectable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
