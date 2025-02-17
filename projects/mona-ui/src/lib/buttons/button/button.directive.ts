import { DestroyRef, Directive, effect, ElementRef, inject, input, model, OnInit, untracked } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, takeWhile } from "rxjs";
import { ButtonService } from "../services/button.service";

@Directive({
    selector: "button[monaButton]",
    host: {
        "[attr.aria-describedby]": "ariaDescribedby()",
        "[attr.aria-disabled]": "disabled() ? true : undefined",
        "[attr.aria-expanded]": "toggleable() ? selected() : undefined",
        "[attr.aria-haspopup]": "false",
        "[attr.aria-label]": "ariaLabel()",
        "[attr.aria-labelledby]": "ariaLabelledby()",
        "[attr.aria-pressed]": "toggleable() ? selected() : undefined",
        "[attr.aria-selected]": "selected() ? true : undefined",
        "[attr.disabled]": "disabled() ? '' : undefined",
        "[attr.role]": "'button'",
        "[attr.tabindex]": "tabindex()",
        "[attr.type]": "'button'",
        "[class.mona-button]": "true",
        "[class.mona-disabled]": "disabled()",
        "[class.mona-flat]": "flat()",
        "[class.mona-primary]": "primary()",
        "[class.mona-selected]": "selected()"
    },
    standalone: true
})
export class ButtonDirective implements OnInit {
    readonly #buttonService = inject(ButtonService, { host: true, optional: true });
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLButtonElement> = inject(ElementRef);
    public ariaLabel = input<string>("");
    public ariaLabelledby = input<string>("");
    public ariaDescribedby = input<string>("");
    public disabled = model<boolean>(false);
    public flat = input(false);
    public primary = input(false);
    public selected = model(false);
    public tabindex = input<number, number | string>(0, {
        transform: (value: number | string) => (typeof value === "string" ? parseInt(value, 10) : value)
    });
    public toggleable = input(false);

    public constructor() {
        effect(() => {
            this.selected();
            untracked(() => {
                if (this.#buttonService) {
                    this.#buttonService.buttonSelected$.next(this);
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
        this.#buttonService?.buttonSelect$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(result => {
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
                if (this.disabled()) {
                    return;
                }
                if (this.#buttonService) {
                    this.#buttonService.buttonClick$.next(this);
                } else {
                    this.selected.set(!this.selected());
                }
            });
    }
}
