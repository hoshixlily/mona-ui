import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListFilterableDirective } from "./list-filterable.directive";

describe("ListFilterableDirective", () => {
    let directive: ListFilterableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListFilterableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
