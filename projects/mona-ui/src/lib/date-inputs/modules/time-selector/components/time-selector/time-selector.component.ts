import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import { DateTime } from "luxon";
import { Subject } from "rxjs";

@Component({
    selector: "mona-time-selector",
    templateUrl: "./time-selector.component.html",
    styleUrls: ["./time-selector.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeSelectorComponent implements OnInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    public hours: number[] = [];
    public meridiem: "AM" | "PM" = "AM";
    public minutes: number[] = [];
    public navigatedDate: Date = new Date();

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public value: Date | null = null;

    @Output()
    public valueChange: EventEmitter<Date> = new EventEmitter<Date>();

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        const date = this.value ?? DateTime.now().toJSDate();
        this.navigatedDate = date;
        this.meridiem = date.getHours() >= 12 ? "PM" : "AM";
        this.prepareHours();
        this.prepareMinutes();
    }

    public onMeridiemClick(meridiem: "AM" | "PM"): void {
        this.meridiem = meridiem;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate)
            .set({ hour: this.navigatedDate.getHours() + (meridiem === "AM" ? -12 : 12) })
            .toJSDate();
        this.setCurrentDate(this.navigatedDate);
    }

    private prepareHours(): void {
        this.hours = Array.from({ length: 24 }, (_, i) => i);
    }

    private prepareMinutes(): void {
        this.minutes = Array.from({ length: 60 }, (_, i) => i);
    }

    private setCurrentDate(date: Date): void {
        this.value = date;
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
        this.setCurrentDate(this.navigatedDate);
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
        this.setCurrentDate(this.navigatedDate);
    }
}
