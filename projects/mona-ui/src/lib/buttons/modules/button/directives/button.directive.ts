import {
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    Renderer2
} from "@angular/core";

@Directive({
    selector: "[monaButton]"
})
export class ButtonDirective implements OnInit, OnDestroy {
    private clickListener: () => void = () => void 0;

    @HostBinding("class.disabled")
    @Input()
    public disabled: boolean = false;

    @HostBinding("class.primary")
    @Input()
    public primary: boolean = false;

    @HostBinding("class.selected")
    @Input()
    public selected: boolean = false;

    @Output()
    public selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    public toggleable: boolean = false;

    public constructor(
        private readonly elementRef: ElementRef<HTMLButtonElement>,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone
    ) {}

    public ngOnDestroy(): void {
        this.clickListener();
    }

    public ngOnInit(): void {
        this.zone.runOutsideAngular(() => {
            this.clickListener = this.renderer.listen(this.elementRef.nativeElement, "click", () => {
                if (this.toggleable) {
                    const oldSelected = this.selected;
                    this.selected = !this.selected;
                    if (oldSelected !== this.selected) {
                        this.zone.run(() => {
                            this.selectedChange.emit(this.selected);
                        });
                    }
                }
            });
        });
    }
}
