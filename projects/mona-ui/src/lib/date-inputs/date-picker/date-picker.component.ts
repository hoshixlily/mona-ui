import { FocusMonitor } from "@angular/cdk/a11y";
import { NgClass } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    InputSignal,
    model,
    ModelSignal,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    viewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCalendar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
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

@Component({
    selector: "mona-date-picker",
    templateUrl: "./date-picker.component.html",
    styleUrls: ["./date-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [NgClass, TextBoxDirective, FormsModule, ButtonDirective, FontAwesomeModule, CalendarComponent],
    host: {
        "[class.mona-dropdown]": "true",
        "[class.mona-date-picker]": "true",
        "[class.mona-disabled]": "disabled()",
        "[attr.aria-disabled]": "disabled() ? true : undefined",
        "[attr.aria-readonly]": "readonly() ? true : undefined",
        "[attr.role]": "'grid'",
        "[attr.tabindex]": "disabled() ? null : 0"
    }
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #focusMonitor: FocusMonitor = inject(FocusMonitor);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #popupAnimationService: PopupAnimationService = inject(PopupAnimationService);
    readonly #popupService: PopupService = inject(PopupService);
    #propagateChange: Action<Date | null> | null = null;

    private popupRef: PopupRef | null = null;

    protected readonly dateIcon: IconDefinition = faCalendar;
    protected readonly datePopupTemplateRef: Signal<TemplateRef<any>> = viewChild.required("datePopupTemplate");
    protected readonly currentDateString: WritableSignal<string> = signal("");
    protected readonly navigatedDate: WritableSignal<Date> = signal(new Date());

    public readonly value: WritableSignal<Date | null> = signal(null);
    public disabled: ModelSignal<boolean> = model(false);
    public disabledDates: InputSignal<Iterable<Date>> = input<Iterable<Date>>([]);
    public format: InputSignal<string> = input("dd/MM/yyyy");
    public max: InputSignal<Date | null> = input<Date | null>(null);
    public min: InputSignal<Date | null> = input<Date | null>(null);
    public readonly: InputSignal<boolean> = input(false);

    public ngOnInit(): void {
        this.setDateValues();
        this.setSubscriptions();
    }

    public onCalendarValueChange(date: Date | null): void {
        this.setCurrentDate(date);
        this.animateClose();
        this.popupRef?.closeWithDelay();
    }

    public onDateInputBlur(): void {
        if (this.popupRef) {
            return;
        }
        if (!this.currentDateString && this.value()) {
            this.setCurrentDate(null);
            return;
        }

        const dateTime = DateTime.fromFormat(this.currentDateString(), this.format());
        if (this.dateStringEquals(this.value(), dateTime.toJSDate())) {
            return;
        }
        if (dateTime.isValid) {
            const value = this.value();
            const minDate = this.min();
            const maxDate = this.max();
            if (value && DateTime.fromJSDate(value).equals(dateTime)) {
                return;
            }
            if (minDate && dateTime.startOf("day") < DateTime.fromJSDate(minDate).startOf("day")) {
                this.setCurrentDate(minDate);
                return;
            }
            if (maxDate && dateTime.startOf("day") > DateTime.fromJSDate(maxDate).startOf("day")) {
                this.setCurrentDate(maxDate);
                return;
            }
            this.setCurrentDate(dateTime.toJSDate());
        } else {
            this.updateCurrentDateString(this.value(), this.format());
        }
    }

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly() || this.popupRef) {
            return;
        }
        const input = this.#hostElementRef.nativeElement.querySelector("input") as HTMLElement;
        this.popupRef = this.#popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.datePopupTemplateRef(),
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
            minWidth: 200,
            popupClass: "mona-date-input-popup",
            popupWrapperClass: "mona-calendar-popup-wrapper",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.#popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.popupRef);
        this.#popupAnimationService.animateDropdown(this.popupRef, AnimationState.Show);
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.#focusMonitor.focusVia(input, "program");
        });
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString.set(dateString);
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

    private animateClose(): void {
        if (!this.popupRef) {
            return;
        }
        this.#popupAnimationService.animateDropdown(this.popupRef, AnimationState.Hide);
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

    private setCurrentDate(date: Date | null): void {
        this.value.set(date);
        this.updateCurrentDateString(date, this.format());
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        this.navigatedDate.set(this.value() ?? DateTime.now().toJSDate());
        if (this.value) {
            this.updateCurrentDateString(this.value(), this.format());
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

    private updateCurrentDateString(date: Date | null | undefined, format: string): void {
        if (!date) {
            this.currentDateString.set("");
            return;
        }
        const dateString = DateTime.fromJSDate(date).toFormat(format);
        this.currentDateString.set(dateString);
    }
}
