import { Directive, Input, OnInit } from "@angular/core";
import { GridService } from "../services/grid.service";
import { EditableOptions } from "../models/EditableOptions";

@Directive({
    selector: "[monaGridEditable]"
})
export class GridEditableDirective implements OnInit {
    @Input("monaGridEditable")
    public options?: EditableOptions | "";

    public constructor(private readonly gridService: GridService) {}

    public ngOnInit(): void {
        if (this.options) {
            this.gridService.setEditableOptions(this.options);
        } else if (this.options === "") {
            this.gridService.setEditableOptions({ enabled: true });
        }
    }
}
