import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    forwardRef,
    Input,
    OnInit,
    Signal,
    signal,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { DateTime } from "luxon";
import { Enumerable } from "@mirei/ts-collections";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../utils/Action";
import { Meridiem } from "../models/Meridiem";
import { TimeUnit } from "../models/TimeUnit";
import { TimeLimiterPipe } from "../pipes/time-limiter.pipe";
import { HourSelectorPipe } from "../pipes/hour-selector.pipe";
import { NgClass, NgFor, NgIf, DecimalPipe } from "@angular/common";

@Component({
    selector: "mona-time-selector",
    templateUrl: "./time-selector.component.html",
    styleUrls: ["./time-selector.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TimeSelectorComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [NgClass, NgFor, NgIf, DecimalPipe, HourSelectorPipe, TimeLimiterPipe]
})
export class TimeSelectorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    #propagateChange: Action<Date | null> | null = null;
    #value: Date | null = null;
    public amMeridiemVisible: boolean = true;
    public hour: Signal<number> = signal(0);
    public hours: TimeUnit[] = [];
    public meridiem: Meridiem = "AM";
    public minute: Signal<number> = signal(0);
    public minutes: TimeUnit[] = [];
    public navigatedDate: WritableSignal<Date> = signal(new Date());
    public pmMeridiemVisible: boolean = true;
    public second: Signal<number> = signal(0);
    public seconds: TimeUnit[] = [];

    @Input()
    public disabled: boolean = false;

    @Input()
    public format: string = "HH:mm";

    @Input()
    public hourFormat: "12" | "24" = "24";

    @ViewChild("hoursListElement")
    public hoursListElement!: ElementRef<HTMLOListElement>;

    @Input()
    public max: Date | null = null;

    @Input()
    public min: Date | null = null;

    @ViewChild("minutesListElement")
    public minutesListElement!: ElementRef<HTMLOListElement>;

    @Input()
    public readonly: boolean = false;

    @ViewChild("secondsListElement")
    public secondsListElement!: ElementRef<HTMLOListElement>;

    @Input()
    public showSeconds: boolean = false;

    public constructor(private readonly elementRef: ElementRef) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            const lists = this.elementRef.nativeElement.querySelectorAll("ol") as HTMLOListElement[];
            for (const list of lists) {
                this.scrollList(list);
            }
        }, 0);
    }

    public ngOnInit(): void {
        this.setDateValues();
        this.minutes = Enumerable.range(0, 60)
            .select<TimeUnit>(m => ({ value: m, viewValue: m }))
            .toArray();
        this.seconds = Enumerable.range(0, 60)
            .select<TimeUnit>(s => ({ value: s, viewValue: s }))
            .toArray();
        if (this.value) {
            this.navigatedDate.set(this.value);
        }
        this.hour = computed(() => {
            const hour = this.navigatedDate().getHours();
            if (this.hourFormat === "24") {
                return hour;
            }
            return hour % 12 || 12;
        });
        this.minute = computed(() => this.navigatedDate().getMinutes());
        this.second = computed(() => this.navigatedDate().getSeconds());

        if (this.min) {
            if (this.min.getHours() >= 12) {
                this.amMeridiemVisible = false;
            }
        }

        if (this.max) {
            if (this.max.getHours() < 12) {
                this.pmMeridiemVisible = false;
            }
        }
    }

    public onHourChange(value: number): void {
        const updatedDate = DateTime.fromJSDate(this.navigatedDate()).set({ hour: value });
        this.navigatedDate.set(updatedDate.toJSDate());
        const minuteData = this.updateMinuteToFitInMaxAndMin();
        const secondData = this.updateSecondToFitInMaxAndMin();
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.hoursListElement.nativeElement, value);
        if (minuteData) {
            this.scrollList(this.minutesListElement.nativeElement, minuteData.value);
        }
        if (secondData) {
            this.scrollList(this.secondsListElement.nativeElement, secondData.value);
        }
    }

    public onMeridiemClick(meridiem: "AM" | "PM"): void {
        if (this.readonly || this.meridiem === meridiem) {
            return;
        }
        const hour = this.navigatedDate().getHours();

        if (meridiem === "PM" && hour < 12) {
            this.navigatedDate().setHours(hour + 12);
        } else if (meridiem === "AM" && hour >= 12) {
            this.navigatedDate().setHours(hour - 12);
        }

        this.meridiem = meridiem;
        const hourData = this.updateHourToFitInMaxAndMin();
        const minuteData = this.updateMinuteToFitInMaxAndMin();
        const secondData = this.updateSecondToFitInMaxAndMin();
        this.setCurrentDate(this.navigatedDate());
        if (hourData) {
            this.scrollList(this.hoursListElement.nativeElement, hourData.value);
        }
        if (minuteData) {
            this.scrollList(this.minutesListElement.nativeElement, minuteData.value);
        }
        if (secondData) {
            this.scrollList(this.secondsListElement.nativeElement, secondData.value);
        }
    }

    public onMinuteChange(value: number): void {
        this.navigatedDate.set(DateTime.fromJSDate(this.navigatedDate()).set({ minute: value }).toJSDate());
        const secondData = this.updateSecondToFitInMaxAndMin();
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.minutesListElement.nativeElement, value);
        if (secondData) {
            this.scrollList(this.secondsListElement.nativeElement, secondData.value);
        }
    }

    public onSecondChange(value: number): void {
        this.navigatedDate.set(DateTime.fromJSDate(this.navigatedDate()).set({ second: value }).toJSDate());
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.secondsListElement.nativeElement, value);
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(date: Date | null | undefined): void {
        this.#value = date ?? null;
        this.setDateValues();
    }

    private initializeNavigatedDate(date: Date | null): void {
        if (!date) {
            this.navigatedDate.set(DateTime.now().toJSDate());
        } else if (this.min && date < this.min) {
            this.navigatedDate.set(this.min);
        } else if (this.max && date > this.max) {
            this.navigatedDate.set(this.max);
        } else {
            this.navigatedDate.set(date);
        }
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
            window.setTimeout(() => {
                const element = list.querySelector(`[data-value="${value}"]`) as HTMLOListElement;
                if (element) {
                    element.scrollIntoView({ behavior: "auto", block: "center" });
                }
            });
        }
    }

    private setCurrentDate(date: Date | null): void {
        this.#value = date;
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        this.initializeNavigatedDate(this.value);
        this.meridiem = this.navigatedDate().getHours() >= 12 ? "PM" : "AM";
    }

    private updateHourToFitInMaxAndMin(): TimeUnit | null {
        const timeLimiterPipe = new TimeLimiterPipe();
        const hours = new HourSelectorPipe().transform([], this.hourFormat, this.meridiem);
        const hourRange = timeLimiterPipe.transform(hours, "h", this.navigatedDate(), this.min, this.max);
        if (!hourRange.map(h => h.value).includes(this.hour())) {
            const date = new Date(this.navigatedDate());
            date.setHours(hourRange[0].value);
            this.navigatedDate.set(date);
            return hourRange[0];
        }
        return null;
    }

    private updateMinuteToFitInMaxAndMin(): TimeUnit | null {
        const timeLimiterPipe = new TimeLimiterPipe();
        const minuteRange = timeLimiterPipe.transform(this.minutes, "m", this.navigatedDate(), this.min, this.max);
        if (!minuteRange.map(m => m.value).includes(this.minute())) {
            const date = new Date(this.navigatedDate());
            date.setMinutes(minuteRange[0].value);
            this.navigatedDate.set(date);
            return minuteRange[0];
        }
        return null;
    }

    private updateSecondToFitInMaxAndMin(): TimeUnit | null {
        const timeLimiterPipe = new TimeLimiterPipe();
        const secondRange = timeLimiterPipe.transform(this.seconds, "s", this.navigatedDate(), this.min, this.max);
        if (!secondRange.map(s => s.value).includes(this.second())) {
            const date = new Date(this.navigatedDate());
            date.setSeconds(secondRange[0].value);
            this.navigatedDate.set(date);
            return secondRange[0];
        }
        return null;
    }

    public get value(): Date | null {
        return this.#value;
    }
}
