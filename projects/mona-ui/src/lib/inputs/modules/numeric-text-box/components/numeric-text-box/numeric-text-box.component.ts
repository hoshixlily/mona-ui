import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from "@angular/core";
import { delay, interval, Subject, takeUntil } from "rxjs";
import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { Action } from "../../../../../utils/Action";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { faChevronDown, faChevronUp, IconDefinition } from "@fortawesome/free-solid-svg-icons";

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
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private readonly specialKeys: string[] = [
        "Backspace",
        "Tab",
        "End",
        "Home",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Delete",
        "Escaped"
    ];
    private propagateChange: Action<number | null> | null = null;
    public readonly decreaseIcon: IconDefinition = faChevronDown;
    public readonly increaseIcon: IconDefinition = faChevronUp;
    public componentValue: number | null = null;
    public spin$: Subject<Sign> = new Subject<Sign>();
    public spinStop$: Subject<void> = new Subject<void>();
    public value$: Subject<string> = new Subject<string>();
    public visibleValue: string | number = "";

    @Input()
    public decimals?: number = 0;

    @Input()
    public disabled: boolean = false;

    @Input()
    public formatter: Action<number | null, string> = (value: number | null): string =>
        value?.toFixed(this.decimals ?? 2) ?? "";

    @Input()
    public max?: number;

    @Input()
    public min?: number;

    @Input()
    public readonly: boolean = false;

    @Input()
    public step: number = 1;

    @Input()
    public set value(value: number | null) {
        this.updateValue(value == null ? null : String(value), false);
    }

    @Output()
    public valueChange: EventEmitter<number | null> = new EventEmitter<number | null>();

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
        if (this.componentValue == null) {
            this.value$.next("0");
        } else {
            let result = NumericTextBoxComponent.calculate(this.componentValue, this.step, "-");
            if (this.min != null && result < this.min) {
                result = this.min;
            }
            this.value$.next(result.toString());
        }
        this.focus();
    }

    public increase(): void {
        if (this.componentValue == null) {
            this.value$.next("0");
        } else {
            let result = NumericTextBoxComponent.calculate(this.componentValue, this.step, "+");
            if (this.max != null && result > this.max) {
                result = this.max;
            }
            this.value$.next(result.toString());
        }
        this.focus();
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.spinStop$.next();
        this.spinStop$.complete();
        this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    }

    public ngOnInit(): void {
        this.setSubscriptions();
        this.focusMonitor
            .monitor(this.elementRef, true)
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((focusOrigin: FocusOrigin) => {
                if (!focusOrigin) {
                    this.visibleValue = this.formatter(this.componentValue) ?? "";
                } else {
                    this.visibleValue = this.componentValue ?? "";
                }
            });
    }

    public onKeydown(event: KeyboardEvent): void {
        if (event.ctrlKey) {
            return;
        }
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
        if (!this.specialKeys.includes(event.key)) {
            if (this.preventInvalidMinusSign(event)) {
                return;
            }
            if (!event.key.match(/[0-9.,\-]/)) {
                event.preventDefault();
                return;
            }
            if (this.containsExcessiveDecimalPlaces(event)) {
                event.preventDefault();
            }
        }
    }

    public onMouseWheel(event: WheelEvent): void {
        if (event.deltaY < 0) {
            this.increase();
        } else {
            this.decrease();
        }
    }

    public onPaste(event: ClipboardEvent): void {
        const pastedData = event.clipboardData?.getData("Text");
        if (!pastedData || !NumericTextBoxComponent.isNumeric(pastedData)) {
            event.preventDefault();
        }
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any) {}

    public writeValue(obj: number | string) {
        if (obj !== undefined) {
            if (obj != null && typeof obj === "string" && !NumericTextBoxComponent.isNumeric(obj)) {
                throw new Error("Value must be a number.");
            }
            this.componentValue = +obj;
            this.visibleValue = this.formatter(this.componentValue) ?? "";
        }
    }

    private containsExcessiveDecimalPlaces(event: KeyboardEvent): boolean {
        const target = event.target as HTMLInputElement;
        if (this.componentValue != null) {
            if (event.key === ".") {
                return this.decimals === 0;
            }
            const valueStr = this.componentValue.toString();
            if (!valueStr.includes(".")) {
                return false;
            }
            const valueParts = valueStr.split(".");
            if (
                this.decimals != null &&
                valueParts[1].length >= this.decimals &&
                target.selectionStart &&
                target.selectionStart > valueParts[0].length
            ) {
                return true;
            }
        }
        return false;
    }

    private focus(): void {
        this.focusMonitor.focusVia(this.valueTextBoxRef, "keyboard");
    }

    private preventInvalidMinusSign(event: KeyboardEvent): boolean {
        const target = event.target as HTMLInputElement;
        if (event.key === "-") {
            if (target.selectionStart !== 0) {
                event.preventDefault();
                return true;
            }
            if (target.selectionStart === 0 && this.componentValue?.toString().charAt(0) === "-") {
                event.preventDefault();
                return true;
            }
        }
        return false;
    }

    private setSubscriptions(): void {
        this.value$.pipe(takeUntil(this.componentDestroy$)).subscribe((value: string) => {
            this.updateValue(value);
        });
        this.spin$.pipe(takeUntil(this.componentDestroy$)).subscribe((sign: Sign) => {
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
    }

    private updateValue(value: string | null, emit: boolean = true): void {
        if (this.readonly) {
            return;
        }
        this.componentValue =
            value == null ? null : NumericTextBoxComponent.isNumeric(value) ? parseFloat(value) : null;
        this.visibleValue = this.componentValue == null ? "" : this.componentValue;
        if (emit) {
            this.valueChange.emit(this.componentValue);
            this.propagateChange?.(this.componentValue);
        }
    }
}
