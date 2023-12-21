import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { TreeViewComponent } from "./tree-view.component";

describe("TreeViewComponent", () => {
    let component: TreeViewComponent;
    let fixture: ComponentFixture<TreeViewComponent>;
    const data = [
        {
            id: 1,
            name: "Parent 1",
            children: [
                {
                    id: 2,
                    name: "Child 1"
                }
            ]
        },
        {
            id: 3,
            name: "Parent 2",
            children: [
                {
                    id: 4,
                    name: "Child 2"
                },
                {
                    id: 5,
                    name: "Child 3"
                }
            ]
        },
        {
            id: 6,
            name: "Parent 3"
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TreeViewComponent, BrowserAnimationsModule]
        });
        fixture = TestBed.createComponent(TreeViewComponent);
        component = fixture.componentInstance;
        component.data = data;
        component.keyField = "id";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
