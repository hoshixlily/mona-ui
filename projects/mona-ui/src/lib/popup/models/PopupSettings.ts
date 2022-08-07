import { TemplateRef } from "@angular/core";
import {
    ComponentType,
    ConnectedPosition,
    ConnectionPositionPair,
    FlexibleConnectedPositionStrategyOrigin
} from "@angular/cdk/overlay";
import { PopupOffset } from "./PopupOffset";

export interface PopupSettings<T = unknown, C = void> {
    anchor: FlexibleConnectedPositionStrategyOrigin;
    content: TemplateRef<C> | ComponentType<C>;
    hasBackdrop?: boolean;
    offset?: PopupOffset;
    popupClass?: string | string[];
    positions?: Array<ConnectedPosition | ConnectionPositionPair>;
    withPush?: boolean;
}
