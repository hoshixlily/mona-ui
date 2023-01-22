import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output
} from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { DateTime } from "luxon";
import { CalendarView } from "../../../../models/CalendarView";
import { Dictionary } from "@mirei/ts-collections";
import { faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Subject } from "rxjs";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";

@Component({
    selector: "mona-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent extends AbstractDateInputComponent implements OnInit {
    public readonly nextMonthIcon: IconDefinition = faChevronRight;
    public readonly prevMonthIcon: IconDefinition = faChevronLeft;
    public calendarView: CalendarView = "month";
    public decadeYears: number[] = [];
    public monthBounds: { start: Date; end: Date } = { start: new Date(), end: new Date() };
    public monthlyViewDict: Dictionary<Date, number> = new Dictionary<Date, number>();
    public navigatedDate: Date = new Date();

    public constructor(protected override readonly cdr: ChangeDetectorRef) {
        super(cdr);
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        const date = this.value ?? DateTime.now().toJSDate();
        this.prepareMonthlyViewDictionary(date);
        this.navigatedDate = date;
    }

    public onDayClick(date: Date): void {
        if (this.value) {
            const date1 = DateTime.fromJSDate(date);
            const newDate = DateTime.fromJSDate(this.value)
                .set({ day: date1.day, month: date1.month, year: date1.year })
                .toJSDate();
            this.setCurrentDate(newDate);
        } else {
            this.setCurrentDate(date);
        }
        this.cdr.markForCheck();
    }

    public onMonthClick(month: number): void {
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ month }).toJSDate();
        this.prepareMonthlyViewDictionary(this.navigatedDate);
        this.calendarView = "month";
    }

    public onNavigationClick(direction: "prev" | "next"): void {
        if (this.calendarView === "month") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ months: 1 }).toJSDate() : date.plus({ months: 1 }).toJSDate();
            this.prepareMonthlyViewDictionary(this.navigatedDate);
        } else if (this.calendarView === "year") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ years: 1 }).toJSDate() : date.plus({ years: 1 }).toJSDate();
        } else if (this.calendarView === "decade") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ years: 10 }).toJSDate() : date.plus({ years: 10 }).toJSDate();
            this.prepareDecadeYears();
        }
        this.cdr.markForCheck();
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
        this.cdr.markForCheck();
    }

    private setCurrentDate(date: Date): void {
        this.value = date;
        this.valueChange.emit(this.value);
        this.cdr.markForCheck();
    }

    public get timezone(): string {
        return DateTime.local().zoneName;
    }
}
