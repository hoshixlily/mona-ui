import { animate, animation, style, transition, trigger, useAnimation } from "@angular/animations";

const slideEnterAnimation = animation([
    style({ transform: "translateX(110%)" }),
    animate("300ms ease-out", style({ transform: "translateX(0%)" }))
]);
const slideLeaveAnimation = animation([
    style({ transform: "translateX(0)" }),
    animate("300ms ease-out", style({ transform: "translateX(110%)" }))
]);

export const NotificationSlide = trigger("notificationSlide", [
    transition(":enter", [useAnimation(slideEnterAnimation)]),
    transition(":leave", [useAnimation(slideLeaveAnimation)])
]);

const slideFadeInAnimation = animation([style({ opacity: 0 }), animate("300ms ease-out", style({ opacity: 1 }))]);

const slideFadeOutAnimation = animation([style({ opacity: 1 }), animate("300ms ease-out", style({ opacity: 0 }))]);

export const NotificationFade = trigger("notificationFade", [
    transition(":enter", [useAnimation(slideFadeInAnimation)]),
    transition(":leave", [useAnimation(slideFadeOutAnimation)])
]);
