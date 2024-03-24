import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { ListViewVirtualScrollDirective } from "./list-view-virtual-scroll.directive";

describe("ListViewVirtualScrollDirective", () => {
    let directive: ListViewVirtualScrollDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListViewVirtualScrollDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
