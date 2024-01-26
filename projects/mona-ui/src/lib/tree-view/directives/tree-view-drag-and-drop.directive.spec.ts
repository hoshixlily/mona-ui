import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewDragAndDropDirective } from "./tree-view-drag-and-drop.directive";

describe("TreeViewDragAndDropDirective", () => {
    let directive: TreeViewDragAndDropDirective<any>;
    let treeService: TreeService<any>;
    beforeEach(() => {
        treeService = TestBed.runInInjectionContext(() => new TreeService());
        directive = TestBed.runInInjectionContext(() => new TreeViewDragAndDropDirective(treeService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
