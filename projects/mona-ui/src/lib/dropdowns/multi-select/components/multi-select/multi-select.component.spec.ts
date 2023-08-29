import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { PopupListService } from "../../../popup-list/services/popup-list.service";

import { MultiSelectComponent } from "./multi-select.component";

describe("MultiSelectComponent", () => {
    let component: MultiSelectComponent;
    let fixture: ComponentFixture<MultiSelectComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MultiSelectComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService, PopupListService]
        });
        fixture = TestBed.createComponent(MultiSelectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
