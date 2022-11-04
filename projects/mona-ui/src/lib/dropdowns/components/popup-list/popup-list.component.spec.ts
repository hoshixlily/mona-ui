import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PopupListComponent } from "./popup-list.component";

describe("ListComponent", () => {
    let component: PopupListComponent;
    let fixture: ComponentFixture<PopupListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopupListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PopupListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
