import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { delay, distinctUntilChanged, filter, interval, map, Subject, takeUntil } from "rxjs";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { Action } from "../../../../../utils/Action";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faChevronDown, faChevronUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { NumericTextBoxPrefixTemplateDirective } from "../../directives/numeric-text-box-prefix-template.directive";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

type Sign = "-" | "+";

@Component({
    selector: "mona-numeric-text-box",
    templateUrl: "./numeric-text-box.component.html",
    styleUrls: ["./numeric-text-box.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumericTextBoxComponent),
            multi: true
        }
    ]
})
export class NumericTextBoxComponent implements OnInit, OnDestroy, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #propagateChange: Action<number | null> | null = null;

    public readonly beforeInput$: Subject<InputEvent> = new Subject<InputEvent>();
    public readonly decreaseIcon: IconDefinition = faChevronDown;
    public readonly increaseIcon: IconDefinition = faChevronUp;
    public readonly valueChange$: Subject<string> = new Subject<string>();
    public focused: WritableSignal<boolean> = signal(false);
    public formattedValue: Signal<string> = signal("");
    public keydown$: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    public value: WritableSignal<number | null> = signal(null);
    public spin$: Subject<Sign> = new Subject<Sign>();
    public spinStop$: Subject<void> = new Subject<void>();
    public wheel$: Subject<WheelEvent> = new Subject<WheelEvent>();

    @Input()
    public decimals: number = 0;

    @Input()
    public disabled: boolean = false;

    @Input()
    public formatter: Action<number | null, string> | null = null;

    @Output()
    public inputBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocus: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocusOut: EventEmitter<Event> = new EventEmitter<Event>();

    @Input()
    public max?: number;

    @Input()
    public min?: number;

    @Input()
    public nullable: boolean = true;

    @ContentChildren(NumericTextBoxPrefixTemplateDirective, { read: TemplateRef })
    public prefixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @Input()
    public readonly: boolean = false;

    @Input()
    public required: boolean = false;

    @Input()
    public spinners: boolean = true;

    @Input()
    public step: number = 1;

    @Input()
    public tabindex: number = 0;

    @ViewChild("valueTextBox")
    public valueTextBoxRef!: ElementRef<HTMLInputElement>;

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly focusMonitor: FocusMonitor
    ) {}

    private static calculate(value: number, step: number, type: Sign): number {
        const precision = Math.max(
            NumericTextBoxComponent.getPrecision(value),
            NumericTextBoxComponent.getPrecision(step)
        );
        const factor = Math.pow(10, precision);
        const signFactor = type === "+" ? 1 : -1;
        const newValue = (value * factor + signFactor * step * factor) / factor;
        return precision > 0 ? parseFloat(newValue.toFixed(precision)) : newValue;
    }

    private static getPrecision(value: number): number {
        const valueString = value.toString();
        if (valueString.includes(".")) {
            const parts = valueString.split(".");
            return parts[1].length;
        }
        return 0;
    }

    private static isNumeric(value: unknown): boolean {
        return (
            (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && !isNaN(value as number)
        );
    }

    public decrease(): void {
        const value = this.value();
        if (value == null) {
            this.valueChange$.next("0");
        } else {
            let result = NumericTextBoxComponent.calculate(value, this.step, "-");
            if (this.min != null && result < this.min) {
                result = this.min;
            }
            this.valueChange$.next(result.toString());
        }
        this.focus();
    }

    public increase(): void {
        const value = this.value();
        if (value == null) {
            this.valueChange$.next("0");
        } else {
            let result = NumericTextBoxComponent.calculate(value, this.step, "+");
            if (this.max != null && result > this.max) {
                result = this.max;
            }
            this.valueChange$.next(result.toString());
        }
        this.focus();
    }

    public ngOnDestroy(): void {
        this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    }

    public ngOnInit(): void {
        this.formattedValue = computed(() => {
            const value = this.value();
            const focused = this.focused();
            if (value == null) {
                return "";
            }
            if (focused && !this.readonly) {
                return value?.toString() ?? "";
            }
            if (this.formatter) {
                return this.formatter(value);
            }
            if (this.decimals > 0) {
                return value?.toFixed(this.decimals) ?? "";
            }
            return value?.toString() ?? "";
        });

        this.setSubscriptions();
        this.focusMonitor
            .monitor(this.elementRef, true)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((focusOrigin: FocusOrigin) => {
                this.focused.set(focusOrigin !== null);
            });
    }

    public registerOnChange(fn: any) {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any) {}

    public writeValue(obj: number | null | undefined) {
        if (obj == null) {
            this.value.set(null);
            return;
        }
        this.value.set(Number(obj));
    }

    private focus(): void {
        this.focusMonitor.focusVia(this.valueTextBoxRef, "keyboard");
    }

    private setSubscriptions(): void {
        this.valueChange$
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                distinctUntilChanged(),
                filter(v => v == null || v === "" || NumericTextBoxComponent.isNumeric(v)),
                map(v => {
                    if (v == null || v === "") {
                        if (this.nullable) {
                            return null;
                        }
                        if (this.min != null) {
                            return this.min;
                        }
                        return 0;
                    }
                    return parseFloat(v.toString());
                })
            )
            .subscribe((value: number | null) => {
                const previousValue = this.value();
                if (value == null) {
                    this.value.set(null);
                } else if (this.min != null && value < this.min) {
                    this.value.set(this.min);
                } else if (this.max != null && value > this.max) {
                    this.value.set(this.max);
                } else {
                    this.value.set(value);
                }
                if (previousValue !== this.value()) {
                    this.#propagateChange?.(this.value());
                }
            });
        this.keydown$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((event: KeyboardEvent) => {
            if (event.key === "ArrowUp") {
                event.preventDefault();
                this.increase();
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();
                this.decrease();
                return;
            }
        });
        this.spin$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((sign: Sign) => {
            if (sign === "-") {
                this.decrease();
            } else {
                this.increase();
            }
            interval(100)
                .pipe(delay(300), takeUntil(this.spinStop$))
                .subscribe(() => {
                    if (sign === "-") {
                        this.decrease();
                    } else {
                        this.increase();
                    }
                });
        });
        this.wheel$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((event: WheelEvent) => {
            event.preventDefault();
            if (event.deltaY < 0) {
                this.increase();
            } else {
                this.decrease();
            }
        });
        this.inputFocus
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => this.elementRef.nativeElement.focus());

        this.beforeInput$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((event: InputEvent) => {
            const inputElement = event.target as HTMLInputElement;

            if (event.inputType.startsWith("delete")) {
                if (inputElement.value.length === 1 && !this.nullable) {
                    if (this.min != null) {
                        event.preventDefault();
                        this.valueChange$.next(this.min.toString());
                        return;
                    } else {
                        event.preventDefault();
                        return;
                    }
                }
            }

            const insertedText = event.data;
            if (insertedText == null || insertedText === "") {
                return;
            }
            if (!insertedText.match(/[0-9.\-]/)) {
                event.preventDefault();
                return;
            }

            const value = inputElement.value;
            const selectionStart = inputElement.selectionStart;
            const selectionEnd = inputElement.selectionEnd;
            if (selectionStart == null || selectionEnd == null) {
                event.preventDefault();
                return;
            }

            if (insertedText === "-") {
                if ((selectionStart !== 0 || value.includes("-")) && selectionEnd - selectionStart !== value.length) {
                    event.preventDefault();
                    return;
                }
            }

            if (insertedText === ".") {
                if (this.decimals === 0 || value.includes(".")) {
                    event.preventDefault();
                    return;
                }
            }

            const newValue = value.slice(0, selectionStart) + insertedText + value.slice(selectionEnd);
            if (
                selectionEnd - selectionStart === value.length &&
                newValue !== "-" &&
                !NumericTextBoxComponent.isNumeric(newValue)
            ) {
                event.preventDefault();
                return;
            }

            if (newValue.includes(".")) {
                const decimals = newValue.split(".")[1];
                if (decimals.length > String(this.decimals).length) {
                    event.preventDefault();
                    return;
                }
            }

            if (this.min != null && parseFloat(newValue) < this.min) {
                event.preventDefault();
                this.valueChange$.next(this.min.toString());
                return;
            }

            if (this.max != null && parseFloat(newValue) > this.max) {
                event.preventDefault();
                this.valueChange$.next(this.max.toString());
                return;
            }
        });
    }
}
