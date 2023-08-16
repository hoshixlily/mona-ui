import { ChangeDetectorRef, ElementRef, NgZone } from "@angular/core";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { Column } from "../models/Column";
import { GridColumnResizeHandlerDirective } from "./grid-column-resize-handler.directive";

describe("GridColumnResizeHandlerDirective", () => {
    let spectator: SpectatorDirective<GridColumnResizeHandlerDirective>;
    const createDirective = createDirectiveFactory({
        directive: GridColumnResizeHandlerDirective,
        providers: []
    });
    let column: Column = new Column();
    column.width = 100;

    beforeEach(() => {
        spectator = createDirective(`<div monaGridColumnResizeHandler></div>`, {
            props: {
                column
            }
        });
    });

    it("should create", () => {
        expect(spectator.directive).toBeDefined();
    });
});
