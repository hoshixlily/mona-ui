import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewDisableDirective } from "./tree-view-disable.directive";

describe("TreeViewDisableDirective", () => {
    let directive: TreeViewDisableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new TreeViewDisableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
