import { animate, state, style, transition, trigger } from "@angular/animations";

export const NotificationSlide = trigger("notificationSlide", [
    transition(":enter", [
        style({
            transform: "translateX(110%)"
        }),
        animate(
            200,
            style({
                transform: "translateX(0%)"
            })
        )
    ]),
    transition(":leave", [
        style({
            transform: "translateX(0)"
        }),
        animate(
            200,
            style({
                transform: "translateX(110%)"
            })
        )
    ])
]);

export const NotificationFade = trigger("notificationFade", [
    transition(":enter", [style({ opacity: 0 }), animate(200, style({ opacity: 1 }))]),
    transition(":leave", [animate(200, style({ opacity: 0 }))])
]);
