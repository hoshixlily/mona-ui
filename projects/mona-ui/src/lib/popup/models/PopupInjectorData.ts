import { PopupReference } from "./PopupReference";
import { PopupCloseEvent } from "./PopupCloseEvent";
import { AnimationMetadata } from "@angular/animations";

export interface PopupInjectorData {
    disableAnimation?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    popupReference: PopupReference;
    preventClose?: (e: PopupCloseEvent) => boolean;
    wrapperClass?: string | string[];
}
