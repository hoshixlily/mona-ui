import { animate, style, transition, trigger } from "@angular/animations";

export const FadeAnimation = (duration: number = 2200) =>
    trigger("fadeInOut", [
        transition(":enter", [style({ scale: 0 }), animate(`${duration}ms ease-out`, style({ scale: 1 }))]),
        transition(":leave", [animate(`${duration}ms ease-out`, style({ scale: 0 }))])
    ]);

export const FadeOutAnimation = (duration: number = 2200) =>
    trigger("fadeOut", [transition(":leave", [animate(`${duration}ms ease-out`, style({ scale: 0 }))])]);
