import { ElementRef, EventEmitter, OnInit, TemplateRef } from "@angular/core";
import { AbstractDropDownListComponent } from "../../../../components/abstract-drop-down-list/abstract-drop-down-list.component";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupListService } from "../../../../services/popup-list.service";
import { SelectionMode } from "../../../../../models/SelectionMode";
import { PopupListValueChangeEvent } from "../../../../data/PopupListValueChangeEvent";
import { PopupListItem } from "../../../../data/PopupListItem";
import * as i0 from "@angular/core";
export declare class DropDownListComponent extends AbstractDropDownListComponent implements OnInit {
    protected readonly elementRef: ElementRef<HTMLElement>;
    protected readonly popupListService: PopupListService;
    protected readonly popupService: PopupService;
    protected openOnEnter: boolean;
    protected selectionMode: SelectionMode;
    valuePopupListItem?: PopupListItem;
    filterable: boolean;
    groupTemplate?: TemplateRef<any>;
    itemTemplate?: TemplateRef<any>;
    value?: any;
    valueChange: EventEmitter<any | any[]>;
    valueTemplate?: TemplateRef<any>;
    constructor(elementRef: ElementRef<HTMLElement>, popupListService: PopupListService, popupService: PopupService);
    clearValue(event: MouseEvent): void;
    ngOnInit(): void;
    onPopupListValueChange(event: PopupListValueChangeEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DropDownListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DropDownListComponent, "mona-drop-down-list", never, { "filterable": { "alias": "filterable"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, { "valueChange": "valueChange"; }, ["groupTemplate", "itemTemplate", "valueTemplate"], never, false, never>;
}
