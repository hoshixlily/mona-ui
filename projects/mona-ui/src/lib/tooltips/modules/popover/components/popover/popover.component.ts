import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    inject,
    Input,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { Position } from "../../../../../models/Position";
import { AnimationService } from "../../../../../animations/animation.service";
import { PopupService } from "../../../../../popup/services/popup.service";
import { asapScheduler, filter, fromEvent, take } from "rxjs";
import { DefaultTooltipPositionMap } from "../../../../models/DefaultTooltipPositionMap";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { v4 } from "uuid";
import { PopoverTrigger } from "../../models/PopoverTrigger";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";
import { AnimationState } from "../../../../../animations/AnimationState";
import { PopoverFooterTemplateDirective } from "../../directives/popover-footer-template.directive";

@Component({
    selector: "mona-popover",
    templateUrl: "./popover.component.html",
    styleUrls: ["./popover.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: "monaPopover"
})
export class PopoverComponent implements OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #popupRef?: PopupRef;
    #trigger: string = "click";
    public readonly uid: string = v4();

    @ContentChild(PopoverFooterTemplateDirective, { read: TemplateRef })
    public footerTemplateRef: TemplateRef<any> | null = null;

    @Input()
    public position: Position = "top";

    @Input()
    public target!: Element | ElementRef;

    @ViewChild(TemplateRef)
    public templateRef!: TemplateRef<any>;

    @Input()
    public title?: string;

    @Input()
    public set trigger(value: PopoverTrigger) {
        switch (value) {
            case "click":
                this.#trigger = "click";
                break;
            case "hover":
                this.#trigger = "mouseenter";
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
            // this.popupAnimationService.animatePopover(this.#popupRef, AnimationState.Hide);
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

    private setSubscriptions(): void {
        const target = this.target instanceof ElementRef ? this.target.nativeElement : this.target;
        fromEvent<MouseEvent>(target, this.#trigger)
            .pipe(
                filter(() => !this.#popupRef),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe(() => {
                this.#popupRef = this.popupService.create({
                    content: this.templateRef,
                    anchor: target,
                    disableAnimation: true,
                    popupClass: "mona-popover-popup-content",
                    popupWrapperClass: "mona-popover-popup-wrapper",
                    hasBackdrop: false,
                    positions: DefaultTooltipPositionMap[this.position],
                    closeOnOutsideClick: false,
                    withPush: false
                });
                this.#popupRef.overlayRef.addPanelClass("mona-invisible-tooltip");
                asapScheduler.schedule(() => {
                    this.popupAnimationService.setupPopoverOutsideClickCloseAnimation(this.#popupRef!, this.target);
                    this.calculateTopAndLeft();
                    this.popupAnimationService.animatePopover(this.#popupRef!, AnimationState.Show);
                    this.#popupRef?.overlayRef.removePanelClass("mona-invisible-tooltip");
                }, 1);

                this.#popupRef?.closed.pipe(take(1)).subscribe(() => {
                    this.#popupRef = undefined;
                });
            });
    }

    private get popoverElement(): HTMLElement | null {
        return document.querySelector(`[data-uid='${this.uid}']`) ?? null;
    }

    private get popoverOverlayElement(): HTMLElement | null {
        return this.popoverElement?.parentElement?.parentElement?.parentElement ?? null;
    }
}
