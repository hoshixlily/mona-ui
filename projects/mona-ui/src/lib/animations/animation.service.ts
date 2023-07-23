import { Injectable } from "@angular/core";
import { animate, AnimationBuilder, style } from "@angular/animations";
import { AnimationOptions } from "./AnimationOptions";

@Injectable({
    providedIn: "root"
})
export class AnimationService {
    public constructor(private readonly animationBuilder: AnimationBuilder) {}

    public animate(options: AnimationOptions): void {
        const { duration, delay, element, endStyles, startStyles, timingFunction } = options;
        const durationValue = duration ? `${duration}ms` : "0ms";
        const delayValue = delay ? `${delay}ms` : "0ms";
        const timingFunctionValue = timingFunction || "ease-out";
        const animation = this.animationBuilder.build([
            style(startStyles),
            animate(`${durationValue} ${delayValue} ${timingFunctionValue}`, style(endStyles))
        ]);
        animation.create(element).play();
    }

    public collapseHorizontal(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { width: 0, opacity: 0 },
            startStyles: { width: "*", opacity: 1 },
            timingFunction: "ease-out"
        });
    }

    public expandHorizontal(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { width: "*", opacity: 1 },
            startStyles: { width: 0, opacity: 0 },
            timingFunction: "ease-out"
        });
    }

    public collapseVertical(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { height: 0, opacity: 0 },
            startStyles: { height: "*", opacity: 1 },
            timingFunction: "ease-out"
        });
    }

    public expandVertical(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { height: "*", opacity: 1 },
            startStyles: { height: 0, opacity: 0 },
            timingFunction: "ease-out"
        });
    }

    public fadeIn(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { opacity: 1 },
            startStyles: { opacity: 0 },
            timingFunction: "ease-out"
        });
    }

    public fadeOut(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { opacity: 0 },
            startStyles: { opacity: 1 },
            timingFunction: "ease-out"
        });
    }

    public scaleIn(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { transform: "scale(1)", opacity: 1 },
            startStyles: { transform: "scale(0)", opacity: 0 },
            timingFunction: "ease-out"
        });
    }

    public scaleOut(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { transform: "scale(0)", opacity: 0 },
            startStyles: { transform: "scale(1)", opacity: 1 },
            timingFunction: "ease-out"
        });
    }

    public slideDown(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { transform: "translateY(0)", opacity: 1 },
            startStyles: { transform: "translateY(-100%)", opacity: 1 },
            timingFunction: "ease-out"
        });
    }

    public slideUp(element: HTMLElement, duration: number = 200): void {
        this.animate({
            duration,
            element,
            endStyles: { transform: "translateY(-100%)", opacity: 1 },
            startStyles: { transform: "translateY(0)", opacity: 1 },
            timingFunction: "ease-out"
        });
    }
}
