import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { faClock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FocusMonitor } from "@angular/cdk/a11y";
import { PopupService } from "../../../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { take } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { DateService } from "../../../../services/date.service";

@Component({
    selector: "mona-time-picker",
    templateUrl: "./time-picker.component.html",
    styleUrls: ["./time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimePickerComponent),
            multi: true
        }
    ]
})
export class TimePickerComponent implements OnInit, OnChanges, ControlValueAccessor {
    #value: Date | null = null;
    #propagateChange: Action<Date | null> | null = null;
    private popupRef: PopupRef | null = null;
    public readonly timeIcon: IconDefinition = faClock;
    public currentDateString: string = "";
    public navigatedDate: Date = new Date();

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public disabled: boolean = false;

    @Input()
    public format: string = "HH:mm";

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public max: Date | null = null;

    @Input()
    public min: Date | null = null;

    @ViewChild("popupAnchor")
    public popupAnchor!: ElementRef<HTMLDivElement>;

    @Input()
    public readonly: boolean = false;

    @Input()
    public showSeconds: boolean = false;

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<any>;

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly dateService: DateService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly focusMonitor: FocusMonitor,
        private readonly popupService: PopupService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["hourFormat"] && this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    public ngOnInit(): void {
        this.setDateValues();
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
    }

    public onTimeInputBlur(): void {
        if (this.popupRef) {
            return;
        }
        let dateTime = this.generateValidDateTime(this.currentDateString);
        if (!dateTime) {
            this.setCurrentDate(null);
            return;
        }
        if (this.dateStringEquals(dateTime.toJSDate(), this.value)) {
            this.setCurrentDateString(this.value);
            return;
        }
        if (dateTime.isValid) {
            const inRangeDate = this.updateTimeIfNotInMinMax(dateTime.toJSDate());
            this.setCurrentDate(inRangeDate);
            this.navigatedDate = inRangeDate;
        } else {
            this.setCurrentDate(null);
        }
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.timePopupTemplateRef,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: false,
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" },
                    -1,
                    -1,
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
        this.dateService.setupOutsideClickCloseAnimation(this.popupRef);
        this.dateService.animate(
            this.popupRef.overlayRef.overlayElement.firstElementChild as HTMLElement,
            this.popupRef.overlayRef.overlayElement,
            "show"
        );
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(this.elementRef.nativeElement.querySelector("input") as HTMLElement, "program");
        });
    }

    public onTimeSelectorValueChange(date: Date | null): void {
        this.setCurrentDate(date);
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

    /**
     * Generates a valid date from a string.
     * @param dateString
     * @private
     */
    private generateValidDateTime(dateString: string): DateTime | null {
        if (!this.value) {
            return null;
        }
        const valueDate = DateTime.fromJSDate(this.value);
        let dateTime = DateTime.fromFormat(dateString, this.format);
        if (dateTime.isValid) {
            return dateTime.set({
                year: valueDate.year,
                month: valueDate.month,
                day: valueDate.day
            });
        }
        const date = this.min ? this.min : this.max;
        if (date) {
            const newDate = DateTime.fromJSDate(date);
            dateTime = newDate.set({
                year: valueDate.year,
                month: valueDate.month,
                day: valueDate.day
            });
            return dateTime;
        }
        return null;
    }

    private setCurrentDate(date: Date | null): void {
        this.#value = date;
        this.setCurrentDateString(date);
        this.#propagateChange?.(date);
        this.cdr.markForCheck();
    }

    private setCurrentDateString(date: Date | null): void {
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        } else {
            this.currentDateString = "";
        }
    }

    private setDateValues(): void {
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    private updateTimeIfNotInMinMax(date: Date): Date {
        const minDate = this.min ? DateTime.fromJSDate(this.min) : null;
        const maxDate = this.max ? DateTime.fromJSDate(this.max) : null;
        let currentDate = DateTime.fromJSDate(date);

        if (minDate) {
            if (currentDate.hour < minDate.hour) {
                currentDate = currentDate.set({ hour: minDate.hour, minute: minDate.minute, second: minDate.second });
            } else if (currentDate.hour === minDate.hour && currentDate.minute < minDate.minute) {
                currentDate = currentDate.set({ minute: minDate.minute, second: minDate.second });
            } else if (
                currentDate.hour === minDate.hour &&
                currentDate.minute === minDate.minute &&
                currentDate.second < minDate.second
            ) {
                currentDate = currentDate.set({ second: minDate.second });
            }
        }

        if (maxDate) {
            if (currentDate.hour > maxDate.hour) {
                currentDate = currentDate.set({ hour: maxDate.hour, minute: maxDate.minute, second: maxDate.second });
            } else if (currentDate.hour === maxDate.hour && currentDate.minute > maxDate.minute) {
                currentDate = currentDate.set({ minute: maxDate.minute, second: maxDate.second });
            } else if (
                currentDate.hour === maxDate.hour &&
                currentDate.minute === maxDate.minute &&
                currentDate.second > maxDate.second
            ) {
                currentDate = currentDate.set({ second: maxDate.second });
            }
        }

        return currentDate.toJSDate();
    }

    public get value(): Date | null {
        return this.#value;
    }
}
