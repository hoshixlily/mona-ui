import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewExpandableDirective } from "./tree-view-expandable.directive";

describe("TreeViewExpandableDirective", () => {
    let directive: TreeViewExpandableDirective<any>;
    let treeService: TreeService<any>;
    beforeEach(() => {
        treeService = TestBed.runInInjectionContext(() => new TreeService());
        directive = TestBed.runInInjectionContext(() => new TreeViewExpandableDirective(treeService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
