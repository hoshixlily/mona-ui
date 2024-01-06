import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { faCalendar, faClock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { DropDownService } from "../../dropdowns/services/drop-down.service";
import { PopupService } from "../../popup/services/popup.service";
import { FocusMonitor } from "@angular/cdk/a11y";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { Action } from "../../utils/Action";
import { PopupRef } from "../../popup/models/PopupRef";
import { DateTime } from "luxon";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { take } from "rxjs";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { AnimationState } from "../../animations/models/AnimationState";
import { TimeSelectorComponent } from "../time-selector/time-selector.component";
import { CalendarComponent } from "../calendar/calendar.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { TextBoxDirective } from "../../inputs/text-box/directives/text-box.directive";
import { NgClass } from "@angular/common";

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
    ],
    standalone: true,
    imports: [
        NgClass,
        TextBoxDirective,
        FormsModule,
        ButtonDirective,
        FontAwesomeModule,
        CalendarComponent,
        TimeSelectorComponent
    ]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
    readonly #format: WritableSignal<string> = signal("dd/MM/yyyy HH:mm");
    readonly #value: WritableSignal<Date | null> = signal(null);
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<Date | null> | null = null;
    protected readonly currentDateString: WritableSignal<string> = signal("");
    protected readonly dateIcon: IconDefinition = faCalendar;
    protected readonly maxDate: WritableSignal<Date | null> = signal(null);
    protected readonly minDate: WritableSignal<Date | null> = signal(null);
    protected readonly navigatedDate: WritableSignal<Date> = signal(new Date());
    protected readonly timeIcon: IconDefinition = faClock;
    protected readonly timePickerMax: Signal<Date | null> = computed(() => {
        const maxDate = this.maxDate();
        const navigatedDate = this.navigatedDate();
        if (!maxDate) {
            return null;
        }
        const max = DateTime.fromJSDate(maxDate);
        const date = DateTime.fromJSDate(navigatedDate);
        if (max.year === date.year && max.month === date.month && max.day === date.day) {
            return maxDate;
        }
        return null;
    });
    protected readonly timePickerMin: Signal<Date | null> = computed(() => {
        const minDate = this.minDate();
        const navigatedDate = this.navigatedDate();
        if (!minDate) {
            return null;
        }
        const min = DateTime.fromJSDate(minDate);
        const date = DateTime.fromJSDate(navigatedDate);
        if (min.year === date.year && min.month === date.month && min.day === date.day) {
            return minDate;
        }
        return null;
    });

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @ViewChild("datePopupTemplate")
    public datePopupTemplateRef?: TemplateRef<any>;

    @Input()
    public disabled: boolean = false;

    @Input()
    public disabledDates: Iterable<Date> = [];

    @Input()
    public set format(value: string) {
        this.#format.set(value);
    }

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public set max(value: Date | null) {
        this.maxDate.set(value);
    }

    @Input()
    public set min(value: Date | null) {
        this.minDate.set(value);
    }

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
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {
        this.setDateValues();
    }

    public onCalendarValueChange(date: Date | null): void {
        if (date) {
            const inRangeDate = this.updateDateIfNotInRange(date);
            this.setCurrentDate(inRangeDate);
            this.navigatedDate.set(inRangeDate);
        }
        if (this.#popupRef) {
            this.popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Hide);
            this.#popupRef.closeWithDelay();
        }
    }

    public onDateInputBlur(): void {
        if (this.#popupRef) {
            return;
        }
        if (!this.currentDateString() && this.#value()) {
            this.setCurrentDate(null);
            return;
        }

        const dateTime = DateTime.fromFormat(this.currentDateString(), this.#format());
        if (this.dateStringEquals(this.#value(), dateTime.toJSDate())) {
            return;
        }
        if (dateTime.isValid) {
            const value = this.#value();
            if (value && DateTime.fromJSDate(value).equals(dateTime)) {
                return;
            }
            const inRangeDate = this.updateDateIfNotInRange(dateTime.toJSDate());
            this.setCurrentDate(inRangeDate);
            this.navigatedDate.set(inRangeDate);
        } else {
            this.updateCurrentDateString(this.#value(), this.#format());
        }
        this.cdr.detectChanges();
    }

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly) {
            return;
        }

        const input = this.elementRef.nativeElement.querySelector("input") as HTMLElement;
        this.#popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            minWidth: 200,
            popupClass: "mona-date-input-popup",
            popupWrapperClass: ["mona-calendar-popup-wrapper"],
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.setAnimations(this.#popupRef, AnimationState.Show);
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.focusMonitor.focusVia(input, "program");
        });
        this.cdr.detectChanges();
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString.set(dateString);
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.#popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.timePopupTemplateRef,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.setAnimations(this.#popupRef, AnimationState.Show);
        const input = this.elementRef.nativeElement.querySelector("input") as HTMLElement;
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.focusMonitor.focusVia(input, "program");
        });
    }

    public onTimeSelectorValueChange(date: Date | null): void {
        if (date) {
            const inRangeDate = this.updateDateIfNotInRange(date);
            this.setCurrentDate(inRangeDate);
            this.navigatedDate.set(inRangeDate);
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
        this.#value.set(date ?? null);
        this.updateCurrentDateString(date, this.#format());
        this.setDateValues();
    }

    private dateStringEquals(date1: Date | null, date2: Date | null): boolean {
        if (date1 && date2) {
            return (
                DateTime.fromJSDate(date1).toFormat(this.#format()) ===
                DateTime.fromJSDate(date2).toFormat(this.#format())
            );
        }
        return date1 === date2;
    }

    private setAnimations(popupRef: PopupRef, state: AnimationState): void {
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(popupRef);
        this.popupAnimationService.animateDropdown(popupRef, state);
    }

    private setCurrentDate(date: Date | null): void {
        this.#value.set(date);
        this.updateCurrentDateString(date, this.#format());
        this.#propagateChange?.(date);
        this.cdr.markForCheck();
    }

    private setDateValues(): void {
        const value = this.#value();
        const maxDate = this.maxDate();
        const minDate = this.minDate();
        if (value) {
            this.navigatedDate.set(DateTime.fromJSDate(value).toJSDate());
        } else {
            if (minDate) {
                this.navigatedDate.set(DateTime.fromJSDate(minDate).toJSDate());
            } else if (maxDate) {
                if (maxDate.getTime() < DateTime.now().toMillis()) {
                    this.navigatedDate.set(DateTime.fromJSDate(maxDate).toJSDate());
                } else {
                    this.navigatedDate.set(DateTime.now().toJSDate());
                }
            } else {
                this.navigatedDate.set(DateTime.now().toJSDate());
            }
        }
        if (this.#value()) {
            this.updateCurrentDateString(this.#value(), this.#format());
        }
    }

    private updateDateIfNotInRange(date: Date): Date {
        const maxDate = this.maxDate();
        const minDate = this.minDate();
        if (minDate && date < minDate) {
            return minDate;
        }
        if (maxDate && date > maxDate) {
            return maxDate;
        }
        return date;
    }

    private updateCurrentDateString(date: Date | null | undefined, format: string): void {
        if (!date) {
            this.currentDateString.set("");
            return;
        }
        const dateString = DateTime.fromJSDate(date).toFormat(format);
        this.currentDateString.set(dateString);
    }
}
