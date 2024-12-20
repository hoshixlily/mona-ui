import { DatePipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, forwardRef, input, model, OnInit, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
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
    imports: [ButtonDirective, FontAwesomeModule, NgClass, DatePipe, SlicePipe, DateComparerPipe, DateIncludePipe],
    host: {
        "[class.mona-calendar]": "true",
        "[class.mona-disabled]": "disabled()"
    }
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
    #propagateChange: Action<Date | null> | null = null;
    protected readonly calendarView = signal<CalendarView>("month");
    protected readonly decadeYears = signal<number[]>([]);
    protected readonly monthBounds = signal({
        start: new Date(),
        end: new Date()
    });
    protected readonly monthlyViewDict = signal(new Dictionary<Date, number>());
    protected readonly navigatedDate = signal(new Date());
    protected readonly nextMonthIcon = faChevronRight;
    protected readonly prevMonthIcon = faChevronLeft;
    protected readonly timezone = DateTime.local().zoneName ?? undefined;
    protected readonly value = signal<Date | null>(null);

    public disabled = model(false);
    public disabledDates = input([], {
        transform: (value: Iterable<Date>) => Array.from(value)
    });
    public max = input<Date | null>(null);
    public min = input<Date | null>(null);

    public ngOnInit(): void {
        this.setDateValues();
        const date = this.value() ?? DateTime.now().toJSDate();
        this.prepareMonthlyViewDictionary(date);
        this.navigatedDate.set(date);
    }

    public onDayClick(date: Date): void {
        const value = this.value();
        if (value) {
            const oldMonth = DateTime.fromJSDate(value).month;
            const date1 = DateTime.fromJSDate(date);
            const newDate = DateTime.fromJSDate(value)
                .set({ day: date1.day, month: date1.month, year: date1.year })
                .toJSDate();
            this.navigatedDate.set(newDate);
            if (oldMonth !== DateTime.fromJSDate(newDate).month) {
                this.prepareMonthlyViewDictionary(newDate);
            }
            this.setCurrentDate(newDate);
        } else {
            this.navigatedDate.set(date);
            this.prepareMonthlyViewDictionary(date);
            this.setCurrentDate(date);
        }
    }

    public onMonthClick(month: number): void {
        this.navigatedDate.set(DateTime.fromJSDate(this.navigatedDate()).set({ month }).toJSDate());
        this.prepareMonthlyViewDictionary(this.navigatedDate());
        this.calendarView.set("month");
    }

    public onNavigationClick(direction: "prev" | "next"): void {
        const date = DateTime.fromJSDate(this.navigatedDate());
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

        this.navigatedDate.set(direction === "prev" ? date.minus(unit).toJSDate() : date.plus(unit).toJSDate());
        if (this.calendarView() === "month") {
            this.prepareMonthlyViewDictionary(this.navigatedDate());
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
        this.navigatedDate.set(DateTime.fromJSDate(this.navigatedDate()).set({ year }).toJSDate());
        this.calendarView.set("year");
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
        this.setDateValues();
        if (date) {
            this.prepareMonthlyViewDictionary(date);
        }
    }

    private prepareDecadeYears(): void {
        const date = DateTime.fromJSDate(this.navigatedDate());
        const year = date.year;
        const decadeStart = year - (year % 10);
        const yearList = Array.from({ length: 10 }, (_, i) => decadeStart + i);
        this.decadeYears.set(yearList);
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
        this.monthlyViewDict.set(dictionary);
        this.monthBounds.set({ start: firstDayOfMonth.toJSDate(), end: lastDayOfMonth.toJSDate() });
    }

    private setCurrentDate(date: Date | null): void {
        this.value.set(date);
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        this.navigatedDate.set(this.value() ?? DateTime.now().toJSDate());
    }
}
