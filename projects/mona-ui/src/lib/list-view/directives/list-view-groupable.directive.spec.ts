import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { ListViewGroupableDirective } from "./list-view-groupable.directive";

describe("ListViewGroupableDirective", () => {
    let directive: ListViewGroupableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListViewGroupableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
