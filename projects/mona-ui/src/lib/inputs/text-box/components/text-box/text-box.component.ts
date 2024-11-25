import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChildren,
    forwardRef,
    input,
    output,
    signal,
    TemplateRef
} from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { Action } from "../../../../utils/Action";
import { TextBoxPrefixTemplateDirective } from "../../directives/text-box-prefix-template.directive";
import { TextBoxSuffixTemplateDirective } from "../../directives/text-box-suffix-template.directive";
import { InputType } from "../../models/InputType";

@Component({
    selector: "mona-text-box",
    templateUrl: "./text-box.component.html",
    styleUrls: ["./text-box.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextBoxComponent),
            multi: true
        }
    ],
    imports: [NgTemplateOutlet, FormsModule, ButtonDirective],
    host: {
        "[class.mona-text-box]": "true",
        "[class.mona-disabled]": "disabled()",
        "[class.mona-readonly]": "readonly()"
    }
})
export class TextBoxComponent implements ControlValueAccessor {
    #propagateChange: Action<string, any> | null = null;

    protected readonly prefixTemplateList = contentChildren(TextBoxPrefixTemplateDirective, { read: TemplateRef });
    protected readonly suffixTemplateList = contentChildren(TextBoxSuffixTemplateDirective, { read: TemplateRef });

    public readonly inputBlur = output<Event>();
    public readonly inputFocus = output<Event>();

    public clearButton = input<boolean>(false);
    public disabled = input<boolean>(false);
    public inputClass = input<string | string[]>("");
    public inputStyle = input<string | Partial<CSSStyleDeclaration | null | undefined>>(undefined);
    public placeholder = input<string>("");
    public readonly = input<boolean>(false);
    public type = input<InputType>("text");
    public value = signal<string>("");

    public onClearClick(): void {
        this.value.set("");
        this.#propagateChange?.(this.value());
    }

    public onValueChange(value: string): void {
        this.value.set(value);
        this.#propagateChange?.(value);
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
        void 0;
    }

    public writeValue(obj: string): void {
        if (obj != null) {
            this.value.set(obj);
        }
    }
}
