import { animate, animation, style } from "@angular/animations";

export const fadeIn = animation([style({ opacity: 0 }), animate("50ms ease-in", style({ opacity: 1 }))]);

export const fadeOut = animation([animate("150ms ease-out", style({ opacity: 0 }))]);
