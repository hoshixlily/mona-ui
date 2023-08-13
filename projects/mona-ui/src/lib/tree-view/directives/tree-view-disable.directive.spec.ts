import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewService } from "../services/tree-view.service";
import { TreeViewDisableDirective } from "./tree-view-disable.directive";

describe("TreeViewDisableDirective", () => {
    let spectator: SpectatorDirective<TreeViewDisableDirective>;
    const createDirective = createDirectiveFactory({
        directive: TreeViewDisableDirective,
        providers: [TreeViewService]
    });

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewDisable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
