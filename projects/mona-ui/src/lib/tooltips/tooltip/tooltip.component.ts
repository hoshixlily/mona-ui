import { NgClass } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, fromEvent, take, tap } from "rxjs";
import { v4 } from "uuid";
import { AnimationService } from "../../animations/services/animation.service";
import { Position } from "../../models/Position";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupService } from "../../popup/services/popup.service";
import { DefaultTooltipPositionMap } from "../models/DefaultTooltipPositionMap";

@Component({
    selector: "mona-tooltip",
    templateUrl: "./tooltip.component.html",
    styleUrls: ["./tooltip.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass]
})
export class TooltipComponent implements OnInit {
    readonly #animationService: AnimationService = inject(AnimationService);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #popupService: PopupService = inject(PopupService);
    #popupRef?: PopupRef;

    public readonly uid: string = v4();
    public position: InputSignal<Position> = input<Position>("top");
    public target: InputSignal<Element | ElementRef> = input.required<Element | ElementRef>();

    @ViewChild(TemplateRef)
    public templateRef!: TemplateRef<any>;

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private animateEnter(): void {
        if (this.tooltipOverlayElement) {
            this.#animationService.fadeIn(this.tooltipOverlayElement);
        }
    }

    private animateLeave(): void {
        if (this.tooltipOverlayElement) {
            this.#animationService.fadeOut(this.tooltipOverlayElement);
        }
    }

    private calculateTopAndLeft(): void {
        let popupTop = 0;
        let popupLeft = 0;
        const target = this.target();
        const anchorWidth =
            target instanceof Element
                ? (target as HTMLElement).getBoundingClientRect().width
                : (target.nativeElement as HTMLElement).getBoundingClientRect().width;
        const anchorHeight =
            target instanceof Element
                ? (target as HTMLElement).getBoundingClientRect().height
                : (target.nativeElement as HTMLElement).getBoundingClientRect().height;
        const popupWidth = this.tooltipElement?.getBoundingClientRect()?.width ?? 0;
        const popupHeight = this.tooltipElement?.getBoundingClientRect()?.height ?? 0;
        if (!this.tooltipOverlayElement) {
            return;
        }
        switch (this.position()) {
            case "top":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${popupLeft}px, -12px, 0)`;
                break;
            case "bottom":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${popupLeft}px, 12px, 0)`;
                break;
            case "right":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(12px, ${popupTop}px, 0)`;
                break;
            case "left":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${-popupWidth - 12}px, ${popupTop}px, 0)`;
                break;
        }
    }

    private createTooltipPopup(target: Element): void {
        this.#popupRef = this.#popupService.create({
            content: this.templateRef,
            anchor: target,
            disableAnimation: true,
            popupClass: "mona-tooltip-popup-content",
            popupWrapperClass: "mona-tooltip-popup-wrapper",
            hasBackdrop: false,
            positions: DefaultTooltipPositionMap[this.position()],
            closeOnOutsideClick: true,
            withPush: false
        });
        this.#popupRef.overlayRef.addPanelClass("mona-invisible-tooltip");
        window.setTimeout(() => {
            this.calculateTopAndLeft();
            this.#popupRef?.overlayRef.removePanelClass("mona-invisible-tooltip");
            this.animateEnter();
        }, 100);
    }

    private setSubscriptions(): void {
        const target = this.target();
        const tooltipTarget = target instanceof ElementRef ? target.nativeElement : target;
        fromEvent<MouseEvent>(tooltipTarget, "mouseenter")
            .pipe(
                filter(() => !this.#popupRef),
                takeUntilDestroyed(this.#destroyRef),
                tap(() => {
                    fromEvent(tooltipTarget, "mouseleave")
                        .pipe(take(1))
                        .subscribe(() => {
                            this.animateLeave();
                            this.#popupRef?.closeWithDelay(100);
                            this.#popupRef = undefined;
                        });
                })
            )
            .subscribe(() => {
                this.createTooltipPopup(tooltipTarget);
            });
    }

    private get tooltipElement(): HTMLElement | null {
        return document.querySelector(`[data-uid='${this.uid}']`) ?? null;
    }

    private get tooltipOverlayElement(): HTMLElement | null {
        return this.tooltipElement?.parentElement?.parentElement?.parentElement ?? null;
    }
}
