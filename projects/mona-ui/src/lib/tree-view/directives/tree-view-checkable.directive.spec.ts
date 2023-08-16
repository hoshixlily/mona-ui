import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewService } from "../services/tree-view.service";
import { TreeViewCheckableDirective } from "./tree-view-checkable.directive";

describe("TreeViewCheckableDirective", () => {
    let spectator: SpectatorDirective<TreeViewCheckableDirective>;
    const createDirective = createDirectiveFactory({
        directive: TreeViewCheckableDirective,
        providers: [TreeViewService]
    });

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewCheckable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
