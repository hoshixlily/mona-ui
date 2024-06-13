import { TestBed } from "@angular/core/testing";
import { GridService } from "../services/grid.service";
import { GridGroupableDirective } from "./grid-groupable.directive";

describe("GridGroupableDirective", () => {
    let directive: GridGroupableDirective;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService]
        });
        directive = TestBed.runInInjectionContext(() => new GridGroupableDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
