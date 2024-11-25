import { FocusMonitor } from "@angular/cdk/a11y";
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    effect,
    ElementRef,
    forwardRef,
    inject,
    input,
    model,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    untracked,
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
import { HourFormat } from "../models/HourFormat";
import { TimeSelectorComponent } from "../time-selector/time-selector.component";

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
    ],
    imports: [TextBoxDirective, FormsModule, ButtonDirective, FontAwesomeModule, TimeSelectorComponent],
    host: {
        "[class.mona-dropdown]": "true",
        "[class.mona-time-picker]": "true",
        "[class.mona-disabled]": "disabled()",
        "[attr.aria-disabled]": "disabled() ? true : undefined",
        "[attr.aria-readonly]": "readonly() ? true : undefined",
        "[attr.role]": "'grid'",
        "[attr.tabindex]": "disabled() ? null : 0"
    }
})
export class TimePickerComponent implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #focusMonitor: FocusMonitor = inject(FocusMonitor);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #popupAnimationService: PopupAnimationService = inject(PopupAnimationService);
    readonly #popupService: PopupService = inject(PopupService);
    #propagateChange: Action<Date | null> | null = null;

    private popupRef: PopupRef | null = null;

    protected readonly currentDateString = signal("");
    protected readonly navigatedDate = signal(new Date());
    protected readonly timePopupTemplateRef: Signal<TemplateRef<any>> = viewChild.required("timePopupTemplate");
    protected readonly value = signal<Date | null>(null);

    public disabled = model(false);
    public format = input(" HH:mm");
    public hourFormat = input<HourFormat>("24");
    public max = input<Date | null>(null);
    public min = input<Date | null>(null);
    public readonly = input(false);
    public showSeconds = input(false);

    public constructor() {
        effect(() => {
            this.hourFormat();
            untracked(() => {
                const value = this.value();
                if (value) {
                    const dateString = DateTime.fromJSDate(value).toFormat(this.format());
                    this.currentDateString.set(dateString);
                }
            });
        });
    }

    public ngOnInit(): void {
        this.setDateValues();
        this.setSubscriptions();
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString.set(dateString);
    }

    public onTimeInputBlur(): void {
        if (this.popupRef) {
            return;
        }
        let dateTime = this.generateValidDateTime(this.currentDateString());
        if (!dateTime) {
            this.setCurrentDate(null);
            return;
        }
        if (this.dateStringEquals(dateTime.toJSDate(), this.value())) {
            this.setCurrentDateString(this.value());
            return;
        }
        if (dateTime.isValid) {
            const inRangeDate = this.updateTimeIfNotInMinMax(dateTime.toJSDate());
            this.setCurrentDate(inRangeDate);
            this.navigatedDate.set(inRangeDate);
        } else {
            this.setCurrentDate(null);
        }
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef() || this.readonly() || this.popupRef) {
            return;
        }
        this.popupRef = this.#popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.timePopupTemplateRef(),
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
            height: 250,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.#popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.popupRef);
        this.#popupAnimationService.animateDropdown(this.popupRef, AnimationState.Show);
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.#focusMonitor.focusVia(
                this.#hostElementRef.nativeElement.querySelector("input") as HTMLElement,
                "program"
            );
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
        this.disabled.set(isDisabled);
    }

    public writeValue(date: Date | null | undefined): void {
        this.value.set(date ?? null);
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

    /**
     * Generates a valid date from a string.
     * @param dateString
     * @private
     */
    private generateValidDateTime(dateString: string): DateTime | null {
        const value = this.value();
        if (!value) {
            return null;
        }
        const valueDate = DateTime.fromJSDate(value);
        let dateTime = DateTime.fromFormat(dateString, this.format());
        if (dateTime.isValid) {
            return dateTime.set({
                year: valueDate.year,
                month: valueDate.month,
                day: valueDate.day
            });
        }
        const maxDate = this.max();
        const minDate = this.min();
        const date = minDate ?? maxDate;
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
        this.value.set(date);
        this.setCurrentDateString(date);
        this.#propagateChange?.(date);
    }

    private setCurrentDateString(date: Date | null): void {
        this.updateCurrentDateString(date, this.format());
    }

    private setDateValues(): void {
        const value = this.value();
        this.navigatedDate.set(value ?? DateTime.now().toJSDate());
        if (value) {
            this.updateCurrentDateString(value, this.format());
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

    private updateTimeIfNotInMinMax(date: Date): Date {
        const min = this.min();
        const max = this.max();
        const minDate = min ? DateTime.fromJSDate(min) : null;
        const maxDate = max ? DateTime.fromJSDate(max) : null;
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

    private updateCurrentDateString(date: Date | null | undefined, format: string): void {
        if (!date) {
            this.currentDateString.set("");
            return;
        }
        const dateString = DateTime.fromJSDate(date).toFormat(format);
        this.currentDateString.set(dateString);
    }
}
