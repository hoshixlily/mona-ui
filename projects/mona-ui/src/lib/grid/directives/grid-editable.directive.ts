import { Directive, effect, inject, input, untracked } from "@angular/core";
import { EditableOptions } from "../models/EditableOptions";
import { GridService } from "../services/grid.service";

@Directive({
    selector: "[monaGridEditable]",
    standalone: true
})
export class GridEditableDirective {
    readonly #gridService: GridService = inject(GridService);

    public options = input<EditableOptions | "" | undefined>(undefined, {
        alias: "monaGridEditable"
    });

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options) {
                    this.#gridService.setEditableOptions(options);
                } else if (options === "") {
                    this.#gridService.setEditableOptions({ enabled: true });
                }
            });
        });
    }
}
