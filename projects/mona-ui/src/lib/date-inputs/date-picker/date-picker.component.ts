import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    forwardRef,
    HostBinding,
    inject,
    Input,
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DropDownService } from "../../dropdowns/services/drop-down.service";
import { PopupService } from "../../popup/services/popup.service";
import { FocusMonitor } from "@angular/cdk/a11y";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { DateTime } from "luxon";
import { Action } from "../../utils/Action";
import { PopupRef } from "../../popup/models/PopupRef";
import { faCalendar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { fromEvent, take } from "rxjs";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { AnimationState } from "../../animations/models/AnimationState";
import { CalendarComponent } from "../calendar/calendar.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { TextBoxDirective } from "../../inputs/text-box/directives/text-box.directive";
import { NgClass } from "@angular/common";

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
        "[class.mona-disabled]": "disabled",
        "[attr.tabindex]": "disabled ? null : 0"
    }
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #format: WritableSignal<string> = signal("dd/MM/yyyy");
    #propagateChange: Action<Date | null> | null = null;

    protected readonly dateIcon: IconDefinition = faCalendar;
    protected readonly maxDate: WritableSignal<Date | null> = signal(null);
    protected readonly minDate: WritableSignal<Date | null> = signal(null);
    protected readonly currentDateString: WritableSignal<string> = signal("");
    protected readonly navigatedDate: WritableSignal<Date> = signal(new Date());
    public readonly value: WritableSignal<Date | null> = signal(null);

    private popupRef: PopupRef | null = null;

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
    public set max(value: Date | null) {
        this.maxDate.set(value);
    }

    @Input()
    public set min(value: Date | null) {
        this.minDate.set(value);
    }

    @ViewChild("popupAnchor")
    public popupAnchor!: ElementRef<HTMLDivElement>;

    @Input()
    public readonly: boolean = false;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly focusMonitor: FocusMonitor,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

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

        const dateTime = DateTime.fromFormat(this.currentDateString(), this.#format());
        if (this.dateStringEquals(this.value(), dateTime.toJSDate())) {
            return;
        }
        if (dateTime.isValid) {
            const value = this.value();
            const minDate = this.minDate();
            const maxDate = this.maxDate();
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
            this.updateCurrentDateString(this.value(), this.#format());
        }
    }

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef || this.readonly || this.popupRef) {
            return;
        }
        const input = this.elementRef.nativeElement.querySelector("input") as HTMLElement;
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            minWidth: 200,
            popupClass: "mona-date-input-popup",
            popupWrapperClass: "mona-calendar-popup-wrapper",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.popupRef);
        this.popupAnimationService.animateDropdown(this.popupRef, AnimationState.Show);
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(input, "program");
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
        this.disabled = isDisabled;
    }

    public writeValue(date: Date | null | undefined): void {
        this.value.set(date ?? null);
        this.updateCurrentDateString(date, this.#format());
        this.setDateValues();
    }

    private animateClose(): void {
        if (!this.popupRef) {
            return;
        }
        this.popupAnimationService.animateDropdown(this.popupRef, AnimationState.Hide);
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

    private setCurrentDate(date: Date | null): void {
        this.value.set(date);
        this.updateCurrentDateString(date, this.#format());
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        this.navigatedDate.set(this.value() ?? DateTime.now().toJSDate());
        if (this.value) {
            this.updateCurrentDateString(this.value(), this.#format());
        }
    }

    private setSubscriptions(): void {
        fromEvent<FocusEvent>(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                const input = this.elementRef.nativeElement.querySelector("input");
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
