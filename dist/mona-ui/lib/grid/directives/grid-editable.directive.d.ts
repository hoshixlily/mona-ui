import { OnInit } from "@angular/core";
import { GridService } from "../services/grid.service";
import { EditableOptions } from "../models/EditableOptions";
import * as i0 from "@angular/core";
export declare class GridEditableDirective implements OnInit {
    private readonly gridService;
    options?: EditableOptions | "";
    constructor(gridService: GridService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridEditableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GridEditableDirective, "[monaGridEditable]", never, { "options": { "alias": "monaGridEditable"; "required": false; }; }, {}, never, never, false, never>;
}
