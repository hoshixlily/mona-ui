import { PopupReference } from "./PopupReference";
import { PopupCloseEvent } from "./PopupCloseEvent";

export interface PopupInjectorData {
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    popupReference: PopupReference;
    preventClose?: (e: PopupCloseEvent) => boolean;
    wrapperClass?: string | string[];
}
