import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { AnimationService } from "../../../animations/animation.service";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { ButtonDirective } from "../../../buttons/modules/button/directives/button.directive";
import { PopupDataInjectionToken } from "../../../popup/models/PopupInjectionToken";
import { WindowDragHandlerDirective } from "../../directives/window-drag-handler.directive";
import { WindowResizeHandlerDirective } from "../../directives/window-resize-handler.directive";
import { WindowTitleTemplateDirective } from "../../directives/window-title-template.directive";
import { WindowInjectorData } from "../../models/WindowInjectorData";

import { WindowContentComponent } from "./window-content.component";

@Component({
    template: ` <div>Test</div> `
})
class WindowContentComponentTestComponent {}

const POPUP_TOKEN = [
    {
        provide: PopupDataInjectionToken,
        useValue: {
            content: WindowContentComponentTestComponent
        } as WindowInjectorData
    }
];

describe("WindowContentComponent", () => {
    let spectator: Spectator<WindowContentComponent>;
    const createComponent = createComponentFactory({
        component: WindowContentComponent,
        imports: [
            CommonModule,
            BrowserModule,
            FormsModule,
            BrowserAnimationsModule,
            ButtonModule,
            FontAwesomeTestingModule
        ],
        providers: [AnimationService, POPUP_TOKEN],
        declarations: [
            WindowResizeHandlerDirective,
            WindowDragHandlerDirective,
            WindowTitleTemplateDirective,
            ButtonDirective,
            FaIconComponent
        ]
    });

    beforeEach(() => {
        spectator = createComponent({});
        spectator.detectChanges();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
