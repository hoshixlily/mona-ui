import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    TemplateRef
} from "@angular/core";
import { PopupRef } from "../../models/PopupRef";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { PopupSettings } from "../../models/PopupSettings";
import { PopupOffset } from "../../models/PopupOffset";
import { PopupService } from "../../services/popup.service";
import { Element } from "@angular/compiler";

@Component({
    selector: "mona-popup",
    templateUrl: "./popup.component.html",
    styleUrls: ["./popup.component.scss"]
})
export class PopupComponent implements OnInit, OnDestroy, AfterViewInit {
    private popupOpened: boolean = false;
    private popupRef: PopupRef | null = null;
    private popupTriggerListener: (event: Event) => void = () => void 0;

    @Input()
    public anchor!: FlexibleConnectedPositionStrategyOrigin;

    @Output()
    public close: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    public closeOnEscape: boolean = true;

    @ContentChild(TemplateRef)
    public contentTemplate!: TemplateRef<void>;

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
    public trigger: string = "click";

    @Input()
    public width?: number | string;

    public constructor(
        private readonly popupService: PopupService,
        private readonly renderer: Renderer2,
        private readonly zone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        if (!this.contentTemplate) {
            throw new Error(`${PopupComponent.name} requires contentTemplate`);
        }
        this.create();
    }

    public ngOnDestroy(): void {
        this.popupRef?.close();
    }

    public ngOnInit(): void {
        if (!this.anchor) {
            throw new Error(`${PopupComponent.name} requires anchor`);
        }
    }

    private create(): void {
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
            width: this.width
        };
        this.setEventListeners(popupSettings);
    }

    private setEventListeners(popupSettings: PopupSettings): void {
        let pointAnchor = false;
        let target: FlexibleConnectedPositionStrategyOrigin;
        if (popupSettings.anchor instanceof ElementRef) {
            target = popupSettings.anchor.nativeElement;
        } else if (popupSettings.anchor instanceof HTMLElement) {
            target = popupSettings.anchor;
        } else {
            target = document.body;
            pointAnchor = true;
        }
        this.zone.runOutsideAngular(() => {
            this.popupTriggerListener = this.renderer.listen(target, this.trigger, (event: Event) => {
                event.preventDefault();
                if (this.popupOpened) {
                    this.popupOpened = false;
                    return;
                }
                this.zone.run(() => {
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
            });
        });
    }
}
