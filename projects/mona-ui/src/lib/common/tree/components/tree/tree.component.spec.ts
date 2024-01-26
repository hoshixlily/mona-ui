import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TreeService } from "../../services/tree.service";
import { SubTreeComponent } from "../sub-tree/sub-tree.component";
import { TreeDropHintComponent } from "../tree-drop-hint/tree-drop-hint.component";

import { TreeComponent } from "./tree.component";

describe("TreeComponent", () => {
    let component: TreeComponent<any>;
    let fixture: ComponentFixture<TreeComponent<any>>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TreeComponent, SubTreeComponent, TreeDropHintComponent],
            providers: [TreeService]
        }).compileComponents();

        fixture = TestBed.createComponent(TreeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
