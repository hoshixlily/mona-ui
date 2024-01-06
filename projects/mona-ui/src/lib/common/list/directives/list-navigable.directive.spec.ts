import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListNavigableDirective } from "./list-navigable.directive";

describe("ListNavigableDirective", () => {
    let directive: ListNavigableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListNavigableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
