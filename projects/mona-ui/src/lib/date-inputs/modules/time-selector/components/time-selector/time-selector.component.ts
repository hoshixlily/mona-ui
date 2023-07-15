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
import { Action } from "../../../../../utils/Action";
import { Meridiem } from "../../../../models/Meridiem";
import { TimeUnit } from "../../models/TimeUnit";

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
    ]
})
export class TimeSelectorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    #propagateChange: Action<Date | null> | null = null;
    #value: Date | null = null;
    public currentDateString: string = "";
    public hour: Signal<number> = signal(0);
    public hours: TimeUnit[] = [];
    public meridiem: Meridiem = "AM";
    public minute: Signal<number> = signal(0);
    public minutes: TimeUnit[] = [];
    public navigatedDate: WritableSignal<Date> = signal(new Date());
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
    }

    public onHourChange(value: number): void {
        const updatedDate = DateTime.fromJSDate(this.navigatedDate()).set({ hour: value });
        this.navigatedDate.set(updatedDate.toJSDate());
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.hoursListElement.nativeElement, value);
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
        this.setCurrentDate(this.navigatedDate());
    }

    public onMinuteChange(value: number): void {
        this.navigatedDate.set(DateTime.fromJSDate(this.navigatedDate()).set({ minute: value }).toJSDate());
        this.setCurrentDate(this.navigatedDate());
        this.scrollList(this.minutesListElement.nativeElement, value);
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
        // if (date == null) {
        //     this.currentDateString = "";
        // } else {
        //     this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        // }
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
            const element = list.querySelector(`[data-value="${value}"]`) as HTMLOListElement;
            if (element) {
                element.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }

    private setCurrentDate(date: Date | null): void {
        this.#value = date;
        this.updateCurrentDateString(date);
        this.#propagateChange?.(date);
    }

    private setDateValues(): void {
        this.initializeNavigatedDate(this.value);
        this.meridiem = this.navigatedDate().getHours() >= 12 ? "PM" : "AM";
        if (this.value) {
            this.updateCurrentDateString(this.navigatedDate());
        } else {
            this.updateCurrentDateString(null);
        }
    }

    private updateCurrentDateString(date: Date | null): void {
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        } else {
            this.currentDateString = "";
        }
    }

    public get value(): Date | null {
        return this.#value;
    }
}
