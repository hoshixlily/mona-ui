import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PagerComponent } from "../../../pager/components/pager/pager.component";

import { ListViewComponent } from "./list-view.component";

describe("ListViewComponent", () => {
    let component: ListViewComponent;
    let fixture: ComponentFixture<ListViewComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ListViewComponent, PagerComponent]
        });
        fixture = TestBed.createComponent(ListViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
