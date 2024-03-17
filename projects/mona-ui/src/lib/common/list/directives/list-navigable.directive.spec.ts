import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListNavigableDirective } from "./list-navigable.directive";

describe("ListNavigableDirective", () => {
    let directive: ListNavigableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListNavigableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
