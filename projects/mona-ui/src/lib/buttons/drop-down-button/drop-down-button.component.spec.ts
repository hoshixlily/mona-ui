import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContextMenuComponent } from "../../menus/context-menu/context-menu.component";

import { DropDownButtonComponent } from "./drop-down-button.component";

describe("DropDownButtonComponent", () => {
    let component: DropDownButtonComponent;
    let fixture: ComponentFixture<DropDownButtonComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DropDownButtonComponent, ContextMenuComponent]
        });
        fixture = TestBed.createComponent(DropDownButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
