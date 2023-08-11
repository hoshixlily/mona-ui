import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewSelectableDirective } from "./tree-view-selectable.directive";

describe("TreeViewSelectableDirective", () => {
    let spectator: SpectatorDirective<TreeViewSelectableDirective>;
    const createDirective = createDirectiveFactory(TreeViewSelectableDirective);

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewSelectable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
