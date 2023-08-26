import { Component, ElementRef, forwardRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { Action } from "../../utils/Action";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { PopupService } from "../../popup/services/popup.service";
import { AnimationState } from "../../animations/models/AnimationState";
import { ColorPickerView } from "../models/ColorPickerView";
import { PaletteType } from "../models/PaletteType";
import { ColorGradientComponent } from "../color-gradient/color-gradient/color-gradient.component";
import { ColorPaletteComponent } from "../color-palette/color-palette.component";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgIf } from "@angular/common";

@Component({
    selector: "mona-color-picker",
    templateUrl: "./color-picker.component.html",
    styleUrls: ["./color-picker.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPickerComponent),
            multi: true
        }
    ],
    standalone: true,
    imports: [NgIf, FontAwesomeModule, ButtonDirective, ColorPaletteComponent, FormsModule, ColorGradientComponent]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
    private popupRef: PopupRef | null = null;
    private propagateChange: Action<string | null> | null = null;
    public readonly noColorIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public color: string | null = null;

    @ViewChild("colorPickerAnchor")
    public colorPickerAnchor!: ElementRef<HTMLDivElement>;

    /**
     * The number of columns to display in the color palette.
     * Only applies when the view is set to "palette" and the palette is a custom array of colors.
     * @default 10
     * @type {number}
     */
    @Input()
    public columns: number = 10;

    /**
     * Whether to display the opacity slider.
     * Only applies when the view is set to "gradient".
     * @default true
     * @type {boolean}
     */
    @Input()
    public opacity: boolean = true;

    @Input()
    public palette: string[] | PaletteType = "flat";

    @ViewChild("popupTemplate")
    public popupTemplateRef!: TemplateRef<any>;

    @Input()
    public view: ColorPickerView = "gradient";

    public constructor(
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {}

    public onColorGradientValueChange(value: string | null): void {
        this.color = value;
        this.propagateChange?.(value);
    }

    public onColorPaletteValueChange(value: string | null): void {
        this.color = value;
        this.propagateChange?.(value);
    }

    public open(): void {
        this.popupRef = this.popupService.create({
            anchor: this.colorPickerAnchor,
            content: this.popupTemplateRef,
            popupClass: "mona-color-picker-popup",
            width: "auto",
            hasBackdrop: false,
            closeOnOutsideClick: false
        });
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.popupRef);
        this.popupAnimationService.animateDropdown(this.popupRef, AnimationState.Show);
    }

    public registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public writeValue(obj: string | null): void {
        this.color = obj;
    }
}
