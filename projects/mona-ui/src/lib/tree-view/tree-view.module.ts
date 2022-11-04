import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewComponent } from "./components/tree-view/tree-view.component";
import { TreeViewNodeComponent } from './components/tree-view-node/tree-view-node.component';

@NgModule({
    declarations: [TreeViewComponent, TreeViewNodeComponent],
    imports: [CommonModule],
    exports: [TreeViewComponent]
})
export class TreeViewModule {}
