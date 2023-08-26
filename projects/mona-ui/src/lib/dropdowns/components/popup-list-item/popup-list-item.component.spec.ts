import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupListItemComponent } from "./popup-list-item.component";

describe("PopupListItemComponent", () => {
    let component: PopupListItemComponent;
    let fixture: ComponentFixture<PopupListItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopupListItemComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PopupListItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
