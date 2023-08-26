import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";
import { TextBoxComponent } from "../../inputs/text-box/text-box.component";

import { DateTimePickerComponent } from "./date-time-picker.component";

describe("DateTimePickerComponent", () => {
    let component: DateTimePickerComponent;
    let fixture: ComponentFixture<DateTimePickerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DateTimePickerComponent, TextBoxComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService]
        });
        fixture = TestBed.createComponent(DateTimePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
