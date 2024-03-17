import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewCheckableDirective } from "./tree-view-checkable.directive";

describe("TreeViewCheckableDirective", () => {
    let directive: TreeViewCheckableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new TreeViewCheckableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
