import { NgFor, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    QueryList,
    TemplateRef
} from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { Action } from "../../../../utils/Action";
import { TextBoxPrefixTemplateDirective } from "../../directives/text-box-prefix-template.directive";
import { TextBoxSuffixTemplateDirective } from "../../directives/text-box-suffix-template.directive";
import { TextBoxDirective } from "../../directives/text-box.directive";

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
    imports: [NgFor, NgTemplateOutlet, TextBoxDirective, FormsModule, ButtonDirective, FaIconComponent]
})
export class TextBoxComponent implements ControlValueAccessor {
    private propagateChange: Action<string, any> | null = null;
    protected readonly clearIcon: IconDefinition = faTimes;
    public value: string = "";

    @Input()
    public clearButton: boolean = false;

    @Input()
    public disabled: boolean = false;

    @Output()
    public inputBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocus: EventEmitter<Event> = new EventEmitter<Event>();

    @Input()
    public placeholder: string = "";

    @ContentChildren(TextBoxPrefixTemplateDirective, { read: TemplateRef })
    public prefixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @Input()
    public readonly: boolean = false;

    @ContentChildren(TextBoxSuffixTemplateDirective, { read: TemplateRef })
    public suffixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    public constructor(public readonly elementRef: ElementRef<HTMLDivElement>) {}

    public onClearClick(): void {
        this.value = "";
        this.propagateChange?.(this.value);
    }

    public onValueChange(value: string): void {
        this.value = value;
        this.propagateChange?.(value);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
        void 0;
    }

    public writeValue(obj: string): void {
        if (obj != null) {
            this.value = obj;
        }
    }
}
