import { PopupCloseEvent } from "./PopupCloseEvent";
import { PopupReference } from "./PopupReference";

export interface PopupInjectorData {
    disableAnimation?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    popupReference: PopupReference;
    preventClose?: (e: PopupCloseEvent) => boolean;
    wrapperClass?: string | string[];
}
