import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../../../../animations/popup-animation.service";

import { AutoCompleteComponent } from "./auto-complete.component";

describe("AutoCompleteComponent", () => {
    let component: AutoCompleteComponent;
    let fixture: ComponentFixture<AutoCompleteComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AutoCompleteComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService]
        });
        fixture = TestBed.createComponent(AutoCompleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
