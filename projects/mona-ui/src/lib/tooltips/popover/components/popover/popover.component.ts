import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { Position } from "../../../../models/Position";
import { AnimationService } from "../../../../animations/services/animation.service";
import { PopupService } from "../../../../popup/services/popup.service";
import { asapScheduler, filter, fromEvent, take, takeUntil } from "rxjs";
import { DefaultTooltipPositionMap } from "../../../models/DefaultTooltipPositionMap";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { v4 } from "uuid";
import { PopoverTrigger } from "../../models/PopoverTrigger";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopoverFooterTemplateDirective } from "../../directives/popover-footer-template.directive";
import { PopoverTitleTemplateDirective } from "../../directives/popover-title-template.directive";
import { PopoverShowEvent } from "../../models/PopoverShowEvent";
import { PopoverShownEvent } from "../../models/PopoverShownEvent";
import { PopoverHideEvent } from "../../models/PopoverHideEvent";
import { NgIf, NgTemplateOutlet, NgClass } from "@angular/common";

@Component({
    selector: "mona-popover",
    templateUrl: "./popover.component.html",
    styleUrls: ["./popover.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: "monaPopover",
    standalone: true,
    imports: [NgIf, NgTemplateOutlet, NgClass]
})
export class PopoverComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #popupRef?: PopupRef;
    #trigger: string = "click";
    public readonly uid: string = v4();

    @ContentChild(PopoverFooterTemplateDirective, { read: TemplateRef })
    public footerTemplateRef: TemplateRef<any> | null = null;

    @Output()
    public hide: EventEmitter<PopoverHideEvent> = new EventEmitter<PopoverHideEvent>();

    @Output()
    public hidden: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    public position: Position = "top";

    @Output()
    public show: EventEmitter<PopoverShowEvent> = new EventEmitter<PopoverShowEvent>();

    @Output()
    public shown: EventEmitter<PopoverShownEvent> = new EventEmitter<PopoverShownEvent>();

    @Input()
    public target!: Element | ElementRef;

    @ViewChild(TemplateRef)
    public templateRef!: TemplateRef<any>;

    @Input()
    public title?: string;

    @ContentChild(PopoverTitleTemplateDirective, { read: TemplateRef })
    public titleTemplateRef: TemplateRef<any> | null = null;

    @Input()
    public set trigger(value: PopoverTrigger) {
        switch (value) {
            case "click":
                this.#trigger = "click";
                break;
            case "hover":
                this.#trigger = "mouseenter";
                break;
            case "none":
                this.#trigger = "";
                break;
        }
    }

    public constructor(
        private readonly animationService: AnimationService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public close(): void {
        if (this.#popupRef) {
            this.popupAnimationService.animatePopover(this.#popupRef, AnimationState.Hide);
            this.#popupRef.closeWithDelay();
            this.#popupRef = undefined;
        }
    }

    public ngOnInit(): void {
        if (!this.target) {
            throw new Error("Tooltip target is required.");
        }
        this.setSubscriptions();
    }

    public open(): void {
        if (this.#popupRef) {
            return;
        }
        this.openPopup();
    }

    public toggle(): void {
        if (this.#popupRef) {
            this.close();
        } else {
            this.open();
        }
    }

    private calculateTopAndLeft(): void {
        let popupTop = 0;
        let popupLeft = 0;
        const anchorWidth =
            this.target instanceof Element
                ? (this.target as HTMLElement).getBoundingClientRect().width
                : (this.target.nativeElement as HTMLElement).getBoundingClientRect().width;
        const anchorHeight =
            this.target instanceof Element
                ? (this.target as HTMLElement).getBoundingClientRect().height
                : (this.target.nativeElement as HTMLElement).getBoundingClientRect().height;
        const popupWidth = this.popoverElement?.getBoundingClientRect()?.width ?? 0;
        const popupHeight = this.popoverElement?.getBoundingClientRect()?.height ?? 0;
        if (!this.popoverOverlayElement) {
            console.warn("Popover overlay element is not found.");
            return;
        }
        switch (this.position) {
            case "top":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.popoverOverlayElement.style.transform = `translate3d(${popupLeft}px, -12px, 0)`;
                break;
            case "bottom":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.popoverOverlayElement.style.transform = `translate3d(${popupLeft}px, 12px, 0)`;
                break;
            case "right":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.popoverOverlayElement.style.transform = `translate3d(12px, ${popupTop}px, 0)`;
                break;
            case "left":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.popoverOverlayElement.style.transform = `translate3d(${-popupWidth - 12}px, ${popupTop}px, 0)`;
                break;
        }
    }

    private closePopup(): void {
        if (!this.#popupRef) {
            return;
        }
        const hideEvent = new PopoverHideEvent(this.popoverTargetElement, this.#popupRef);
        this.hide.emit(hideEvent);
        if (hideEvent.isDefaultPrevented()) {
            return;
        }
        this.close();
    }

    private openPopup(reposition: boolean = false): void {
        this.#popupRef = this.popupService.create({
            content: this.templateRef,
            anchor: this.popoverTargetElement,
            disableAnimation: true,
            popupClass: "mona-popover-popup-content",
            popupWrapperClass: "mona-popover-popup-wrapper",
            hasBackdrop: false,
            positions: DefaultTooltipPositionMap[this.position],
            closeOnOutsideClick: false,
            closeOnEscape: false,
            withPush: true
        });
        this.#popupRef.overlayRef.addPanelClass("mona-invisible-tooltip");

        asapScheduler.schedule(() => {
            this.setupPopoverOutsideClickCloseAnimation(this.#popupRef!, this.target);
            this.calculateTopAndLeft();
            const shouldReposition = this.checkRepositionNecessity(this.position);
            if (!reposition && shouldReposition) {
                this.#popupRef?.close();
                this.switchPositionToOpposite();
                this.openPopup(true);
                return;
            }
            if (this.#trigger) {
                const showEvent = new PopoverShowEvent(this.popoverTargetElement);
                this.show.emit(showEvent);
                if (showEvent.isDefaultPrevented()) {
                    this.#popupRef?.close();
                    return;
                }
            }
            this.popupAnimationService.animatePopover(this.#popupRef!, AnimationState.Show);
            this.#popupRef?.overlayRef.removePanelClass("mona-invisible-tooltip");
            this.shown.emit(new PopoverShownEvent(this.popoverTargetElement, this.#popupRef!));
        }, 1); // Zero doesn't work here

        if (this.#popupRef) {
            fromEvent<KeyboardEvent>(document, "keydown")
                .pipe(
                    filter(event => event.key === "Escape"),
                    takeUntil(this.#popupRef.closed)
                )
                .subscribe(() => {
                    this.closePopup();
                });
        }

        this.#popupRef?.closed.pipe(take(1)).subscribe(() => {
            this.#popupRef = undefined;
            this.hidden.emit();
        });
    }

    /**
     * Reposition popover to opposite side if it goes out of viewport.
     * @param position
     * @private
     */
    private checkRepositionNecessity(position: Position): boolean {
        if (!this.popoverElement) {
            return false;
        }
        const popoverRect = this.popoverElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        switch (position) {
            case "top":
                return popoverRect.top < 0;
            case "bottom":
                return popoverRect.bottom > viewportHeight;
            case "right":
                return popoverRect.right > viewportWidth;
            case "left":
                return popoverRect.left < 0;
            default:
                return false;
        }
    }

    private setSubscriptions(): void {
        if (this.#trigger) {
            fromEvent<MouseEvent>(this.popoverTargetElement, this.#trigger)
                .pipe(
                    filter(() => !this.#popupRef),
                    takeUntilDestroyed(this.#destroyRef)
                )
                .subscribe(() => {
                    this.openPopup();
                });
        }
    }

    private setupPopoverOutsideClickCloseAnimation(popupRef: PopupRef, target: Element | ElementRef): void {
        popupRef.overlayRef
            .outsidePointerEvents()
            .pipe(
                filter(e => {
                    const targetElement = target instanceof ElementRef ? target.nativeElement : target;
                    return !targetElement.contains(e.target as Element);
                }),
                takeUntil(popupRef.closed)
            )
            .subscribe(e => {
                if (e.type.includes("click")) {
                    this.closePopup();
                }
            });
    }

    private switchPositionToOpposite(): void {
        switch (this.position) {
            case "top":
                this.position = "bottom";
                break;
            case "bottom":
                this.position = "top";
                break;
            case "right":
                this.position = "left";
                break;
            case "left":
                this.position = "right";
                break;
        }
    }

    private get popoverElement(): HTMLElement | null {
        return document.querySelector(`[data-uid='${this.uid}']`) ?? null;
    }

    private get popoverOverlayElement(): HTMLElement | null {
        return this.popoverElement?.parentElement?.parentElement?.parentElement ?? null;
    }

    private get popoverTargetElement(): HTMLElement {
        return this.target instanceof ElementRef ? this.target.nativeElement : this.target;
    }
}
