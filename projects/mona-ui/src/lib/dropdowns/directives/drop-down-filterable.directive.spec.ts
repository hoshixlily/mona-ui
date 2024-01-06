import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { DropDownFilterableDirective } from "./drop-down-filterable.directive";

describe("DropDownFilterableDirective", () => {
    let directive: DropDownFilterableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new DropDownFilterableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
