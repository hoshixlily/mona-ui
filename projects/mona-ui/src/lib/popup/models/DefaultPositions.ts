import { ConnectionPositionPair } from "@angular/cdk/overlay";

export const DefaultPositions: ConnectionPositionPair[] = [
    new ConnectionPositionPair({ originX: "start", originY: "bottom" }, { overlayX: "start", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "start", overlayY: "bottom" }),
    new ConnectionPositionPair({ originX: "end", originY: "top" }, { overlayX: "end", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "end", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "end", originY: "top" }, { overlayX: "start", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "end", originY: "center" }, { overlayX: "start", overlayY: "center" }),
    new ConnectionPositionPair({ originX: "start", originY: "center" }, { overlayX: "end", overlayY: "center" })
];
