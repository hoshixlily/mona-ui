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
    public valueChange: EventEmitter<Date | null> = new EventEmitter<Date | null>();

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        if (this.time) {
            this.navigatedDate = this.time;
            this.meridiem = this.navigatedDate.getHours() >= 12 ? "PM" : "AM";
        }
    }

    public onHourChange(value: number | null): void {
        if (value === null) {
            this.hour = null;
            this.setCurrentDate(null);
            return;
        }
        if (!this.navigatedDate) {
            const now = this.minute != null ? DateTime.now().set({ minute: this.minute }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        if (value < 0) {
            value = 23;
        }
        let newHour: number;
        if (this.hourFormat === "24") {
            newHour = value % 24;
        } else {
            newHour = value % 12;
            if (this.meridiem === "PM") {
                newHour += 12;
            }
        }
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ hour: newHour }).toJSDate();
        if (this.hourFormat === "12") {
            this.hour = newHour % 12 || 12;
            if (this.minute == null) {
                this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute: 0 }).toJSDate();
                this.minute = this.navigatedDate.getMinutes();
            }
        }
        this.setCurrentDate(this.navigatedDate);
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
        this.setCurrentDate(this.navigatedDate);
    }

    public onMinuteChange(value: number | null): void {
        if (value === null) {
            this.minute = null;
            this.setCurrentDate(null);
            return;
        }
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const minute = +value > 59 ? 0 : +value < 0 ? 59 : +value;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute }).toJSDate();
        this.minute = minute;
        if (this.hour == null) {
            this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ hour: 12 }).toJSDate();
            this.hour =
                this.hourFormat === "12" ? this.navigatedDate.getHours() % 12 || 12 : this.navigatedDate.getHours();
        }
        this.setCurrentDate(this.navigatedDate);
    }

    private setCurrentDate(date: Date | null): void {
        this.time = date;
        this.navigatedDate = date;
        this.valueChange.emit(this.time);
        this.cdr.markForCheck();
    }
}
