import { Directive, inject, TemplateRef } from "@angular/core";
import { GridService } from "../services/grid.service";

@Directive({
    selector: "ng-template[monaGridCellTooltipTemplate]",
    standalone: true
})
export class GridCellTooltipTemplateDirective {
    readonly #gridService = inject(GridService);
    readonly #templateRef = inject(TemplateRef);
    public constructor() {
        this.#gridService.cellTooltipTemplate.set(this.#templateRef);
    }
}
