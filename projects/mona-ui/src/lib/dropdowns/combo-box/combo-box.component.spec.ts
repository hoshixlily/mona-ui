import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../buttons/button/button.directive";
import { TextBoxDirective } from "../../inputs/directives/text-box.directive";

import { ComboBoxComponent } from "./combo-box.component";

describe("ComboBoxComponent", () => {
    let component: ComboBoxComponent;
    let fixture: ComponentFixture<ComboBoxComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ComboBoxComponent, ButtonDirective, TextBoxDirective, BrowserAnimationsModule],
            providers: [PopupAnimationService]
        });
        fixture = TestBed.createComponent(ComboBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
