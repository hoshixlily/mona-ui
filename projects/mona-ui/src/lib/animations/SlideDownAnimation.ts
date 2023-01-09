import { animate, state, style, transition, trigger } from "@angular/animations";

export const SlideDown = trigger("slideDown", [
    transition(":enter", [style({ height: 0 }), animate(200, style({ height: "*" }))]),
    transition(":leave", [animate(200, style({ height: 0 }))])
]);

export const SlideDownHidden = trigger("slideDownHidden", [
    state("true", style({ height: "*", display: "block" })),
    state("false", style({ height: 0, display: "none" })),
    transition("* => *", [animate("200ms ease-in-out")])
]);
