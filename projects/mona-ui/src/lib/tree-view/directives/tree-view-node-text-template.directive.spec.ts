import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { TreeViewNodeTextTemplateDirective } from "./tree-view-node-text-template.directive";

describe("TreeViewNodeTextTemplateDirective", () => {
    let spectator: SpectatorDirective<TreeViewNodeTextTemplateDirective>;
    const createDirective = createDirectiveFactory(TreeViewNodeTextTemplateDirective);

    beforeEach(() => {
        spectator = createDirective(`<ng-template monaTreeViewNodeTextTemplate></ng-template>`);
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
