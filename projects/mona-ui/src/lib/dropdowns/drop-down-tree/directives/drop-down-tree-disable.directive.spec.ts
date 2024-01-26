import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../../common/tree/services/tree.service";
import { DropDownTreeDisableDirective } from "./drop-down-tree-disable.directive";

describe("DropDownTreeDisableDirective", () => {
    let directive: DropDownTreeDisableDirective<any>;
    let treeService: TreeService<any>;
    beforeEach(() => {
        treeService = TestBed.runInInjectionContext(() => new TreeService());
        directive = TestBed.runInInjectionContext(() => new DropDownTreeDisableDirective(treeService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
