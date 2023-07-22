import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { faCalendar, faClock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupService } from "../../../../../popup/services/popup.service";
import { FocusMonitor } from "@angular/cdk/a11y";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { DateTime } from "luxon";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { take } from "rxjs";

@Component({
    selector: "mona-date-time-picker",
    templateUrl: "./date-time-picker.component.html",
    styleUrls: ["./date-time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimePickerComponent),
            multi: true
        }
    ]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
    #value: Date | null = null;
    #propagateChange: Action<Date | null> | null = null;
    public readonly dateIcon: IconDefinition = faCalendar;
    public readonly timeIcon: IconDefinition = faClock;
    private popupRef: PopupRef | null = null;
    public currentDateString: string = "";
    public navigatedDate: Date = new Date();

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @ViewChild("datePopupTemplate")
    public datePopupTemplateRef?: TemplateRef<any>;

    @Input()
    public disabled: boolean = false;

    @Input()
    public disabledDates: Iterable<Date> = [];

    @Input()
    public format: string = "dd/MM/yyyy HH:mm";

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public max: Date | null = null;

    @Input()
    public min: Date | null = null;

    @Input()
    public readonly: boolean = false;

    @ViewChild("popupAnchor")
    public popupAnchor!: ElementRef<HTMLDivElement>;

    @Input()
    public showSeconds: boolean = false;

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<any>;

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly focusMonitor: FocusMonitor,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {
        this.setDateValues();
    }

    public onCalendarValueChange(date: Date | null): void {
        if (date) {
            const inRangeDate = this.updateDateIfNotInRange(date);
            this.setCurrentDate(inRangeDate);
            this.navigatedDate = inRangeDate;
        }
        this.popupRef?.close();
        this.popupRef = null;
    }

    public onDateInputBlur(): void {
        if (this.popupRef) {
            return;
        }
        if (!this.currentDateString && this.value) {
            this.setCurrentDate(null);
            return;
        }

        const dateTime = DateTime.fromFormat(this.currentDateString, this.format);
        if (this.dateStringEquals(this.value, dateTime.toJSDate())) {
            return;
        }
        if (dateTime.isValid) {
            if (this.value && DateTime.fromJSDate(this.value).equals(dateTime)) {
                return;
            }
            const inRangeDate = this.updateDateIfNotInRange(dateTime.toJSDate());
            this.setCurrentDate(inRangeDate);
            this.navigatedDate = inRangeDate;
        } else {
            if (this.value) {
                this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
            } else {
                this.currentDateString = "";
            }
        }
        this.cdr.detectChanges();
    }

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly) {
            return;
        }

        const input = this.elementRef.nativeElement.querySelector("input") as HTMLElement;
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            minWidth: 200,
            popupClass: "mona-date-input-popup",
            popupWrapperClass: ["mona-calendar-popup-wrapper"],
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true,
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" },
                    -1,
                    0,
                    "mona-dropdown-popup-content-bottom"
                ),
                new ConnectionPositionPair(
                    { originX: "start", originY: "top" },
                    { overlayX: "start", overlayY: "bottom" },
                    -1,
                    -1,
                    "mona-dropdown-popup-content-top"
                )
            ]
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(input, "program");
        });
        this.cdr.detectChanges();
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.timePopupTemplateRef,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true,
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" },
                    -1,
                    0,
                    "mona-dropdown-popup-content-bottom"
                ),
                new ConnectionPositionPair(
                    { originX: "start", originY: "top" },
                    { overlayX: "start", overlayY: "bottom" },
                    -1,
                    -1,
                    "mona-dropdown-popup-content-top"
                )
            ]
        });
        const input = this.elementRef.nativeElement.querySelector("input") as HTMLElement;
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(input, "program");
        });
    }

    public onTimeSelectorValueChange(date: Date | null): void {
        if (date) {
            const inRangeDate = this.updateDateIfNotInRange(date);
            this.setCurrentDate(inRangeDate);
            this.navigatedDate = inRangeDate;
        }
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(date: Date | null | undefined): void {
        this.#value = date ?? null;
        if (date == null) {
            this.currentDateString = "";
        } else {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        }
        this.setDateValues();
    }

    private dateStringEquals(date1: Date | null, date2: Date | null): boolean {
        if (date1 && date2) {
            return (
                DateTime.fromJSDate(date1).toFormat(this.format) === DateTime.fromJSDate(date2).toFormat(this.format)
            );
        }
        return date1 === date2;
    }

    private setCurrentDate(date: Date | null): void {
        this.#value = date;
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        } else {
            this.currentDateString = "";
        }
        this.#propagateChange?.(date);
        this.cdr.markForCheck();
    }

    private setDateValues(): void {
        if (this.value) {
            this.navigatedDate = DateTime.fromJSDate(this.value).toJSDate();
        } else {
            if (this.min) {
                this.navigatedDate = DateTime.fromJSDate(this.min).toJSDate();
            } else if (this.max) {
                if (this.max.getTime() < DateTime.now().toMillis()) {
                    this.navigatedDate = DateTime.fromJSDate(this.max).toJSDate();
                } else {
                    this.navigatedDate = DateTime.now().toJSDate();
                }
            } else {
                this.navigatedDate = DateTime.now().toJSDate();
            }
        }
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    private updateDateIfNotInRange(date: Date): Date {
        if (this.min && date < this.min) {
            return this.min;
        }
        if (this.max && date > this.max) {
            return this.max;
        }
        return date;
    }

    public get timePickerMax(): Date | null {
        if (!this.max) {
            return null;
        }
        const max = DateTime.fromJSDate(this.max);
        const date = DateTime.fromJSDate(this.navigatedDate);
        if (max.year === date.year && max.month === date.month && max.day === date.day) {
            return this.max;
        }
        return null;
    }

    public get timePickerMin(): Date | null {
        if (!this.min) {
            return null;
        }
        const min = DateTime.fromJSDate(this.min);
        const date = DateTime.fromJSDate(this.navigatedDate);
        if (min.year === date.year && min.month === date.month && min.day === date.day) {
            return this.min;
        }
        return null;
    }

    public get value(): Date | null {
        return this.#value;
    }
}
