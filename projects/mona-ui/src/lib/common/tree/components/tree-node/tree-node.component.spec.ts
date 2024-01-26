import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TreeService } from "../../services/tree.service";

import { TreeNodeComponent } from "./tree-node.component";

describe("TreeNodeComponent", () => {
    let component: TreeNodeComponent<any>;
    let fixture: ComponentFixture<TreeNodeComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeNodeComponent],
            providers: [TreeService]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeNodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
