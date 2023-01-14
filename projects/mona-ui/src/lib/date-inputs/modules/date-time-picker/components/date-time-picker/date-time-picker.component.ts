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
    public monthBounds: { start: Date; end: Date } = { start: new Date(), end: new Date() };
    public monthlyViewDict: Dictionary<Date, number> = new Dictionary<Date, number>();
    public navigatedDate: Date = new Date();

    @ViewChild("dateMenuButton")
    public readonly dateMenuButton?: ElementRef<HTMLButtonElement>;

    @ViewChild("datePopupTemplate")
    public readonly popupTemplate?: TemplateRef<void>;

    @Input()
    public value: Date = new Date();

    public constructor(
        public readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {
        this.value.setHours(0, 0, 0);
        this.prepareMonthlyViewDictionary(this.value);
        this.currentDateString = DateTime.fromJSDate(this.value).toFormat("d/M/yyyy");
        this.navigatedDate = this.value;
    }

    public onDateInputBlur(): void {
        const date1 = DateTime.fromFormat(this.currentDateString, "d/M/yyyy");
        const date2 = DateTime.fromFormat(this.currentDateString, "dd/MM/yy");
        const validDate = date1.isValid ? date1 : date2.isValid ? date2 : null;
        if (validDate) {
            this.setCurrentDate(validDate.toJSDate());
            this.prepareMonthlyViewDictionary(validDate.toJSDate());
            this.currentDateInvalid = false;
            this.navigatedDate = validDate.toJSDate();
            this.cdr.detectChanges();
        } else {
            this.currentDateInvalid = true;
        }
    }

    public onDateInputButtonClick(event: MouseEvent): void {
        if (!this.dateMenuButton || !this.popupTemplate) {
            return;
        }
        this.prepareMonthlyViewDictionary(this.value);
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.popupTemplate,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-date-time-picker-popup"
        });
        this.popupRef.closed.subscribe(() => {
            this.navigatedDate = this.value;
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

    public onMonthNavigationClick(direction: "prev" | "next"): void {
        const date = DateTime.fromJSDate(this.navigatedDate);
        this.navigatedDate =
            direction === "prev" ? date.minus({ months: 1 }).toJSDate() : date.plus({ months: 1 }).toJSDate();
        this.prepareMonthlyViewDictionary(this.navigatedDate);
        this.cdr.markForCheck();
    }

    // weekStartsOnMonday = true
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
        this.currentDateString = DateTime.fromJSDate(this.value).toFormat("d/M/yyyy");
    }

    public get timezone(): string {
        return DateTime.local().zoneName;
    }
}
