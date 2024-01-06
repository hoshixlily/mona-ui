import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListSelectableDirective } from "./list-selectable.directive";

describe("ListSelectableDirective", () => {
    let directive: ListSelectableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListSelectableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
