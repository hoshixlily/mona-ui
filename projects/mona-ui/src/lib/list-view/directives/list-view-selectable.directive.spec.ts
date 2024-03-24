import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { ListViewSelectableDirective } from "./list-view-selectable.directive";

describe("ListViewSelectableDirective", () => {
    let directive: ListViewSelectableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListViewSelectableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
