import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewDisableDirective } from "./tree-view-disable.directive";

describe("TreeViewDisableDirective", () => {
    let spectator: SpectatorDirective<TreeViewDisableDirective>;
    const createDirective = createDirectiveFactory(TreeViewDisableDirective);

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewDisable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
