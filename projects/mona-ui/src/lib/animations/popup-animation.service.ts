import { Injectable } from "@angular/core";
import { AnimationService } from "./animation.service";
import { PopupRef } from "../popup/models/PopupRef";
import { takeUntil } from "rxjs";
import { AnimationState } from "./AnimationState";

/**
 * Service for animating popups of various components.
 * Do not expose this service to the public. It is only used internally.
 * @internal
 */
@Injectable({
    providedIn: "root"
})
export class PopupAnimationService {
    public constructor(private readonly animationService: AnimationService) {}

    public animateDropdown(popupRef: PopupRef, state: AnimationState): void {
        switch (state) {
            case AnimationState.Show:
                this.animationService.slideDown(popupRef.overlayRef.overlayElement.firstElementChild as Element);
                this.animateBoxShadow(popupRef, state);
                break;
            case AnimationState.Hide:
                this.animateBoxShadow(popupRef, state);
                this.animationService.slideUp(popupRef.overlayRef.overlayElement.firstElementChild as Element);
        }
    }

    public setupDropdownOutsideClickCloseAnimation(popupRef: PopupRef): void {
        popupRef.overlayRef
            .outsidePointerEvents()
            .pipe(takeUntil(popupRef.closed))
            .subscribe(e => {
                if (e.type.includes("click")) {
                    this.animateBoxShadow(popupRef, AnimationState.Hide);
                    this.animationService.slideUp(popupRef.overlayRef.overlayElement.firstElementChild as Element);
                    popupRef.closeWithDelay();
                }
            });
    }

    private animateBoxShadow(popupRef: PopupRef, state: AnimationState): void {
        switch (state) {
            case AnimationState.Show:
                this.animationService.animate({
                    element: popupRef.overlayRef.overlayElement,
                    duration: 200,
                    delay: 150,
                    startStyles: { boxShadow: "none" },
                    endStyles: { boxShadow: "var(--mona-popup-shadow)" }
                });
                break;
            case AnimationState.Hide:
                this.animationService.animate({
                    element: popupRef.overlayRef.overlayElement,
                    duration: 10,
                    startStyles: { boxShadow: "var(--mona-popup-shadow)" },
                    endStyles: { boxShadow: "none" }
                });
                break;
        }
    }
}
