import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    Input,
    InputSignal,
    OnChanges,
    OnInit,
    signal,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { faClock, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FocusMonitor } from "@angular/cdk/a11y";
import { DropDownService } from "../../dropdowns/services/drop-down.service";
import { PopupService } from "../../popup/services/popup.service";
import { DateTime } from "luxon";
import { fromEvent, take } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { Action } from "../../utils/Action";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { AnimationState } from "../../animations/models/AnimationState";
import { TimeSelectorComponent } from "../time-selector/time-selector.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { TextBoxDirective } from "../../inputs/text-box/directives/text-box.directive";

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
    standalone: true,
    imports: [TextBoxDirective, FormsModule, ButtonDirective, FontAwesomeModule, TimeSelectorComponent],
    host: {
        "[class.mona-dropdown]": "true",
        "[class.mona-time-picker]": "true",
        "[class.mona-disabled]": "disabled",
        "[attr.aria-disabled]": "disabled ? true : undefined",
        "[attr.aria-readonly]": "readonly ? true : undefined",
        "[attr.role]": "'grid'",
        "[attr.tabindex]": "disabled ? null : 0"
    }
})
export class TimePickerComponent implements OnInit, OnChanges, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #propagateChange: Action<Date | null> | null = null;
    private popupRef: PopupRef | null = null;
    protected readonly currentDateString: WritableSignal<string> = signal("");
    protected readonly navigatedDate: WritableSignal<Date> = signal(new Date());
    protected readonly timeIcon: IconDefinition = faClock;
    protected readonly value: WritableSignal<Date | null> = signal(null);

    public format: InputSignal<string> = input(" HH:mm");
    public hourFormat: InputSignal<"12" | "24"> = input<"12" | "24">("24");
    public max: InputSignal<Date | null> = input<Date | null>(null);
    public min: InputSignal<Date | null> = input<Date | null>(null);
    public readonly: InputSignal<boolean> = input(false);
    public showSeconds: InputSignal<boolean> = input(false);

    @Input()
    public disabled: boolean = false;

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<any>;

    public constructor(
        private readonly focusMonitor: FocusMonitor,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        const value = this.value();
        if (changes["hourFormat"] && value) {
            this.currentDateString.set(DateTime.fromJSDate(value).toFormat(this.format()));
        }
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
        if (!this.timePopupTemplateRef || this.readonly() || this.popupRef) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.timePopupTemplateRef,
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
            height: 250,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.popupRef);
        this.popupAnimationService.animateDropdown(this.popupRef, AnimationState.Show);
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(
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
        this.disabled = isDisabled;
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
