import { ChangeDetectionStrategy, Component, forwardRef, input, output, signal } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../utils/Action";
import { RadioButtonDirective } from "../../directives/radio-button.directive";

@Component({
    selector: "mona-radio-button",
    standalone: true,
    imports: [RadioButtonDirective, FormsModule],
    templateUrl: "./radio-button.component.html",
    styleUrl: "./radio-button.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioButtonComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "[class.mona-radio-button]": "true",
        "[class.mona-disabled]": "disabled()"
    }
})
export class RadioButtonComponent implements ControlValueAccessor {
    #propagateChange: Action<any> | null = null;

    protected readonly selectedValue = signal<any>(undefined);

    public readonly inputBlur = output<FocusEvent>();
    public readonly inputClick = output<FocusEvent>();
    public readonly inputFocus = output<FocusEvent>();

    public disabled = input(false);
    public label = input("");
    public labelPosition = input<"before" | "after">("after");
    public name = input("");
    public value = input<any>(undefined);

    public onCheckedChange(checked: boolean): void {
        this.selectedValue.set(checked);
        if (this.#propagateChange) {
            this.#propagateChange(checked);
        }
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(value: boolean): void {
        if (value !== this.selectedValue()) {
            this.selectedValue.set(value);
        }
    }
}
