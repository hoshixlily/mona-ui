import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    EventEmitter,
    forwardRef,
    input,
    Input,
    InputSignal,
    Output,
    QueryList,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { Action } from "../../../../utils/Action";
import { TextBoxPrefixTemplateDirective } from "../../directives/text-box-prefix-template.directive";
import { TextBoxSuffixTemplateDirective } from "../../directives/text-box-suffix-template.directive";
import { TextBoxDirective } from "../../directives/text-box.directive";
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
    standalone: true,
    imports: [NgTemplateOutlet, TextBoxDirective, FormsModule, ButtonDirective, FaIconComponent],
    host: {
        "[class.mona-text-box]": "true",
        "[class.mona-disabled]": "disabled()",
        "[class.mona-readonly]": "readonly()"
    }
})
export class TextBoxComponent implements ControlValueAccessor {
    #propagateChange: Action<string, any> | null = null;
    protected readonly clearIcon: IconDefinition = faTimes;

    public clearButton: InputSignal<boolean> = input<boolean>(false);
    public disabled: InputSignal<boolean> = input<boolean>(false);
    public inputClass: InputSignal<string | string[]> = input<string | string[]>("");
    public inputStyle: InputSignal<string | Partial<CSSStyleDeclaration> | null | undefined> = input<
        string | Partial<CSSStyleDeclaration | null | undefined>
    >(undefined);
    public placeholder: InputSignal<string> = input<string>("");
    public readonly: InputSignal<boolean> = input<boolean>(false);
    public type: InputSignal<InputType> = input<InputType>("text");
    public value: WritableSignal<string> = signal<string>("");

    @Output()
    public inputBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocus: EventEmitter<Event> = new EventEmitter<Event>();

    @ContentChildren(TextBoxPrefixTemplateDirective, { read: TemplateRef })
    public prefixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @ContentChildren(TextBoxSuffixTemplateDirective, { read: TemplateRef })
    public suffixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

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
