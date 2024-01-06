import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListVirtualScrollDirective } from "./list-virtual-scroll.directive";

describe("ListVirtualScrollDirective", () => {
    let directive: ListVirtualScrollDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListVirtualScrollDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
