import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import { DateTime } from "luxon";
import { Enumerable } from "@mirei/ts-collections";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";

@Component({
    selector: "mona-time-selector",
    templateUrl: "./time-selector.component.html",
    styleUrls: ["./time-selector.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSelectorComponent extends AbstractDateInputComponent implements OnInit, OnDestroy, AfterViewInit {
    public hour: number | null = null;
    public hours: number[] = [];
    public meridiem: "AM" | "PM" = "AM";
    public minute: number | null = null;
    public minutes: number[] = [];
    public second: number | null = null;
    public seconds: number[] = [];

    @Input()
    public hourFormat: "12" | "24" = "24";

    @ViewChild("hoursListElement")
    public hoursListElement!: ElementRef<HTMLOListElement>;

    @ViewChild("minutesListElement")
    public minutesListElement!: ElementRef<HTMLOListElement>;

    @ViewChild("secondsListElement")
    public secondsListElement!: ElementRef<HTMLOListElement>;

    @Input()
    public showSeconds: boolean = false;

    public constructor(protected override readonly cdr: ChangeDetectorRef, private readonly elementRef: ElementRef) {
        super(cdr);
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            const lists = this.elementRef.nativeElement.querySelectorAll("ol") as HTMLOListElement[];
            for (const list of lists) {
                this.scrollList(list);
            }
        }, 0);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.hours = this.hourFormat === "24" ? Enumerable.range(0, 24).toArray() : Enumerable.range(1, 12).toArray();
        this.minutes = Enumerable.range(0, 60).toArray();
        this.seconds = Enumerable.range(0, 60).toArray();
        if (this.value) {
            this.navigatedDate = this.value;
            this.meridiem = this.navigatedDate.getHours() >= 12 ? "PM" : "AM";
            this.updateHour();
            this.updateMinute();
            this.updateSecond();
        }
    }

    public onHourChange(value: number): void {
        this.hour = value;
        if (!this.navigatedDate) {
            const now = this.minute != null ? DateTime.now().set({ minute: this.minute }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        if (this.hour < 0) {
            this.hour = 23;
        }
        let newHour: number;
        if (this.hourFormat === "24") {
            newHour = this.hour % 24;
        } else {
            newHour = this.hour % 12;
            if (this.meridiem === "PM") {
                newHour += 12;
            }
        }
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ hour: newHour }).toJSDate();
        if (this.hourFormat === "12") {
            this.hour = newHour % 12 || 12;
        }
        this.setCurrentDate(this.navigatedDate);
        this.scrollList(this.hoursListElement.nativeElement, newHour);
    }

    public onMeridiemClick(meridiem: "AM" | "PM"): void {
        if (this.readonly && this.meridiem === meridiem) {
            return;
        }
        const date = DateTime.now().toJSDate();
        this.meridiem = meridiem;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate ?? date)
            .set({ hour: (this.navigatedDate ?? date).getHours() + (meridiem === "AM" ? -12 : 12) })
            .toJSDate();
        this.updateHour();
        this.updateMinute();
        this.updateSecond();
        this.setCurrentDate(this.navigatedDate);
    }

    public onMinuteChange(value: number): void {
        this.minute = value;
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const minute = +this.minute > 59 ? 0 : +this.minute < 0 ? 59 : +this.minute;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute }).toJSDate();
        this.minute = minute;
        this.setCurrentDate(this.navigatedDate);
        this.scrollList(this.minutesListElement.nativeElement, minute);
    }

    public onSecondChange(value: number): void {
        this.second = value;
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const second = +this.second > 59 ? 0 : +this.second < 0 ? 59 : +this.second;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ second }).toJSDate();
        this.second = second;
        this.scrollList(this.secondsListElement.nativeElement, second);
        this.setCurrentDate(this.navigatedDate);
    }

    private scrollList(list: HTMLOListElement, value?: number): void {
        if (value == null) {
            window.setTimeout(() => {
                const selectedElement = list.querySelector(".mona-selected") as HTMLOListElement;
                if (selectedElement) {
                    selectedElement.scrollIntoView({ behavior: "auto", block: "center" });
                }
            }, 0);
        } else {
            const element = list.querySelector(`[data-value="${value}"]`) as HTMLOListElement;
            if (element) {
                element.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }

    private updateHour(): void {
        if (this.navigatedDate) {
            this.hour =
                this.hourFormat === "12" ? this.navigatedDate.getHours() % 12 || 12 : this.navigatedDate.getHours();
        }
    }

    private updateMinute(): void {
        if (this.navigatedDate) {
            this.minute = this.navigatedDate.getMinutes();
        }
    }

    private updateSecond(): void {
        if (this.navigatedDate) {
            this.second = this.navigatedDate.getSeconds();
        }
    }
}
