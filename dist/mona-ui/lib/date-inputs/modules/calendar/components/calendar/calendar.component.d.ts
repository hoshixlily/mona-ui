import { ChangeDetectorRef, OnInit } from "@angular/core";
import { CalendarView } from "../../../../models/CalendarView";
import { Dictionary } from "@mirei/ts-collections";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";
import * as i0 from "@angular/core";
export declare class CalendarComponent extends AbstractDateInputComponent implements OnInit {
    protected readonly cdr: ChangeDetectorRef;
    readonly nextMonthIcon: IconDefinition;
    readonly prevMonthIcon: IconDefinition;
    calendarView: CalendarView;
    decadeYears: number[];
    monthBounds: {
        start: Date;
        end: Date;
    };
    monthlyViewDict: Dictionary<Date, number>;
    constructor(cdr: ChangeDetectorRef);
    ngOnInit(): void;
    onDayClick(date: Date): void;
    onMonthClick(month: number): void;
    onNavigationClick(direction: "prev" | "next"): void;
    onViewChangeClick(view: CalendarView): void;
    onYearClick(year: number): void;
    private prepareDecadeYears;
    private prepareMonthlyViewDictionary;
    get timezone(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<CalendarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CalendarComponent, "mona-calendar", never, {}, {}, never, never, false, never>;
}
