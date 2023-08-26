import { animate, style, transition, trigger } from "@angular/animations";

export const FadeAnimation = (duration: number = 200) =>
    trigger("fadeInOut", [
        transition(":enter", [style({ opacity: 0 }), animate(`${duration}ms ease-out`, style({ opacity: 1 }))]),
        transition(":leave", [animate(`${duration}ms ease-out`, style({ opacity: 0 }))])
    ]);

export const FadeOutAnimation = (duration: number = 200) =>
    trigger("fadeOut", [transition(":leave", [animate(`${duration}ms ease-out`, style({ opacity: 0 }))])]);
