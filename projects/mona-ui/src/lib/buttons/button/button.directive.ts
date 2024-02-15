import {
    ChangeDetectorRef,
    DestroyRef,
    Directive,
    ElementRef,
    EventEmitter,
    Host,
    HostBinding,
    inject,
    input,
    Input,
    InputSignal,
    OnInit,
    Optional,
    Output
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, takeWhile } from "rxjs";
import { ButtonService } from "../services/button.service";

@Directive({
    selector: "button[monaButton]",
    host: {
        "[attr.disabled]": "disabled ? '' : undefined",
        "[attr.aria-disabled]": "disabled ? true : undefined",
        "[attr.aria-selected]": "selected ? true : undefined",
        "[class.mona-button]": "true",
        "[class.mona-flat]": "flat()",
        "[class.mona-primary]": "primary()"
    },
    standalone: true
})
export class ButtonDirective implements OnInit {
    #disabled: boolean = false;
    #selected: boolean = false;
    #tabindex: number = 0;
    #toggleable: boolean = false;
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    public set disabled(disabled: boolean) {
        this.#disabled = disabled;
    }

    @Input()
    @HostBinding("class.mona-disabled")
    public get disabled(): boolean {
        return this.#disabled;
    }

    public flat: InputSignal<boolean> = input(false);
    public primary: InputSignal<boolean> = input(false);

    @HostBinding("class.mona-selected")
    @Input()
    public set selected(selected: boolean) {
        if (selected !== this.#selected) {
            this.#selected = selected;
            this.buttonService?.buttonSelected$.next(this);
        }
    }

    public get selected(): boolean {
        return this.#selected;
    }

    @HostBinding("attr.tabindex")
    @Input()
    public set tabindex(tabindex: number | string) {
        this.#tabindex = typeof tabindex === "string" ? parseInt(tabindex, 10) : tabindex;
    }

    public get tabindex(): number {
        return this.disabled ? -1 : this.#tabindex;
    }

    @Output()
    public selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    public set toggleable(toggleable: boolean) {
        this.#toggleable = toggleable;
        if (toggleable) {
            this.setToggleableEvent();
        }
    }

    public get toggleable(): boolean {
        return this.#toggleable;
    }

    public constructor(
        @Host() @Optional() private readonly buttonService: ButtonService,
        public readonly elementRef: ElementRef<HTMLButtonElement>,
        private readonly cdr: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.buttonService?.buttonSelect$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(result => {
            const [button, selected] = result;
            if (button === this) {
                this.cdr.detectChanges();
                this.#selected = selected;
                this.selectedChange.emit(selected);
            }
        });
    }

    private setToggleableEvent(): void {
        fromEvent<MouseEvent>(this.elementRef.nativeElement, "click")
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                takeWhile(() => this.toggleable)
            )
            .subscribe(() => {
                if (this.buttonService) {
                    this.buttonService.buttonClick$.next(this);
                } else {
                    this.selected = !this.selected;
                    this.selectedChange.emit(this.selected);
                }
                this.cdr.detectChanges();
            });
    }
}
