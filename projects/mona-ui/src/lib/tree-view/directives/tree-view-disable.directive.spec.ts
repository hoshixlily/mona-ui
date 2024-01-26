import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewDisableDirective } from "./tree-view-disable.directive";

describe("TreeViewDisableDirective", () => {
    let directive: TreeViewDisableDirective<any>;
    let treeService: TreeService<any>;
    beforeEach(() => {
        treeService = TestBed.runInInjectionContext(() => new TreeService());
        directive = TestBed.runInInjectionContext(() => new TreeViewDisableDirective(treeService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
