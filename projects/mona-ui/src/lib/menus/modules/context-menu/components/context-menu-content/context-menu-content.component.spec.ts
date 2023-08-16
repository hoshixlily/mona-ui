import { EventEmitter } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { AnimationService } from "../../../../../animations/animation.service";
import { PopupDataInjectionToken } from "../../../../../popup/models/PopupInjectionToken";
import { ContextMenuInjectorData } from "../../models/ContextMenuInjectorData";
import { ContextMenuNavigationEvent } from "../../models/ContextMenuNavigationEvent";

import { ContextMenuContentComponent } from "./context-menu-content.component";

const POPUP_TOKEN = [
    {
        provide: PopupDataInjectionToken,
        useValue: {
            menuItems: [],
            navigate: new EventEmitter<ContextMenuNavigationEvent>()
        } as ContextMenuInjectorData
    }
];

describe("ContextMenuContentComponent", () => {
    let spectator: Spectator<ContextMenuContentComponent>;
    const createComponent = createComponentFactory({
        component: ContextMenuContentComponent,
        imports: [BrowserAnimationsModule],
        providers: [AnimationService, POPUP_TOKEN]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
