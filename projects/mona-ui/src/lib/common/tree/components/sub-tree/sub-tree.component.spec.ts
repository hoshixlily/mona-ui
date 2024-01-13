import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SubTreeComponent } from "./sub-tree.component";

describe("SubTreeComponent", () => {
    let component: SubTreeComponent<any>;
    let fixture: ComponentFixture<SubTreeComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubTreeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SubTreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
