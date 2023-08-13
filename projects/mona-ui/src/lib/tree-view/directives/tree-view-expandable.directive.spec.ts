import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewService } from "../services/tree-view.service";
import { TreeViewExpandableDirective } from "./tree-view-expandable.directive";

describe("TreeViewExpandableDirective", () => {
    let spectator: SpectatorDirective<TreeViewExpandableDirective>;
    const createDirective = createDirectiveFactory({
        directive: TreeViewExpandableDirective,
        providers: [TreeViewService]
    });

    beforeEach(() => {
        spectator = createDirective(`<mona-tree-view monaTreeViewExpandable></mona-tree-view>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
