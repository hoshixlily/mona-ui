import { Component } from "@angular/core";
import { TreeService } from "../../services/tree.service";
import { SubTreeComponent } from "../sub-tree/sub-tree.component";

@Component({
    selector: "mona-tree",
    standalone: true,
    imports: [SubTreeComponent],
    templateUrl: "./tree.component.html",
    styleUrl: "./tree.component.scss"
})
export class TreeComponent<T> {
    public constructor(protected readonly treeService: TreeService<T>) {}
}
