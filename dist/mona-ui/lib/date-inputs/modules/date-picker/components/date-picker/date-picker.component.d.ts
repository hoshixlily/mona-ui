import { ChangeDetectorRef, ElementRef, OnInit } from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { FocusMonitor } from "@angular/cdk/a11y";
import { AbstractDatePickerComponent } from "../../../../components/abstract-date-picker/abstract-date-picker.component";
import * as i0 from "@angular/core";
export declare class DatePickerComponent extends AbstractDatePickerComponent implements OnInit {
    protected readonly cdr: ChangeDetectorRef;
    protected readonly elementRef: ElementRef<HTMLElement>;
    protected readonly focusMonitor: FocusMonitor;
    protected readonly popupService: PopupService;
    format: string;
    constructor(cdr: ChangeDetectorRef, elementRef: ElementRef<HTMLElement>, focusMonitor: FocusMonitor, popupService: PopupService);
    static ɵfac: i0.ɵɵFactoryDeclaration<DatePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DatePickerComponent, "mona-date-picker", never, { "format": { "alias": "format"; "required": false; }; }, {}, never, never, false, never>;
}
