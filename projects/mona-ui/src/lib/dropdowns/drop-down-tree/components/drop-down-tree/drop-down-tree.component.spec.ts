import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TreeViewComponent } from "../../../../tree-view/components/tree-view/tree-view.component";

import { DropDownTreeComponent } from "./drop-down-tree.component";

describe("DropDownTreeComponent", () => {
    let component: DropDownTreeComponent;
    let fixture: ComponentFixture<DropDownTreeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DropDownTreeComponent, BrowserAnimationsModule, TreeViewComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DropDownTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
