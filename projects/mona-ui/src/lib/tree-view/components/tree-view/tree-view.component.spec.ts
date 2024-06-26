import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";

import { TreeViewComponent } from "./tree-view.component";

describe("TreeViewComponent", () => {
    let component: TreeViewComponent<any>;
    let fixture: ComponentFixture<TreeViewComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeViewComponent],
            providers: [provideAnimations()]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
