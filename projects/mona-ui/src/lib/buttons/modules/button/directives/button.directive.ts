import {
    Directive,
    ElementRef,
    EventEmitter,
    Host,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SkipSelf
} from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import { ButtonService } from "../../../services/button.service";

@Directive({
    selector: "[monaButton]"
    // providers: [ButtonService]
})
export class ButtonDirective implements OnInit, OnDestroy {
    private readonly destroy$: Subject<void> = new Subject<void>();
    private buttonSelected: boolean = false;

    @HostBinding("class.mona-disabled")
    @Input()
    public disabled: boolean = false;

    @HostBinding("class.mona-flat")
    @Input()
    public flat: boolean = false;

    @HostBinding("class.mona-primary")
    @Input()
    public primary: boolean = false;

    @HostBinding("class.mona-selected")
    @Input()
    public set selected(selected: boolean) {
        this.buttonSelected = selected;
        this.buttonService?.buttonSelected$.next(this);
    }

    public get selected(): boolean {
        return this.buttonSelected;
    }

    @Output()
    public selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    public toggleable: boolean = false;

    public constructor(
        @Host() @Optional() private readonly buttonService: ButtonService,
        public readonly elementRef: ElementRef<HTMLButtonElement>
    ) {}

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public ngOnInit(): void {
        if (this.toggleable) {
            fromEvent<MouseEvent>(this.elementRef.nativeElement, "click")
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    if (this.buttonService) {
                        this.buttonService.buttonClick$.next(this);
                    } else {
                        this.selected = !this.selected;
                        this.selectedChange.emit(this.selected);
                    }
                });
        }
        this.buttonService?.buttonSelect$.pipe(takeUntil(this.destroy$)).subscribe(result => {
            const [button, selected] = result;
            if (button === this) {
                this.buttonSelected = selected;
                this.selectedChange.emit(this.buttonSelected);
            }
        });
    }
}
