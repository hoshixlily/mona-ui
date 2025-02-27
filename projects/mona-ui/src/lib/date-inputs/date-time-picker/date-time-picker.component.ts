import { FocusMonitor } from "@angular/cdk/a11y";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    model,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DateTime } from "luxon";
import { fromEvent, take } from "rxjs";
import { AnimationState } from "../../animations/models/AnimationState";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { DropDownService } from "../../dropdowns/services/drop-down.service";
import { TextBoxDirective } from "../../inputs/text-box/directives/text-box.directive";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupService } from "../../popup/services/popup.service";
import { Action } from "../../utils/Action";
import { CalendarComponent } from "../calendar/calendar.component";
import { HourFormat } from "../models/HourFormat";
import { TimeSelectorComponent } from "../time-selector/time-selector.component";

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
    imports: [
        TextBoxDirective,
        FormsModule,
        ButtonDirective,
        FontAwesomeModule,
        CalendarComponent,
        TimeSelectorComponent
    ],
    host: {
        "[class.mona-dropdown]": "true",
        "[class.mona-date-time-picker]": "true",
        "[class.mona-disabled]": "disabled()",
        "[attr.aria-disabled]": "disabled() ? true : undefined",
        "[attr.aria-readonly]": "readonly() ? true : undefined",
        "[attr.role]": "'grid'",
        "[attr.tabindex]": "disabled() ? null : 0"
    }
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #focusMonitor: FocusMonitor = inject(FocusMonitor);
    readonly #hostElementRef: ElementRef = inject(ElementRef);
    readonly #popupAnimationService: PopupAnimationService = inject(PopupAnimationService);
    readonly #popupService: PopupService = inject(PopupService);
    readonly #value = signal<Date | null>(null);
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<Date | null> | null = null;

    protected readonly currentDateString = signal("");
    protected readonly datePopupTemplateRef: Signal<TemplateRef<any>> = viewChild.required("datePopupTemplate");
    protected readonly navigatedDate = signal(new Date());
    protected readonly timePickerMax = computed(() => {
        const maxDate = this.max();
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
    protected readonly timePickerMin = computed(() => {
        const minDate = this.min();
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
    protected readonly timePopupTemplateRef: Signal<TemplateRef<any>> = viewChild.required("timePopupTemplate");

    public disabled = model(false);
    public disabledDates = input<Iterable<Date>>([]);
    public format = input("dd/MM/yyyy HH:mm");
    public hourFormat = input<HourFormat>("24");
    public max = input<Date | null>(null);
    public min = input<Date | null>(null);
    public readonly = input(false);
    public showSeconds = input(false);

    public ngOnInit(): void {
        this.setDateValues();
        this.setSubscriptions();
    }

    public onCalendarValueChange(date: Date | null): void {
        if (date) {
            const inRangeDate = this.updateDateIfNotInRange(date);
            this.setCurrentDate(inRangeDate);
            this.navigatedDate.set(inRangeDate);
        }
        if (this.#popupRef) {
            this.#popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Hide);
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

        const dateTime = DateTime.fromFormat(this.currentDateString(), this.format());
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
            this.updateCurrentDateString(this.#value(), this.format());
        }
    }

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly()) {
            return;
        }

        const input = this.#hostElementRef.nativeElement.querySelector("input") as HTMLElement;
        this.#popupRef = this.#popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.datePopupTemplateRef(),
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
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
            this.#focusMonitor.focusVia(input, "program");
        });
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString.set(dateString);
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef || this.readonly()) {
            return;
        }
        this.#popupRef = this.#popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.timePopupTemplateRef(),
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
            height: 250,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.setAnimations(this.#popupRef, AnimationState.Show);
        const input = this.#hostElementRef.nativeElement.querySelector("input") as HTMLElement;
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.#focusMonitor.focusVia(input, "program");
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
        this.disabled.set(isDisabled);
    }

    public writeValue(date: Date | null | undefined): void {
        this.#value.set(date ?? null);
        this.updateCurrentDateString(date, this.format());
        this.setDateValues();
    }

    private dateStringEquals(date1: Date | null, date2: Date | null): boolean {
        if (date1 && date2) {
            return (
                DateTime.fromJSDate(date1).toFormat(this.format()) ===
                DateTime.fromJSDate(date2).toFormat(this.format())
            );
        }
        return date1 === date2;
    }

    private setAnimations(popupRef: PopupRef, state: AnimationState): void {
        this.#popupAnimationService.setupDropdownOutsideClickCloseAnimation(popupRef);
        this.#popupAnimationService.animateDropdown(popupRef, state);
    }

    private setCurrentDate(date: Date | null): void {
        this.#value.set(date);
        this.updateCurrentDateString(date, this.format());
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        const value = this.#value();
        const maxDate = this.max();
        const minDate = this.min();
        if (value) {
            this.navigatedDate.set(DateTime.fromJSDate(value).toJSDate());
        } else if (minDate) {
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
        if (this.#value()) {
            this.updateCurrentDateString(this.#value(), this.format());
        }
    }

    private setSubscriptions(): void {
        fromEvent<FocusEvent>(this.#hostElementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                const input = this.#hostElementRef.nativeElement.querySelector("input");
                if (input) {
                    input.focus();
                    input.setSelectionRange(-1, -1);
                }
            });
    }

    private updateDateIfNotInRange(date: Date): Date {
        const maxDate = this.max();
        const minDate = this.min();
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
