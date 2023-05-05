import { AfterContentInit, OnDestroy, OnInit } from "@angular/core";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { ButtonService } from "../../../../services/button.service";
import * as i0 from "@angular/core";
export declare class ButtonGroupComponent implements OnInit, AfterContentInit, OnDestroy {
    #private;
    private readonly buttonService;
    private readonly componentDestroy$;
    private selectionMode;
    private buttons;
    set disabled(disabled: boolean);
    get disabled(): boolean;
    set selection(selection: SelectionMode);
    constructor(buttonService: ButtonService);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    private notifyDisableStateChanged;
    private notifySelectionStateChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonGroupComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ButtonGroupComponent, "mona-button-group", never, { "disabled": { "alias": "disabled"; "required": false; }; "selection": { "alias": "selection"; "required": false; }; }, {}, ["buttons"], ["button[monaButton]"], false, never>;
}
