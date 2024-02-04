import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { DropDownVirtualScrollDirective } from "./drop-down-virtual-scroll.directive";

describe("DropDownVirtualScrollDirective", () => {
    let directive: DropDownVirtualScrollDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new DropDownVirtualScrollDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
