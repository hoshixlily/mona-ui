import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { ListViewSelectableDirective } from "./list-view-selectable.directive";

describe("ListViewSelectableDirective", () => {
    let directive: ListViewSelectableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new ListViewSelectableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
