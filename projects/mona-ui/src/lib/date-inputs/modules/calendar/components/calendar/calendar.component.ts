import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from "@angular/core";
import { DateTime, DurationObjectUnits } from "luxon";
import { CalendarView } from "../../../../models/CalendarView";
import { Dictionary } from "@mirei/ts-collections";
import { faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";

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
    ]
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
    #propagateChange: Action<Date | null> | null = null;
    #value: Date | null = null;
    public readonly nextMonthIcon: IconDefinition = faChevronRight;
    public readonly prevMonthIcon: IconDefinition = faChevronLeft;
    public calendarView: CalendarView = "month";
    public currentDateString: string = "";
    public decadeYears: number[] = [];
    public monthBounds: { start: Date; end: Date } = { start: new Date(), end: new Date() };
    public monthlyViewDict: Dictionary<Date, number> = new Dictionary<Date, number>();
    public navigatedDate: Date = new Date();

    @Input()
    public disabled: boolean = false;

    @Input()
    public disabledDates: Iterable<Date> = [];

    @Input()
    public format: string = "HH:mm";

    @Input()
    public max: Date | null = null;

    @Input()
    public min: Date | null = null;

    public constructor() {}

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
            this.setCurrentDate(newDate);
            this.navigatedDate = newDate;
            if (oldMonth !== DateTime.fromJSDate(newDate).month) {
                this.prepareMonthlyViewDictionary(newDate);
            }
        } else {
            this.setCurrentDate(date);
            this.navigatedDate = date;
            this.prepareMonthlyViewDictionary(date);
        }
    }

    public onMonthClick(month: number): void {
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ month }).toJSDate();
        this.prepareMonthlyViewDictionary(this.navigatedDate);
        this.calendarView = "month";
    }

    public onNavigationClick(direction: "prev" | "next"): void {
        const date = DateTime.fromJSDate(this.navigatedDate);
        let unit: DurationObjectUnits;

        switch (this.calendarView) {
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
        if (this.calendarView === "month") {
            this.prepareMonthlyViewDictionary(this.navigatedDate);
        } else if (this.calendarView === "decade") {
            this.prepareDecadeYears();
        }
    }

    public onViewChangeClick(view: CalendarView): void {
        if (view === "decade") {
            this.prepareDecadeYears();
        }
        this.calendarView = view;
    }

    public onYearClick(year: number): void {
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ year }).toJSDate();
        this.calendarView = "year";
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
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        } else {
            this.currentDateString = "";
        }
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }

    public get timezone(): string {
        return DateTime.local().zoneName;
    }

    public get value(): Date | null {
        return this.#value;
    }
}
