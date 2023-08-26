import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Node } from "../../data/Node";
import { TreeViewService } from "../../services/tree-view.service";

import { TreeViewNodeComponent } from "./tree-view-node.component";

describe("TreeViewNodeComponent", () => {
    let component: TreeViewNodeComponent;
    let fixture: ComponentFixture<TreeViewNodeComponent>;
    const node: Node = new Node({
        key: "0",
        index: 0,
        text: "Root",
        nodes: []
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TreeViewNodeComponent],
            providers: [TreeViewService]
        });
        fixture = TestBed.createComponent(TreeViewNodeComponent);
        component = fixture.componentInstance;
        component.node = node;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
