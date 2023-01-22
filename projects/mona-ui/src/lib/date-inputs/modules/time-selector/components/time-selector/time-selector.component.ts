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
    public hour: number | null = null;
    public meridiem: "AM" | "PM" = "AM";
    public minute: number | null = null;
    public navigatedDate: Date | null = null;
    public time: Date | null = null;

    @Input()
    public disabled: boolean = false;

    @Input()
    public hourFormat: "12" | "24" = "24";

    @Input()
    public readonly: boolean = false;

    @Input()
    public set value(value: Date | null) {
        this.time = value;
        this.cdr.markForCheck();
    }

    @Output()
    public valueChange: EventEmitter<Date> = new EventEmitter<Date>();

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        if (this.time) {
            this.navigatedDate = this.time;
            this.meridiem = this.navigatedDate.getHours() >= 12 ? "PM" : "AM";
            this.updateHour();
            this.updateMinute();
        }
    }

    public onHourBlur(event: Event): void {
        if (this.hour === null) {
            this.hour = 12;
        }
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
            if (this.minute == null) {
                this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute: 0 }).toJSDate();
                this.updateMinute();
            }
        }
        this.setCurrentDate(this.navigatedDate);
    }

    public onHourChange(value: number | null): void {
        this.hour = value;
    }

    public onMeridiemClick(meridiem: "AM" | "PM"): void {
        if (this.readonly) {
            return;
        }
        const date = DateTime.now().toJSDate();
        this.meridiem = meridiem;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate ?? date)
            .set({ hour: (this.navigatedDate ?? date).getHours() + (meridiem === "AM" ? -12 : 12) })
            .toJSDate();
        this.updateHour();
        this.updateMinute();
        this.setCurrentDate(this.navigatedDate);
    }

    public onMinuteBlur(event: Event): void {
        if (this.minute === null) {
            this.minute = 0;
        }
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const minute = +this.minute > 59 ? 0 : +this.minute < 0 ? 59 : +this.minute;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute }).toJSDate();
        this.minute = minute;
        if (this.hour == null) {
            this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ hour: 12 }).toJSDate();
            this.updateHour();
        }
        this.setCurrentDate(this.navigatedDate);
    }

    public onMinuteChange(value: number | null): void {
        this.minute = value;
    }

    private setCurrentDate(date: Date): void {
        this.time = date;
        this.navigatedDate = date;
        this.valueChange.emit(this.time);
        this.cdr.markForCheck();
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
}
