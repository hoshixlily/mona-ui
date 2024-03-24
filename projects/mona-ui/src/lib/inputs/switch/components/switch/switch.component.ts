import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    contentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    inject,
    input,
    InputSignal,
    OnInit,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { fromEvent } from "rxjs";
import { FadeAnimation } from "../../../../animations/models/fade.animation";
import { Action } from "../../../../utils/Action";
import { SwitchOffLabelTemplateDirective } from "../../directives/switch-off-label-template.directive";
import { SwitchOnLabelTemplateDirective } from "../../directives/switch-on-label-template.directive";

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
    imports: [NgClass, NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        "[class.mona-switch]": "true",
        "[class.mona-disabled]": "disabled()",
        "[class.mona-switch-active]": "active()"
    }
})
export class SwitchComponent implements OnInit, ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #propagateChange: Action<boolean> | null = null;

    protected readonly active: WritableSignal<boolean> = signal(false);
    protected readonly offLabelTemplate = contentChild(SwitchOffLabelTemplateDirective, { read: TemplateRef });
    protected readonly onLabelTemplate = contentChild(SwitchOnLabelTemplateDirective, { read: TemplateRef });

    public disabled: InputSignal<boolean> = input(false);
    public labelOff: InputSignal<string> = input("OFF");
    public labelOn: InputSignal<string> = input("ON");

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any) {
        void 0;
    }

    public writeValue(obj: boolean): void {
        if (obj !== undefined) {
            this.active.set(obj);
        }
    }

    private setEventListeners(): void {
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.active.set(!this.active());
                this.#propagateChange?.(this.active());
            });
    }
}
