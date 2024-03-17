import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { ListViewNavigableDirective } from "./list-view-navigable.directive";

describe("ListViewNavigableDirective", () => {
    let directive: ListViewNavigableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new ListViewNavigableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
