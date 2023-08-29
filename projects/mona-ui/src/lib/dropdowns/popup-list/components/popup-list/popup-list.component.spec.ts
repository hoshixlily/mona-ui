import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PopupListService } from "../../services/popup-list.service";

import { PopupListComponent } from "./popup-list.component";

describe("PopupListComponent", () => {
    let component: PopupListComponent;
    let fixture: ComponentFixture<PopupListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PopupListComponent],
            providers: [PopupListService]
        });
        fixture = TestBed.createComponent(PopupListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
