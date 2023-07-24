import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Action } from "../../../../../utils/Action";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { AnimationState } from "../../../../../animations/AnimationState";

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
    ]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
    private popupRef: PopupRef | null = null;
    private propagateChange: Action<string | null> | null = null;
    public readonly noColorIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public color: string | null = null;

    @ViewChild("colorPickerAnchor")
    public colorPickerAnchor!: ElementRef<HTMLDivElement>;

    @Input()
    public palette: string[] = [];

    @ViewChild("popupTemplate")
    public popupTemplateRef!: TemplateRef<any>;

    @Output()
    public valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

    public constructor(
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {}

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
