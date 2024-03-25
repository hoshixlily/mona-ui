import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewSelectableDirective } from "./tree-view-selectable.directive";

describe("TreeViewSelectableDirective", () => {
    let directive: TreeViewSelectableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new TreeViewSelectableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
