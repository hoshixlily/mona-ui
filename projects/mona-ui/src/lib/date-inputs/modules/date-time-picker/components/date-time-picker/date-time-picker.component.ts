import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { faCalendar, faChevronLeft, faChevronRight, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { CalendarView } from "../../../../models/CalendarView";
import { Dictionary } from "@mirei/ts-collections";
import { DateTime } from "luxon";

@Component({
    selector: "mona-date-time-picker",
    templateUrl: "./date-time-picker.component.html",
    styleUrls: ["./date-time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent implements OnInit {
    private popupRef: PopupRef | null = null;
    public readonly dateIcon: IconDefinition = faCalendar;
    public readonly nextMonthIcon: IconDefinition = faChevronRight;
    public readonly prevMonthIcon: IconDefinition = faChevronLeft;
    public readonly wrongDateIcon: IconDefinition = faTimes;
    public calendarView: CalendarView = "month";
    public currentDateInvalid: boolean = false;
    public currentDateString: string = "";
    public decadeYears: number[] = [];
    public monthBounds: { start: Date; end: Date } = { start: new Date(), end: new Date() };
    public monthlyViewDict: Dictionary<Date, number> = new Dictionary<Date, number>();
    public navigatedDate: Date = new Date();

    @ViewChild("dateMenuButton")
    public readonly dateMenuButton?: ElementRef<HTMLButtonElement>;

    @Input()
    public format: string = "d/M/yyyy";

    @ViewChild("datePopupTemplate")
    public readonly popupTemplate?: TemplateRef<void>;

    @Input()
    public value: Date | null = null;

    public constructor(
        public readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {
        const date = this.value ?? DateTime.now().toJSDate();
        this.prepareMonthlyViewDictionary(date);
        this.navigatedDate = date;
    }

    public onDateInputBlur(): void {
        const date1 = DateTime.fromFormat(this.currentDateString, this.format);
        if (date1.isValid) {
            this.setCurrentDate(date1.toJSDate());
            this.prepareMonthlyViewDictionary(date1.toJSDate());
            this.navigatedDate = date1.toJSDate();
            this.currentDateString = date1.toFormat(this.format);
        } else {
            if (this.value) {
                this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
            }
        }
        this.cdr.detectChanges();
    }

    public onDateInputButtonClick(event: MouseEvent): void {
        if (!this.dateMenuButton || !this.popupTemplate) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.popupTemplate,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-date-time-picker-popup"
        });
        this.popupRef.closed.subscribe(() => {
            this.calendarView = "month";
            this.navigatedDate = this.value ?? DateTime.now().toJSDate();
            this.prepareMonthlyViewDictionary(this.navigatedDate);
        });
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
    }

    public onDayClick(date: Date): void {
        this.setCurrentDate(date);
        this.currentDateInvalid = false;
        this.cdr.markForCheck();
        this.popupRef?.close();
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
            this.cdr.markForCheck();
        } else if (this.calendarView === "year") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ years: 1 }).toJSDate() : date.plus({ years: 1 }).toJSDate();
            this.cdr.markForCheck();
        } else if (this.calendarView === "decade") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ years: 10 }).toJSDate() : date.plus({ years: 10 }).toJSDate();
            this.prepareDecadeYears();
            this.cdr.markForCheck();
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
        this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
    }

    public get timezone(): string {
        return DateTime.local().zoneName;
    }
}
