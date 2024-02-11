import {
    Component,
    effect,
    ElementRef,
    forwardRef,
    input,
    InputSignal,
    signal,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../utils/Action";
import { CheckBoxDirective } from "../../check-box.directive";

@Component({
    selector: "mona-check-box",
    standalone: true,
    imports: [CheckBoxDirective, FormsModule],
    templateUrl: "./check-box.component.html",
    styleUrl: "./check-box.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckBoxComponent),
            multi: true
        }
    ]
})
export class CheckBoxComponent implements ControlValueAccessor {
    #propagateChange: Action<boolean> | null = null;
    protected readonly checked: WritableSignal<boolean> = signal<boolean>(false);
    public disabled: InputSignal<boolean> = input<boolean>(false);
    public indeterminate: InputSignal<boolean> = input<boolean>(false);
    public label: InputSignal<string> = input<string>("");

    @ViewChild("checkBox")
    public checkBox: ElementRef<HTMLInputElement> | null = null;

    public constructor() {
        effect(() => {
            const indeterminate = this.indeterminate();
            this.checkBox?.nativeElement?.setAttribute("indeterminate", indeterminate ? "true" : "false");
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
