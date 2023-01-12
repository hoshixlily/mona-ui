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
import { faCalendar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
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
    public calendarView: CalendarView = "month";
    public dayDictionary: Dictionary<Date, number> = new Dictionary<Date, number>();

    public currentDateString: string = "";

    @ViewChild("dateMenuButton")
    public readonly dateMenuButton?: ElementRef<HTMLButtonElement>;

    @ViewChild("datePopupTemplate")
    public readonly popupTemplate?: TemplateRef<void>;

    @Input()
    public value: Date = new Date();

    public constructor(
        private readonly cdr: ChangeDetectorRef,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {
        this.prepareDayDictionary();
        this.currentDateString = DateTime.fromJSDate(this.value).toFormat("dd/MM/yyyy");
    }

    public onDateInputButtonClick(event: MouseEvent): void {
        if (!this.dateMenuButton || !this.popupTemplate) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.popupTemplate,
            width: this.elementRef.nativeElement.clientWidth
        });
    }

    public onDayClick(day: number, date: Date): void {
        this.setCurrentDate(date);
        this.cdr.markForCheck();
        this.popupRef?.close();
        this.prepareDayDictionary();
    }

    // weekStartsOnMonday = true
    private prepareDayDictionary(): void {
        const firstDayOfMonth = DateTime.fromJSDate(this.value).startOf("month");
        const lastDayOfMonth = DateTime.fromJSDate(this.value).endOf("month");
        const firstDayOfCalendar = firstDayOfMonth.startOf("week");
        const lastDayOfCalendar = lastDayOfMonth.endOf("week");
        const dayDictionary = new Dictionary<Date, number>();
        for (let i = firstDayOfCalendar; i <= lastDayOfCalendar; i = i.plus({ days: 1 })) {
            dayDictionary.add(i.toJSDate(), i.day);
        }
        if (lastDayOfMonth.weekday === 7) {
            for (let i = 0; i < 7; i++) {
                dayDictionary.add(lastDayOfMonth.plus({ days: i + 1 }).toJSDate(), i + 1);
            }
        }
        this.dayDictionary = dayDictionary;
    }

    private setCurrentDate(date: Date): void {
        this.value = date;
        this.currentDateString = DateTime.fromJSDate(this.value).toFormat("dd/MM/yyyy");
    }
}
