import { TestBed } from "@angular/core/testing";
import { GridService } from "../services/grid.service";
import { GridContextMenuDirective } from "./grid-context-menu.directive";

describe("GridContextMenuDirective", () => {
    let directive: GridContextMenuDirective;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService]
        });
        directive = TestBed.runInInjectionContext(() => new GridContextMenuDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
