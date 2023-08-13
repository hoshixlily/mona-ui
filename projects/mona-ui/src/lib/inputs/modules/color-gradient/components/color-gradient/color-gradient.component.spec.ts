import { FormsModule } from "@angular/forms";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ButtonModule } from "../../../../../buttons/modules/button/button.module";
import { ContextMenuModule } from "../../../../../menus/modules/context-menu/context-menu.module";
import { NumericTextBoxModule } from "../../../numeric-text-box/numeric-text-box.module";
import { TextBoxModule } from "../../../text-box/text-box.module";
import { AlphaSliderComponent } from "../alpha-slider/alpha-slider.component";
import { HueSliderComponent } from "../hue-slider/hue-slider.component";

import { ColorGradientComponent } from "./color-gradient.component";

describe("ColorGradientComponent", () => {
    let spectator: Spectator<ColorGradientComponent>;
    const createComponent = createComponentFactory({
        component: ColorGradientComponent,
        imports: [
            FormsModule,
            NumericTextBoxModule,
            TextBoxModule,
            ContextMenuModule,
            FontAwesomeTestingModule,
            ButtonModule,
            NumericTextBoxModule
        ],
        declarations: [AlphaSliderComponent, HueSliderComponent]
    });

    beforeEach(() => {
        spectator = createComponent();
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
