import {
    AfterViewInit,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { PopupRef } from "../../models/PopupRef";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { PopupSettings } from "../../models/PopupSettings";
import { PopupOffset } from "../../models/PopupOffset";
import { PopupService } from "../../services/popup.service";

@Component({
    selector: "mona-popup",
    templateUrl: "./popup.component.html",
    styleUrls: ["./popup.component.scss"],
    standalone: true
})
export class PopupComponent implements OnInit, OnDestroy, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    private popupOpened: boolean = false;
    private popupRef: PopupRef | null = null;

    @Input()
    public anchor!: FlexibleConnectedPositionStrategyOrigin;

    @Output()
    public close: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    public closeOnEscape: boolean = true;

    @ContentChild(TemplateRef)
    public contentTemplate!: TemplateRef<any>;

    @Input()
    public height?: number | string;

    @Input()
    public maxHeight?: number | string;

    @Input()
    public maxWidth?: number | string;

    @Input()
    public minHeight?: number | string;

    @Input()
    public minWidth?: number | string;

    @Input()
    public offset?: PopupOffset;

    @Output()
    public open: EventEmitter<PopupRef> = new EventEmitter<PopupRef>();

    @Input()
    public popupClass: string | string[] = [];

    @Input()
    public popupWrapperClass: string | string[] = [];

    @Input()
    public trigger: string = "click";

    @Input()
    public width?: number | string;

    public constructor(private readonly popupService: PopupService, private readonly zone: NgZone) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.setEventListeners();
        });
    }

    public ngOnDestroy(): void {
        this.popupRef?.close();
    }

    public ngOnInit(): void {
        if (!this.anchor) {
            throw new Error(`${PopupComponent.name} requires anchor`);
        }
    }

    private setEventListeners(): void {
        let pointAnchor = false;
        let target: HTMLElement;
        if (this.anchor instanceof ElementRef) {
            target = this.anchor.nativeElement;
        } else if (this.anchor instanceof HTMLElement) {
            target = this.anchor;
        } else {
            target = document.body;
            pointAnchor = true;
        }
        const width =
            this.width ??
            (this.anchor instanceof HTMLElement
                ? this.anchor.getBoundingClientRect().width
                : this.anchor instanceof ElementRef
                ? this.anchor.nativeElement.getBoundingClientRect().width
                : undefined);
        fromEvent<MouseEvent>(target, this.trigger)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                event.preventDefault();
                if (this.popupOpened) {
                    this.popupOpened = false;
                    return;
                }
                const popupSettings: PopupSettings = {
                    anchor: this.anchor,
                    closeOnEscape: this.closeOnEscape,
                    content: this.contentTemplate,
                    hasBackdrop: false,
                    height: this.height,
                    maxHeight: this.maxHeight,
                    maxWidth: this.maxWidth,
                    minHeight: this.minHeight,
                    minWidth: this.minWidth,
                    offset: this.offset,
                    popupClass: this.popupClass,
                    popupWrapperClass: this.popupWrapperClass,
                    width
                };
                this.popupRef = this.popupService.create(popupSettings);
                const subscription = this.popupRef.closed.subscribe(result => {
                    this.popupRef = null;
                    this.close.emit();
                    subscription.unsubscribe();
                    if (result instanceof PointerEvent && result.type === this.trigger) {
                        this.popupOpened =
                            target instanceof HTMLElement && target.contains(result.target as HTMLElement);
                    } else if (result instanceof PointerEvent && pointAnchor && result.type !== this.trigger) {
                        this.popupOpened = false;
                    }
                });
                if (pointAnchor) {
                    this.popupOpened = true;
                }
                this.open.emit(this.popupRef);
            });
    }
}
