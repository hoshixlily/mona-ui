import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListVirtualScrollDirective } from "./list-virtual-scroll.directive";

describe("ListVirtualScrollDirective", () => {
    let directive: ListVirtualScrollDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListVirtualScrollDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
