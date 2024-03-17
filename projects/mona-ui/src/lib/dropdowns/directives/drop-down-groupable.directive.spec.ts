import { TestBed } from "@angular/core/testing";
import { ListService } from "../../common/list/services/list.service";
import { DropDownGroupableDirective } from "./drop-down-groupable.directive";

describe("DropDownGroupableDirective", () => {
    let directive: DropDownGroupableDirective<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ListService]
        });
        directive = TestBed.runInInjectionContext(() => new DropDownGroupableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
