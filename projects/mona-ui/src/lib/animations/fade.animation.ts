import { animate, style, transition, trigger } from "@angular/animations";

export const FadeAnimation = (duration: number = 200) =>
    trigger("fadeInOut", [
        transition(":enter", [style({ opacity: 0 }), animate(duration, style({ opacity: 1 }))]),
        transition(":leave", [animate(duration, style({ opacity: 0 }))])
    ]);
