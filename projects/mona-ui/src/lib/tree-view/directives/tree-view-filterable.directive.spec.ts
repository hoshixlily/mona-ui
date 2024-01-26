import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewFilterableDirective } from "./tree-view-filterable.directive";

describe("TreeFilterableDirective", () => {
    let directive: TreeViewFilterableDirective<any>;
    let treeService: TreeService<any>;
    beforeEach(() => {
        treeService = TestBed.runInInjectionContext(() => new TreeService());
        directive = TestBed.runInInjectionContext(() => new TreeViewFilterableDirective(treeService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
