import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewFilterableDirective } from "./tree-view-filterable.directive";

describe("TreeViewFilterableDirective", () => {
    let directive: TreeViewFilterableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new TreeViewFilterableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
