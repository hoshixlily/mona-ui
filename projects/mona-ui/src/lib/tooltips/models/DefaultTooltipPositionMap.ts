import { ConnectionPositionPair, ConnectedPosition } from "@angular/cdk/overlay";
import { Position } from "../../models/Position";

export const DefaultTooltipPositionMap: Record<Position, Array<ConnectedPosition | ConnectionPositionPair>> = {
    top: [new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "start", overlayY: "bottom" })],
    bottom: [
        new ConnectionPositionPair({ originX: "start", originY: "bottom" }, { overlayX: "start", overlayY: "top" })
    ],
    left: [new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "start", overlayY: "top" })],
    right: [new ConnectionPositionPair({ originX: "end", originY: "top" }, { overlayX: "start", overlayY: "top" })]
};
