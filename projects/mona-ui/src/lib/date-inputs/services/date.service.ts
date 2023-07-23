import { inject, Injectable } from "@angular/core";
import { AnimationService } from "../../animations/animation.service";
import { PopupRef } from "../../popup/models/PopupRef";
import { takeUntil } from "rxjs";

@Injectable()
export class DateService {
    readonly #animationService: AnimationService = inject(AnimationService);
    public animate(element: Element, overlayElement: Element, mode: "show" | "hide"): void {
        switch (mode) {
            case "show":
                this.#animationService.slideDown(element);
                this.#animationService.animate({
                    element: overlayElement,
                    duration: 200,
                    delay: 100,
                    startStyles: { boxShadow: "none" },
                    endStyles: { boxShadow: "var(--mona-popup-shadow)" }
                });
                break;
            case "hide":
                this.#animationService.animate({
                    element: overlayElement,
                    duration: 10,
                    startStyles: { boxShadow: "var(--mona-popup-shadow)" },
                    endStyles: { boxShadow: "none" }
                });
                this.#animationService.slideUp(element);
                break;
        }
    }
    public setupOutsideClickCloseAnimation(popupRef: PopupRef): void {
        popupRef.overlayRef
            .outsidePointerEvents()
            .pipe(takeUntil(popupRef.closed))
            .subscribe(e => {
                if (e.type.includes("click")) {
                    this.animate(
                        popupRef.overlayRef.overlayElement.firstElementChild as Element,
                        popupRef.overlayRef.overlayElement,
                        "hide"
                    );
                    popupRef.closeWithDelay();
                }
            });
    }
}
