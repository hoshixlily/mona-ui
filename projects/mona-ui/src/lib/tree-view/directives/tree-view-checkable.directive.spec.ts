import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewCheckableDirective } from "./tree-view-checkable.directive";

describe("TreeViewCheckableDirective", () => {
    let spectator: SpectatorDirective<TreeViewCheckableDirective>;
    const createDirective = createDirectiveFactory(TreeViewCheckableDirective);

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewCheckable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
