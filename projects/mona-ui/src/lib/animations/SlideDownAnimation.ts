import { animate, state, style, transition, trigger } from "@angular/animations";

export const SlideDown = trigger("slideDown", [
    transition(":enter", [style({ height: 0, overflow: "hidden" }), animate(100, style({ height: "*" }))]),
    transition(":leave", [animate(100, style({ height: 0 }))])
]);

export const SlideDownHidden = trigger("slideDownHidden", [
    state("true", style({ height: "*", display: "block" })),
    state("false", style({ height: 0, display: "none" })),
    transition("* => *", [animate("200ms ease-in-out")])
]);

export const SlideInOut = trigger("slideInOut", [
    state(
        "true",
        style({
            height: "0",
            opacity: "0",
            overflow: "hidden"
        })
    ),
    state(
        "false",
        style({
            height: "*",
            opacity: "1",
            overflow: "visible"
        })
    ),
    transition("true => false", animate("300ms linear")),
    transition("false => true", [style({ overflow: "hidden" }), animate("300ms linear")])
]);

export const SlideIn = trigger("slideIn", [
    state("void", style({ transform: "translate3d(0, 25%, 0) scale(0.9)", opacity: 0 })),
    state("enter", style({ transform: "none", opacity: 1 })),
    state("leave", style({ transform: "translate3d(0, 25%, 0)", opacity: 0 })),
    transition("* => *", animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)"))
]);
