import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../common/tree/services/tree.service";
import { TreeViewDragAndDropDirective } from "./tree-view-drag-and-drop.directive";

describe("TreeViewDragAndDropDirective", () => {
    let directive: TreeViewDragAndDropDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new TreeViewDragAndDropDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
