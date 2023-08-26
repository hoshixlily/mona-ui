import {
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output,
    QueryList,
    TemplateRef
} from "@angular/core";
import { TextBoxPrefixTemplateDirective } from "../../directives/text-box-prefix-template.directive";
import { TextBoxSuffixTemplateDirective } from "../../directives/text-box-suffix-template.directive";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { Action } from "../../../../../utils/Action";
import { TextBoxDirective } from "../../directives/text-box.directive";
import { NgFor, NgTemplateOutlet } from "@angular/common";

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
    imports: [NgFor, NgTemplateOutlet, TextBoxDirective, FormsModule]
})
export class TextBoxComponent implements OnInit, ControlValueAccessor {
    private propagateChange: Action<string, any> | null = null;
    public value: string = "";

    @Input()
    public disabled: boolean = false;

    @Output()
    public inputBlur: EventEmitter<Event> = new EventEmitter<Event>();

    @Output()
    public inputFocus: EventEmitter<Event> = new EventEmitter<Event>();

    @ContentChildren(TextBoxPrefixTemplateDirective, { read: TemplateRef })
    public prefixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    @Input()
    public readonly: boolean = false;

    @ContentChildren(TextBoxSuffixTemplateDirective, { read: TemplateRef })
    public suffixTemplateList: QueryList<TemplateRef<any>> = new QueryList<TemplateRef<any>>();

    public constructor(public readonly elementRef: ElementRef<HTMLDivElement>) {}

    public ngOnInit(): void {}

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
