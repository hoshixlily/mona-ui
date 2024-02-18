import {
    Component,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    InputSignal,
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { fromEvent } from "rxjs";
import { AnimationState } from "../../animations/models/AnimationState";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupService } from "../../popup/services/popup.service";
import { Action } from "../../utils/Action";
import { ColorGradientComponent } from "../color-gradient/components/color-gradient/color-gradient.component";
import { ColorPaletteComponent } from "../color-palette/color-palette.component";
import { ColorPickerView } from "../models/ColorPickerView";
import { PaletteType } from "../models/PaletteType";

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
    imports: [FontAwesomeModule, ButtonDirective, ColorPaletteComponent, FormsModule, ColorGradientComponent],
    host: {
        "[class.mona-color-picker]": "true",
        "[class.mona-input-selector]": "true",
        "[attr.tabindex]": "0"
    }
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<string | null> | null = null;
    protected readonly noColorIcon: IconDefinition = faTimes;
    protected readonly dropdownIcon: IconDefinition = faChevronDown;
    protected readonly color: WritableSignal<string | null> = signal<string | null>(null);

    /**
     * The number of columns to display in the color palette.
     * Only applies when the view is set to "palette" and the palette is a custom array of colors.
     * @default 10
     * @type {number}
     */
    public columns: InputSignal<number> = input(10);
    /**
     * Whether to display the opacity slider.
     * Only applies when the view is set to "gradient".
     * @default true
     * @type {boolean}
     */
    public opacity: InputSignal<boolean> = input(true);
    public palette: InputSignal<string[] | PaletteType> = input<string[] | PaletteType>("flat");
    public view: InputSignal<ColorPickerView> = input<ColorPickerView>("gradient");

    @ViewChild("popupTemplate")
    public popupTemplateRef!: TemplateRef<any>;

    public constructor(
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public onColorGradientValueChange(value: string | null): void {
        this.color.set(value);
        this.#propagateChange?.(value);
    }

    public onColorPaletteValueChange(value: string | null): void {
        this.color.set(value);
        this.#propagateChange?.(value);
    }

    public open(): void {
        this.#popupRef = this.popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.popupTemplateRef,
            popupClass: "mona-color-picker-popup",
            width: "auto",
            hasBackdrop: false,
            closeOnOutsideClick: false
        });
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.#popupRef);
        this.popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Show);
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public writeValue(obj: string | null): void {
        this.color.set(obj);
    }

    private setEventListeners(): void {
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => this.open());
    }
}
