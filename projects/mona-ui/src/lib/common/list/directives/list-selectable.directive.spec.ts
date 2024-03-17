import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListSelectableDirective } from "./list-selectable.directive";

describe("ListSelectableDirective", () => {
    let directive: ListSelectableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListSelectableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
