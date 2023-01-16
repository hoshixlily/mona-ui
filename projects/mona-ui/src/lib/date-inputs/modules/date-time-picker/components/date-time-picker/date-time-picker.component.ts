import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {
    faCalendar,
    faChevronLeft,
    faChevronRight,
    faClock,
    faTimes,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { CalendarView } from "../../../../models/CalendarView";
import { Dictionary } from "@mirei/ts-collections";
import { DateTime } from "luxon";
import { Subject, take } from "rxjs";

@Component({
    selector: "mona-date-time-picker",
    templateUrl: "./date-time-picker.component.html",
    styleUrls: ["./date-time-picker.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent implements OnInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private popupRef: PopupRef | null = null;
    public readonly dateIcon: IconDefinition = faCalendar;
    public readonly nextMonthIcon: IconDefinition = faChevronRight;
    public readonly prevMonthIcon: IconDefinition = faChevronLeft;
    public readonly timeIcon: IconDefinition = faClock;
    public readonly wrongDateIcon: IconDefinition = faTimes;
    public calendarView: CalendarView = "month";
    public currentDateInvalid: boolean = false;
    public currentDateString: string = "";
    public decadeYears: number[] = [];
    public hours: number[] = [];
    public meridiem: "AM" | "PM" = "AM";
    public minutes: number[] = [];
    public monthBounds: { start: Date; end: Date } = { start: new Date(), end: new Date() };
    public monthlyViewDict: Dictionary<Date, number> = new Dictionary<Date, number>();
    public navigatedDate: Date = new Date();

    @ViewChild("datePopupTemplate")
    public datePopupTemplateRef?: TemplateRef<void>;

    @Input()
    public format: string = "d/M/yyyy";

    @Input()
    public hourFormat: "12" | "24" = "24";

    @ViewChild("timePopupTemplate")
    public timePopupTemplateRef?: TemplateRef<void>;

    @Input()
    public value: Date | null = null;

    @Output()
    public valueChange: EventEmitter<Date> = new EventEmitter<Date>();

    public constructor(
        public readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        const date = this.value ?? DateTime.now().toJSDate();
        this.prepareMonthlyViewDictionary(date);
        this.navigatedDate = date;
        this.meridiem = date.getHours() >= 12 ? "PM" : "AM";
        this.prepareHours();
        this.prepareMinutes();
        if (this.value) {
            this.setCurrentDate(this.value);
        }
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

    public onDateInputButtonClick(): void {
        if (!this.datePopupTemplateRef) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-date-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.calendarView = "month";
            this.navigatedDate = this.value ?? DateTime.now().toJSDate();
            this.prepareMonthlyViewDictionary(this.navigatedDate);
        });
    }

    public onDateStringEdit(dateString: string): void {
        this.currentDateString = dateString;
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
        this.currentDateInvalid = false;
        this.cdr.markForCheck();
        this.popupRef?.close(true);
    }

    public onMeridiemClick(meridiem: "AM" | "PM"): void {
        this.meridiem = meridiem;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate)
            .set({ hour: this.navigatedDate.getHours() + (meridiem === "AM" ? -12 : 12) })
            .toJSDate();
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

    public onTimeCancelClick(): void {
        this.popupRef?.close(true);
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
    }

    public onTimeInputButtonClick(): void {
        if (!this.timePopupTemplateRef) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.timePopupTemplateRef,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-date-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe({
            next: viaMethod => {
                if (viaMethod instanceof PointerEvent) {
                    this.onTimeCancelClick();
                }
            }
        });
    }

    public onTimeSetClick(): void {
        this.popupRef?.close(true);
        this.setCurrentDate(this.navigatedDate);
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

    private prepareHours(): void {
        this.hours = Array.from({ length: 24 }, (_, i) => i);
    }

    private prepareMinutes(): void {
        this.minutes = Array.from({ length: 60 }, (_, i) => i);
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
        this.valueChange.emit(this.value);
        this.cdr.markForCheck();
    }

    public get hour(): number {
        if (this.hourFormat === "12") {
            return this.navigatedDate.getHours() % 12 || 12;
        }
        return this.navigatedDate.getHours();
    }

    public set hour(value: number) {
        if (value < 0) {
            value = 23;
        }
        let hour: number;
        if (this.hourFormat === "24") {
            hour = value % 24;
        } else {
            hour = value % 12;
            if (this.meridiem === "PM") {
                hour += 12;
            }
        }
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ hour }).toJSDate();
    }

    public get minute(): number {
        return this.navigatedDate ? DateTime.fromJSDate(this.navigatedDate).minute : 0;
    }

    public set minute(value: number | string) {
        if (!this.navigatedDate) {
            this.navigatedDate = DateTime.now().toJSDate();
        }
        const minute = +value > 59 ? 0 : +value < 0 ? 59 : +value;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute }).toJSDate();
    }

    public get timezone(): string {
        return DateTime.local().zoneName;
    }
}
