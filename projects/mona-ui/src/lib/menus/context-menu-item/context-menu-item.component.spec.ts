import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MenuItem } from "../models/MenuItem";
import { ContextMenuService } from "../services/context-menu.service";

import { ContextMenuItemComponent } from "./context-menu-item.component";

describe("ContextMenuItemComponent", () => {
    let component: ContextMenuItemComponent;
    let fixture: ComponentFixture<ContextMenuItemComponent>;
    let menuItem: MenuItem;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContextMenuItemComponent],
            providers: [ContextMenuService]
        });
        fixture = TestBed.createComponent(ContextMenuItemComponent);
        component = fixture.componentInstance;
        menuItem = {
            parent: null
        };
        component.menuItem = menuItem;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
