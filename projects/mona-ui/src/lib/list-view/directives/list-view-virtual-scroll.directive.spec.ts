import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { ListViewVirtualScrollDirective } from "./list-view-virtual-scroll.directive";

describe("ListViewVirtualScrollDirective", () => {
    let directive: ListViewVirtualScrollDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListViewVirtualScrollDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
