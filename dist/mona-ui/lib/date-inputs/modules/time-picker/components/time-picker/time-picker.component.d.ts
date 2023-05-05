import { ChangeDetectorRef, ElementRef, OnChanges, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FocusMonitor } from "@angular/cdk/a11y";
import { PopupService } from "../../../../../popup/services/popup.service";
import * as i0 from "@angular/core";
export declare class TimePickerComponent extends AbstractDateInputComponent implements OnInit, OnChanges {
    protected readonly cdr: ChangeDetectorRef;
    readonly elementRef: ElementRef<HTMLElement>;
    private readonly focusMonitor;
    private readonly popupService;
    readonly timeIcon: IconDefinition;
    hourFormat: "12" | "24";
    showSeconds: boolean;
    timePopupTemplateRef?: TemplateRef<any>;
    constructor(cdr: ChangeDetectorRef, elementRef: ElementRef<HTMLElement>, focusMonitor: FocusMonitor, popupService: PopupService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    onDateStringEdit(dateString: string): void;
    onTimeInputBlur(): void;
    onTimeInputButtonClick(): void;
    onTimeSelectorValueChange(date: Date | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimePickerComponent, "mona-time-picker", never, { "hourFormat": { "alias": "hourFormat"; "required": false; }; "showSeconds": { "alias": "showSeconds"; "required": false; }; }, {}, never, never, false, never>;
}
