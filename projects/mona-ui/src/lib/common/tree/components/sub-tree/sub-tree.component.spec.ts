import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TreeService } from "../../services/tree.service";

import { SubTreeComponent } from "./sub-tree.component";

describe("SubTreeComponent", () => {
    let component: SubTreeComponent<any>;
    let fixture: ComponentFixture<SubTreeComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SubTreeComponent],
            providers: [TreeService]
        }).compileComponents();

        fixture = TestBed.createComponent(SubTreeComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput("depth", 0);
        fixture.componentRef.setInput("parent", null);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
