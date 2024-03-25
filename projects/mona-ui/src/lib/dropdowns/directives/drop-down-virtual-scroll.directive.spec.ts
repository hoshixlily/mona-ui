import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { DropDownVirtualScrollDirective } from "./drop-down-virtual-scroll.directive";

describe("DropDownVirtualScrollDirective", () => {
    let directive: DropDownVirtualScrollDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new DropDownVirtualScrollDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
