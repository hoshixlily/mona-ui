import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { DropDownGroupableDirective } from "./drop-down-groupable.directive";

describe("DropDownGroupableDirective", () => {
    let directive: DropDownGroupableDirective<any>;
    let listService: ListService<any>;
    beforeEach(() => {
        listService = TestBed.runInInjectionContext(() => new ListService());
        directive = TestBed.runInInjectionContext(() => new DropDownGroupableDirective(listService));
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
