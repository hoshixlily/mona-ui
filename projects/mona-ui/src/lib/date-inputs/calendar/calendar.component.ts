import { DatePipe, NgClass } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    input,
    Input,
    InputSignal,
    OnInit,
    signal,
    WritableSignal
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Dictionary } from "@mirei/ts-collections";
import { DateTime, DurationObjectUnits } from "luxon";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { DateComparerPipe } from "../../pipes/date-comparer.pipe";
import { DateIncludePipe } from "../../pipes/date-include.pipe";
import { SlicePipe } from "../../pipes/slice.pipe";
import { Action } from "../../utils/Action";
import { CalendarView } from "../models/CalendarView";

@Component({
    selector: "mona-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CalendarComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [ButtonDirective, FontAwesomeModule, NgClass, DatePipe, SlicePipe, DateComparerPipe, DateIncludePipe],
    host: {
        "[class.mona-calendar]": "true",
        "[class.mona-disabled]": "disabled"
    }
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
    #propagateChange: Action<Date | null> | null = null;
    #value: Date | null = null;
    protected readonly nextMonthIcon: IconDefinition = faChevronRight;
    protected readonly prevMonthIcon: IconDefinition = faChevronLeft;
    protected calendarView: WritableSignal<CalendarView> = signal("month");
    protected decadeYears: number[] = [];
    protected disabledDateList: WritableSignal<Date[]> = signal([]);
    protected monthBounds: { start: Date; end: Date } = { start: new Date(), end: new Date() };
    protected monthlyViewDict: Dictionary<Date, number> = new Dictionary<Date, number>();

    public max: InputSignal<Date | null> = input<Date | null>(null);
    public min: InputSignal<Date | null> = input<Date | null>(null);
    public navigatedDate: Date = new Date();

    @Input()
    public disabled: boolean = false;

    @Input()
    public set disabledDates(value: Iterable<Date>) {
        this.disabledDateList.set(Array.from(value));
    }

    public ngOnInit(): void {
        this.setDateValues();
        const date = this.value ?? DateTime.now().toJSDate();
        this.prepareMonthlyViewDictionary(date);
        this.navigatedDate = date;
    }

    public onDayClick(date: Date): void {
        if (this.value) {
            const oldMonth = DateTime.fromJSDate(this.value).month;
            const date1 = DateTime.fromJSDate(date);
            const newDate = DateTime.fromJSDate(this.value)
                .set({ day: date1.day, month: date1.month, year: date1.year })
                .toJSDate();
            this.navigatedDate = newDate;
            if (oldMonth !== DateTime.fromJSDate(newDate).month) {
                this.prepareMonthlyViewDictionary(newDate);
            }
            this.setCurrentDate(newDate);
        } else {
            this.navigatedDate = date;
            this.prepareMonthlyViewDictionary(date);
            this.setCurrentDate(date);
        }
    }

    public onMonthClick(month: number): void {
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ month }).toJSDate();
        this.prepareMonthlyViewDictionary(this.navigatedDate);
        this.calendarView.set("month");
    }

    public onNavigationClick(direction: "prev" | "next"): void {
        const date = DateTime.fromJSDate(this.navigatedDate);
        let unit: DurationObjectUnits;

        switch (this.calendarView()) {
            case "month":
                unit = { months: 1 };
                break;
            case "year":
                unit = { years: 1 };
                break;
            case "decade":
                unit = { years: 10 };
                break;
        }

        this.navigatedDate = direction === "prev" ? date.minus(unit).toJSDate() : date.plus(unit).toJSDate();
        if (this.calendarView() === "month") {
            this.prepareMonthlyViewDictionary(this.navigatedDate);
        } else if (this.calendarView() === "decade") {
            this.prepareDecadeYears();
        }
    }

    public onViewChangeClick(view: CalendarView): void {
        if (view === "decade") {
            this.prepareDecadeYears();
        }
        this.calendarView.set(view);
    }

    public onYearClick(year: number): void {
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ year }).toJSDate();
        this.calendarView.set("year");
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
        this.setDateValues();
        if (date) {
            this.prepareMonthlyViewDictionary(date);
        }
    }

    private prepareDecadeYears(): void {
        const date = DateTime.fromJSDate(this.navigatedDate);
        const year = date.year;
        const decadeStart = year - (year % 10);
        this.decadeYears = Array.from({ length: 10 }, (_, i) => decadeStart + i);
    }

    private prepareMonthlyViewDictionary(day: Date): void {
        const firstDayOfMonth = DateTime.fromJSDate(day).startOf("month");
        const lastDayOfMonth = DateTime.fromJSDate(day).endOf("month");
        const firstDayOfCalendar = firstDayOfMonth.startOf("week");
        const lastDayOfCalendar = lastDayOfMonth.endOf("week");
        const dictionary = new Dictionary<Date, number>();
        for (let i = firstDayOfCalendar; i <= lastDayOfCalendar; i = i.plus({ days: 1 })) {
            dictionary.add(i.toJSDate(), i.day);
        }
        if (lastDayOfMonth.weekday === 7) {
            for (let i = 0; i < 7; i++) {
                dictionary.add(lastDayOfMonth.plus({ days: i + 1 }).toJSDate(), i + 1);
            }
        }
        this.monthlyViewDict = dictionary;
        this.monthBounds = { start: firstDayOfMonth.toJSDate(), end: lastDayOfMonth.toJSDate() };
    }

    private setCurrentDate(date: Date | null): void {
        this.#value = date;
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
    }

    public get timezone(): string | undefined {
        return DateTime.local().zoneName ?? undefined;
    }

    public get value(): Date | null {
        return this.#value;
    }
}
