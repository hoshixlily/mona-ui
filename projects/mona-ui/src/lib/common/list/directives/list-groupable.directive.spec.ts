import { TestBed } from "@angular/core/testing";
import { ListService } from "../services/list.service";
import { ListGroupableDirective } from "./list-groupable.directive";

describe("ListGroupableDirective", () => {
    let directive: ListGroupableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListGroupableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
