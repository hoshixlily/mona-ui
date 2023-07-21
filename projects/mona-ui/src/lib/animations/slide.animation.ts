import { animate, animation, state, style, transition, trigger, useAnimation } from "@angular/animations";

const slideDownAnimation = animation([style({ height: 0 }), animate("0.3s ease-out", style({ height: "*" }))]);
const slideUpAnimation = animation([style({ height: "*" }), animate("0.3s ease-out", style({ height: 0 }))]);
export const SlideVertical = trigger("slideVertical", [
    transition(":enter", useAnimation(slideDownAnimation)),
    transition(":leave", useAnimation(slideUpAnimation))
]);
