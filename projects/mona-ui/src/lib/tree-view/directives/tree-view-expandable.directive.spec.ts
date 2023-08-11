import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewExpandableDirective } from "./tree-view-expandable.directive";

describe("TreeViewExpandableDirective", () => {
    let spectator: SpectatorDirective<TreeViewExpandableDirective>;
    const createDirective = createDirectiveFactory(TreeViewExpandableDirective);

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewExpandable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
