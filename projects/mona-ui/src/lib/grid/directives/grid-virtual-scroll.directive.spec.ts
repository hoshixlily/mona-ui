import { TestBed } from "@angular/core/testing";
import { GridService } from "../services/grid.service";
import { GridVirtualScrollDirective } from "./grid-virtual-scroll.directive";

describe("GridVirtualScrollDirective", () => {
    let directive: GridVirtualScrollDirective;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService]
        });
        directive = TestBed.runInInjectionContext(() => new GridVirtualScrollDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
