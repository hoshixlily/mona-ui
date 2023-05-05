import { ChangeDetectorRef, ElementRef, OnInit, TemplateRef } from "@angular/core";
import { AbstractDateInputComponent } from "../abstract-date-input/abstract-date-input.component";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FocusMonitor } from "@angular/cdk/a11y";
import { PopupService } from "../../../popup/services/popup.service";
import * as i0 from "@angular/core";
export declare abstract class AbstractDatePickerComponent extends AbstractDateInputComponent implements OnInit {
    protected readonly cdr: ChangeDetectorRef;
    protected readonly elementRef: ElementRef;
    protected readonly focusMonitor: FocusMonitor;
    protected readonly popupService: PopupService;
    readonly dateIcon: IconDefinition;
    datePopupTemplateRef?: TemplateRef<any>;
    protected constructor(cdr: ChangeDetectorRef, elementRef: ElementRef, focusMonitor: FocusMonitor, popupService: PopupService);
    onCalendarValueChange(date: Date | null): void;
    onDateInputBlur(): void;
    onDateInputButtonClick(): void;
    onDateStringEdit(dateString: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractDatePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AbstractDatePickerComponent, "mona-abstract-date-picker", never, {}, {}, never, never, true, never>;
}
