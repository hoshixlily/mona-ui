import {
    DestroyRef,
    Directive,
    effect,
    ElementRef,
    Host,
    inject,
    input,
    InputSignal,
    model,
    ModelSignal,
    OnInit,
    Optional,
    signal,
    untracked
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, takeWhile } from "rxjs";
import { ButtonService } from "../services/button.service";

@Directive({
    selector: "button[monaButton]",
    host: {
        "[attr.disabled]": "disabled() ? '' : undefined",
        "[attr.aria-disabled]": "disabled() ? true : undefined",
        "[attr.aria-selected]": "selected() ? true : undefined",
        "[attr.tabindex]": "tabindex()",
        "[class.mona-button]": "true",
        "[class.mona-disabled]": "disabled()",
        "[class.mona-selected]": "selected()",
        "[class.mona-flat]": "flat()",
        "[class.mona-primary]": "primary()"
    },
    standalone: true
})
export class ButtonDirective implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLButtonElement> = inject(ElementRef);

    public disabled = model<boolean>(false);
    public flat: InputSignal<boolean> = input(false);
    public primary: InputSignal<boolean> = input(false);
    public selected: ModelSignal<boolean> = model(false);
    public tabindex = input<number, number | string>(0, {
        transform: (value: number | string) => (typeof value === "string" ? parseInt(value, 10) : value)
    });
    public toggleable = input(false);

    public constructor(@Host() @Optional() private readonly buttonService: ButtonService) {
        effect(() => {
            this.selected();
            untracked(() => {
                if (this.buttonService) {
                    this.buttonService.buttonSelected$.next(this);
                }
            });
        });
        effect(() => {
            const disabled = this.disabled();
            const tabindex = this.tabindex();
            untracked(() => {
                this.#hostElementRef.nativeElement.tabIndex = disabled ? -1 : tabindex;
            });
        });
        effect(() => {
            const toggleable = this.toggleable();
            if (toggleable) {
                untracked(() => this.setToggleableEvent());
            }
        });
    }

    public ngOnInit(): void {
        this.buttonService?.buttonSelect$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(result => {
            const [button, selected] = result;
            if (button === this) {
                this.selected.set(selected);
            }
        });
    }

    private setToggleableEvent(): void {
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                takeWhile(() => this.toggleable())
            )
            .subscribe(() => {
                if (this.buttonService) {
                    this.buttonService.buttonClick$.next(this);
                } else {
                    this.selected.set(!this.selected());
                }
            });
    }
}
