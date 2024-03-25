import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewExpandableDirective } from "./tree-view-expandable.directive";

describe("TreeViewExpandableDirective", () => {
    let directive: TreeViewExpandableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new TreeViewExpandableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
