import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewComponent } from "./components/tree-view/tree-view.component";
import { TreeViewNodeComponent } from "./components/tree-view-node/tree-view-node.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CheckBoxModule } from "../inputs/modules/check-box/check-box.module";

@NgModule({
    declarations: [TreeViewComponent, TreeViewNodeComponent],
    imports: [CommonModule, FontAwesomeModule, CheckBoxModule],
    exports: [TreeViewComponent]
})
export class TreeViewModule {}
