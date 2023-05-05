import { ChangeDetectorRef, ElementRef, OnInit, TemplateRef } from "@angular/core";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupService } from "../../../../../popup/services/popup.service";
import { FocusMonitor } from "@angular/cdk/a11y";
import { AbstractDatePickerComponent } from "../../../../components/abstract-date-picker/abstract-date-picker.component";
import * as i0 from "@angular/core";
export declare class DateTimePickerComponent extends AbstractDatePickerComponent implements OnInit {
    protected readonly cdr: ChangeDetectorRef;
    protected readonly elementRef: ElementRef<HTMLElement>;
    protected readonly focusMonitor: FocusMonitor;
    protected readonly popupService: PopupService;
    readonly timeIcon: IconDefinition;
    format: string;
    hourFormat: "12" | "24";
    showSeconds: boolean;
    timePopupTemplateRef?: TemplateRef<any>;
    constructor(cdr: ChangeDetectorRef, elementRef: ElementRef<HTMLElement>, focusMonitor: FocusMonitor, popupService: PopupService);
    onTimeInputButtonClick(): void;
    onTimeSelectorValueChange(date: Date | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateTimePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DateTimePickerComponent, "mona-date-time-picker", never, { "format": { "alias": "format"; "required": false; }; "hourFormat": { "alias": "hourFormat"; "required": false; }; "showSeconds": { "alias": "showSeconds"; "required": false; }; }, {}, never, never, false, never>;
}
