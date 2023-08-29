import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { NumericTextBoxComponent } from "../../../numeric-text-box/components/numeric-text-box/numeric-text-box.component";
import { NumericTextBoxPrefixTemplateDirective } from "../../../numeric-text-box/directives/numeric-text-box-prefix-template.directive";

import { ColorGradientComponent } from "./color-gradient.component";

describe("ColorGradientComponent", () => {
    let component: ColorGradientComponent;
    let fixture: ComponentFixture<ColorGradientComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ColorGradientComponent,
                ButtonDirective,
                NumericTextBoxComponent,
                NumericTextBoxPrefixTemplateDirective,
                FormsModule
            ]
        });
        fixture = TestBed.createComponent(ColorGradientComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
