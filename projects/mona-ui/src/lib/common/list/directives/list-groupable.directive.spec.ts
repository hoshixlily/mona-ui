import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListGroupableDirective } from "./list-groupable.directive";

describe("ListGroupableDirective", () => {
    let directive: ListGroupableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListGroupableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
