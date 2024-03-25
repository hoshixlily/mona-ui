import { TestBed } from "@angular/core/testing";
import { TreeService } from "../../../common/tree/services/tree.service";
import { DropDownTreeDisableDirective } from "./drop-down-tree-disable.directive";

describe("DropDownTreeDisableDirective", () => {
    let directive: DropDownTreeDisableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TreeService]
        });
        directive = TestBed.runInInjectionContext(() => new DropDownTreeDisableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
