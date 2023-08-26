import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PopupAnimationService } from "../../animations/services/popup-animation.service";

import { DropDownListComponent } from "./drop-down-list.component";

describe("DropDownListComponent", () => {
    let component: DropDownListComponent;
    let fixture: ComponentFixture<DropDownListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DropDownListComponent, BrowserAnimationsModule],
            providers: [PopupAnimationService]
        });
        fixture = TestBed.createComponent(DropDownListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
