import { Component, ContentChild, forwardRef, Input, OnInit, TemplateRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../utils/Action";
import { FadeAnimation } from "../../../../animations/models/fade.animation";
import { SwitchOffLabelTemplateDirective } from "../../directives/switch-off-label-template.directive";
import { SwitchOnLabelTemplateDirective } from "../../directives/switch-on-label-template.directive";
import { NgClass, NgIf, NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "mona-switch",
    templateUrl: "./switch.component.html",
    styleUrls: ["./switch.component.scss"],
    animations: [FadeAnimation()],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SwitchComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [NgClass, NgIf, NgTemplateOutlet]
})
export class SwitchComponent implements OnInit, ControlValueAccessor {
    private propagateChange: Action<boolean> | null = null;
    public active: boolean = false;

    @Input()
    public disabled: boolean = false;

    @Input()
    public labelOff: string = "OFF";

    @Input()
    public labelOn: string = "ON";

    @ContentChild(SwitchOffLabelTemplateDirective, { read: TemplateRef })
    public offLabelTemplate: TemplateRef<never> | null = null;

    @ContentChild(SwitchOnLabelTemplateDirective, { read: TemplateRef })
    public onLabelTemplate: TemplateRef<never> | null = null;

    public constructor() {}

    public ngOnInit(): void {}

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public toggle(event: Event): void {
        this.active = !this.active;
        this.propagateChange?.(this.active);
    }

    public writeValue(obj: boolean): void {
        if (obj !== undefined) {
            this.active = obj;
        }
    }
}
