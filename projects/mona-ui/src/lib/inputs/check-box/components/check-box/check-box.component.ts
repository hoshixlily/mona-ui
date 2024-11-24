import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    forwardRef,
    input,
    output,
    Signal,
    signal,
    viewChild
} from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../utils/Action";
import { CheckBoxDirective } from "../../directives/check-box.directive";

@Component({
    selector: "mona-check-box",
    imports: [CheckBoxDirective, FormsModule],
    templateUrl: "./check-box.component.html",
    styleUrl: "./check-box.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckBoxComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "[class.mona-check-box]": "true",
        "[class.mona-disabled]": "disabled()"
    }
})
export class CheckBoxComponent implements ControlValueAccessor {
    #propagateChange: Action<boolean> | null = null;

    protected readonly checkBox: Signal<ElementRef<HTMLInputElement>> = viewChild.required("checkBox");
    protected readonly checked = signal<boolean>(false);
    protected readonly inputBlur = output<FocusEvent>();
    protected readonly inputChange = output<Event>();
    protected readonly inputFocus = output<FocusEvent>();

    public disabled = input<boolean>(false);
    public indeterminate = input<boolean>(false);
    public label = input<string>("");
    public labelPosition = input<"before" | "after">("after");

    public constructor() {
        effect(() => {
            const indeterminate = this.indeterminate();
            this.checkBox().nativeElement.setAttribute("indeterminate", indeterminate ? "true" : "false");
        });
    }

    public onCheckedChange(checked: boolean): void {
        this.checked.set(checked);
        if (this.#propagateChange) {
            this.#propagateChange(checked);
        }
    }

    public registerOnChange(fn: any) {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any) {}

    public writeValue(value: boolean): void {
        if (value !== this.checked()) {
            this.checked.set(value);
        }
    }
}
