import { DragDropModule } from "@angular/cdk/drag-drop";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { TreeViewNodeComponent } from "../tree-view-node/tree-view-node.component";

import { TreeViewComponent } from "./tree-view.component";

describe("TreeViewComponent", () => {
    let spectator: Spectator<TreeViewComponent>;
    const createComponent = createComponentFactory({
        component: TreeViewComponent,
        imports: [DragDropModule],
        declarations: [TreeViewNodeComponent]
    });
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

    beforeEach(
        () =>
            (spectator = createComponent({
                props: {
                    data,
                    keyField: "id"
                }
            }))
    );

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
