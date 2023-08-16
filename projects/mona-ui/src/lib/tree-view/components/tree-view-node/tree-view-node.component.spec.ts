import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { Node } from "../../data/Node";
import { TreeViewService } from "../../services/tree-view.service";

import { TreeViewNodeComponent } from "./tree-view-node.component";

describe("TreeViewNodeComponent", () => {
    let spectator: Spectator<TreeViewNodeComponent>;
    const createComponent = createComponentFactory({
        component: TreeViewNodeComponent,
        providers: [TreeViewService]
    });
    const node: Node = new Node({
        key: "0",
        index: 0,
        text: "Root",
        nodes: []
    });

    beforeEach(
        () =>
            (spectator = createComponent({
                props: {
                    node
                }
            }))
    );

    it("should create", () => {
        expect(spectator.component).toBeTruthy();
    });
});
