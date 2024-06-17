import { TemplateRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { GridService } from "../services/grid.service";
import { GridCellTooltipTemplateDirective } from "./grid-cell-tooltip-template.directive";

describe("GridCellTooltipTemplateDirective", () => {
    let directive: GridCellTooltipTemplateDirective;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GridService, TemplateRef]
        });
        directive = TestBed.runInInjectionContext(() => new GridCellTooltipTemplateDirective());
    });
    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });
});
