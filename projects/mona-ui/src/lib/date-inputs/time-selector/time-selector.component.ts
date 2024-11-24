import { DecimalPipe, NgClass } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    forwardRef,
    inject,
    input,
    model,
    OnInit,
    signal,
    viewChild
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Enumerable, range, select } from "@mirei/ts-collections";
import { DateTime } from "luxon";
import { Action } from "../../utils/Action";
import { HourFormat } from "../models/HourFormat";
import { Meridiem } from "../models/Meridiem";
import { TimeUnit } from "../models/TimeUnit";
import { TimeLimiterPipe } from "../pipes/time-limiter.pipe";
import { generateHourSet } from "../utils/generateHourSet";

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
    imports: [NgClass, DecimalPipe, TimeLimiterPipe],
    host: {
        "[class.mona-time-selector]": "true",
        "[class.mona-disabled]": "disabled()"
    }
})
export class TimeSelectorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    readonly #hostElementRef = inject(ElementRef<HTMLElement>);
    #propagateChange: Action<Date | null> | null = null;
    #value: Date | null = null;
    protected readonly amMeridiemVisible = computed(() => {
        const min = this.min();
        return !(min && min.getHours() >= 12);
    });
    protected readonly hour = computed(() => {
        const hour = this.navigatedDate().getHours();
        const hourFormat = this.hourFormat();
        if (hourFormat === "24") {
            return hour;
        }
        return hour % 12 || 12;
    });
    protected readonly hoursListElement = viewChild.required<ElementRef<HTMLOListElement>>("hoursListElement");
    protected readonly meridiem = signal<Meridiem>("AM");
    protected readonly minute = computed(() => this.navigatedDate().getMinutes());
    protected readonly minutes = select<number, TimeUnit>(range(0, 60), m => ({ value: m, viewValue: m })).toArray();
    protected readonly minutesListElement = viewChild.required<ElementRef<HTMLOListElement>>("minutesListElement");
    protected readonly navigatedDate = signal(new Date());
    protected readonly pmMeridiemVisible = computed(() => {
        const max = this.max();
        return !(max && max.getHours() < 12);
    });
    protected readonly second = computed(() => this.navigatedDate().getSeconds());
    protected readonly seconds = Enumerable.range(0, 60)
        .select<TimeUnit>(s => ({ value: s, viewValue: s }))
        .toArray();
    protected readonly secondsListElement = viewChild.required<ElementRef<HTMLOListElement>>("secondsListElement");
    protected readonly viewHours = computed(() => {
        const meridiem = this.meridiem();
        const hourFormat = this.hourFormat();
        return generateHourSet(hourFormat, meridiem);
    });

    public disabled = model(false);
    public hourFormat = input<HourFormat>("24");
    public max = input<Date | null>(null);
    public min = input<Date | null>(null);
    public readonly = input(false);
    public showSeconds = input(false);

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            const lists = this.#hostElementRef.nativeElement.querySelectorAll("ol") as NodeListOf<HTMLOListElement>;
            for (const list of Array.from(lists)) {
                this.scrollList(list);
            }
        }, 0);
    }

    public ngOnInit(): void {
        this.setDateValues();
        if (this.#value) {
            this.navigatedDate.set(this.#value);
        }
    }

    public onHourChange(value: number): void {
        const updatedDate = DateTime.fromJSDate(this.navigatedDate()).set({ hour: value });
        this.navigatedDate.set(updatedDate.toJSDate());
        const minuteData = this.updateMinuteToFitInMaxAndMin();
        const secondData = this.updateSecondToFitInMaxAndMin();
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.hoursListElement().nativeElement, value);
        if (minuteData) {
            this.scrollList(this.minutesListElement().nativeElement, minuteData.value);
        }
        if (secondData) {
            this.scrollList(this.secondsListElement().nativeElement, secondData.value);
        }
    }

    public onMeridiemClick(meridiem: "AM" | "PM"): void {
        if (this.readonly() || this.meridiem() === meridiem) {
            return;
        }
        const hour = this.navigatedDate().getHours();

        if (meridiem === "PM" && hour < 12) {
            this.navigatedDate().setHours(hour + 12);
        } else if (meridiem === "AM" && hour >= 12) {
            this.navigatedDate().setHours(hour - 12);
        }

        this.meridiem.set(meridiem);
        const hourData = this.updateHourToFitInMaxAndMin();
        const minuteData = this.updateMinuteToFitInMaxAndMin();
        const secondData = this.updateSecondToFitInMaxAndMin();
        this.setCurrentDate(this.navigatedDate());
        if (hourData) {
            this.scrollList(this.hoursListElement().nativeElement, hourData.value);
        }
        if (minuteData) {
            this.scrollList(this.minutesListElement().nativeElement, minuteData.value);
        }
        if (secondData) {
            this.scrollList(this.secondsListElement().nativeElement, secondData.value);
        }
    }

    public onMinuteChange(value: number): void {
        this.navigatedDate.set(DateTime.fromJSDate(this.navigatedDate()).set({ minute: value }).toJSDate());
        const secondData = this.updateSecondToFitInMaxAndMin();
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.minutesListElement().nativeElement, value);
        if (secondData) {
            this.scrollList(this.secondsListElement().nativeElement, secondData.value);
        }
    }

    public onSecondChange(value: number): void {
        this.navigatedDate.set(DateTime.fromJSDate(this.navigatedDate()).set({ second: value }).toJSDate());
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.secondsListElement().nativeElement, value);
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    public writeValue(date: Date | null | undefined): void {
        this.#value = date ?? null;
        this.setDateValues();
    }

    private initializeNavigatedDate(date: Date | null): void {
        const min = this.min();
        const max = this.max();
        if (!date) {
            this.navigatedDate.set(DateTime.now().toJSDate());
        } else if (min && date < min) {
            this.navigatedDate.set(min);
        } else if (max && date > max) {
            this.navigatedDate.set(max);
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
        this.initializeNavigatedDate(this.#value);
        const meridiem = this.navigatedDate().getHours() >= 12 ? "PM" : "AM";
        this.meridiem.set(meridiem);
    }

    private updateHourToFitInMaxAndMin(): TimeUnit | null {
        const min = this.min();
        const max = this.max();
        const timeLimiterPipe = new TimeLimiterPipe();
        const hours = generateHourSet(this.hourFormat(), this.meridiem());
        const hourRange = timeLimiterPipe.transform(hours, "h", this.navigatedDate(), min, max);
        if (!hourRange.select(h => h.value).contains(this.hour())) {
            const date = new Date(this.navigatedDate());
            date.setHours(hourRange.first().value);
            this.navigatedDate.set(date);
            return hourRange.first();
        }
        return null;
    }

    private updateMinuteToFitInMaxAndMin(): TimeUnit | null {
        const min = this.min();
        const max = this.max();
        const timeLimiterPipe = new TimeLimiterPipe();
        const minuteRange = timeLimiterPipe.transform(this.minutes, "m", this.navigatedDate(), min, max);
        if (!minuteRange.select(m => m.value).contains(this.minute())) {
            const date = new Date(this.navigatedDate());
            date.setMinutes(minuteRange.first().value);
            this.navigatedDate.set(date);
            return minuteRange.first();
        }
        return null;
    }

    private updateSecondToFitInMaxAndMin(): TimeUnit | null {
        const min = this.min();
        const max = this.max();
        const timeLimiterPipe = new TimeLimiterPipe();
        const secondRange = timeLimiterPipe.transform(this.seconds, "s", this.navigatedDate(), min, max);
        if (!secondRange.select(s => s.value).contains(this.second())) {
            const date = new Date(this.navigatedDate());
            date.setSeconds(secondRange.first().value);
            this.navigatedDate.set(date);
            return secondRange.first();
        }
        return null;
    }
}
