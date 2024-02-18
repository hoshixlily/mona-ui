import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { NgClass, NgTemplateOutlet } from "@angular/common";
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
    input,
    Input,
    InputSignal,
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
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { delay, distinctUntilChanged, filter, interval, map, Subject, takeUntil } from "rxjs";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { Action } from "../../../../utils/Action";
import { TextBoxDirective } from "../../../text-box/directives/text-box.directive";
import { NumericTextBoxPrefixTemplateDirective } from "../../directives/numeric-text-box-prefix-template.directive";

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
    ],
    standalone: true,
    imports: [NgClass, NgTemplateOutlet, TextBoxDirective, FormsModule, ButtonDirective, FontAwesomeModule],
    host: {
        "[class.mona-numeric-text-box]": "true",
        "[class.mona-disabled]": "disabled"
    }
})
export class NumericTextBoxComponent implements OnInit, OnDestroy, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #focusMonitor: FocusMonitor = inject(FocusMonitor);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #propagateChange: Action<number | null> | null = null;

    protected readonly beforeInput$: Subject<InputEvent> = new Subject<InputEvent>();
    protected readonly decreaseIcon: IconDefinition = faChevronDown;
    protected readonly increaseIcon: IconDefinition = faChevronUp;
    protected readonly valueChange$: Subject<string> = new Subject<string>();
    protected readonly focused: WritableSignal<boolean> = signal(false);
    protected readonly formattedValue: Signal<string> = computed(() => {
        const value = this.value();
        const focused = this.focused();
        const decimals = this.decimals();
        const formatter = this.formatter();
        if (value == null) {
            return "";
        }
        if (focused && !this.readonly) {
            return value?.toString() ?? "";
        }
        if (formatter) {
            return formatter(value);
        }
        if (decimals > 0) {
            return value?.toFixed(decimals) ?? "";
        }
        return value?.toString() ?? "";
    });
    protected readonly keydown$: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    protected readonly value: WritableSignal<number | null> = signal(null);
    protected readonly spin$: Subject<Sign> = new Subject<Sign>();
    protected readonly spinStop$: Subject<void> = new Subject<void>();
    protected readonly wheel$: Subject<WheelEvent> = new Subject<WheelEvent>();

    public decimals: InputSignal<number> = input(0);
    public formatter: InputSignal<Action<number | null, string> | null> = input<Action<number | null, string> | null>(
        null
    );
    public max: InputSignal<number | undefined> = input<number | undefined>(undefined);
    public min: InputSignal<number | undefined> = input<number | undefined>(undefined);
    public nullable: InputSignal<boolean> = input(true);
    public readonly: InputSignal<boolean> = input(false);
    public required: InputSignal<boolean> = input(false);
    public spinners: InputSignal<boolean> = input(true);
    public step: InputSignal<number> = input(1);
    public tabindex: InputSignal<number> = input(0);

    @Input()
    public disabled: boolean = false;

    @Output()
    public inputBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocus: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocusOut: EventEmitter<Event> = new EventEmitter<Event>();

    @ContentChildren(NumericTextBoxPrefixTemplateDirective, { read: TemplateRef })
    public prefixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @ViewChild("valueTextBox")
    public valueTextBoxRef!: ElementRef<HTMLInputElement>;

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
            let result = NumericTextBoxComponent.calculate(value, this.step(), "-");
            const min = this.min();
            if (min != null && result < min) {
                result = min;
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
            let result = NumericTextBoxComponent.calculate(value, this.step(), "+");
            const max = this.max();
            if (max != null && result > max) {
                result = max;
            }
            this.valueChange$.next(result.toString());
        }
        this.focus();
    }

    public ngOnDestroy(): void {
        this.#focusMonitor.stopMonitoring(this.#hostElementRef.nativeElement);
    }

    public ngOnInit(): void {
        this.setSubscriptions();
        this.#focusMonitor
            .monitor(this.#hostElementRef, true)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((focusOrigin: FocusOrigin) => {
                this.focused.set(focusOrigin !== null);
            });
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(obj: number | null | undefined) {
        if (obj == null) {
            this.value.set(null);
            return;
        }
        this.value.set(Number(obj));
    }

    private focus(): void {
        this.#focusMonitor.focusVia(this.valueTextBoxRef, "keyboard");
    }

    private setSubscriptions(): void {
        this.valueChange$
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                distinctUntilChanged(),
                filter(v => v == null || v === "" || NumericTextBoxComponent.isNumeric(v)),
                map(v => {
                    if (v == null || v === "") {
                        if (this.nullable()) {
                            return null;
                        }
                        if (this.min() != null) {
                            return this.min();
                        }
                        return 0;
                    }
                    return parseFloat(v.toString());
                })
            )
            .subscribe(value => {
                const previousValue = this.value();
                const max = this.max();
                const min = this.min();
                if (value == null) {
                    this.value.set(null);
                } else if (min != null && value < min) {
                    this.value.set(min);
                } else if (max != null && value > max) {
                    this.value.set(max);
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
            .subscribe(() => this.#hostElementRef.nativeElement.focus());

        this.beforeInput$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((event: InputEvent): void => {
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
            if (!RegExp(/[0-9.-]/).exec(insertedText)) {
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
                if (this.decimals() === 0 || value.includes(".")) {
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

            const max = this.max();
            const min = this.min();
            if (min != null && parseFloat(newValue) < min) {
                event.preventDefault();
                this.valueChange$.next(min.toString());
                return;
            }

            if (max != null && parseFloat(newValue) > max) {
                event.preventDefault();
                this.valueChange$.next(max.toString());
            }
        });
    }
}
