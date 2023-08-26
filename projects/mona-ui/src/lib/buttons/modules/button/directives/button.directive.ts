import {
    ChangeDetectorRef,
    DestroyRef,
    Directive,
    ElementRef,
    EventEmitter,
    Host,
    HostBinding,
    inject,
    Input,
    OnInit,
    Optional,
    Output
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, takeWhile } from "rxjs";
import { ButtonService } from "../../../services/button.service";

@Directive({
    selector: "[monaButton]",
    host: {
        "[attr.disabled]": "disabled ? '' : undefined"
    },
    standalone: true
})
export class ButtonDirective implements OnInit {
    _disabled: boolean = false;
    #selected: boolean = false;
    #tabindex: number = 0;
    #toggleable: boolean = false;
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    public set disabled(disabled: boolean) {
        this._disabled = disabled;
    }

    @Input()
    @HostBinding("class.mona-disabled")
    public get disabled(): boolean {
        return this._disabled;
    }

    @HostBinding("class.mona-flat")
    @Input()
    public flat: boolean = false;

    @HostBinding("class.mona-primary")
    @Input()
    public primary: boolean = false;

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
