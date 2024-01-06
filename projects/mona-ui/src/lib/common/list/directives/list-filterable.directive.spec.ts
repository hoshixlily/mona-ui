import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListFilterableDirective } from "./list-filterable.directive";

describe("ListFilterableDirective", () => {
    let directive: ListFilterableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListFilterableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
