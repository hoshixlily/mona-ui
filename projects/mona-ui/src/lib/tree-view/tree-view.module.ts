import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewComponent } from "./components/tree-view/tree-view.component";
import { TreeViewNodeComponent } from "./components/tree-view-node/tree-view-node.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CheckBoxModule } from "../inputs/modules/check-box/check-box.module";
import { FormsModule } from "@angular/forms";
import { TreeViewCheckableDirective } from "./directives/tree-view-checkable.directive";
import { TreeViewNodeTextTemplateDirective } from "./directives/tree-view-node-text-template.directive";

@NgModule({
    declarations: [
        TreeViewComponent,
        TreeViewNodeComponent,
        TreeViewCheckableDirective,
        TreeViewNodeTextTemplateDirective
    ],
    imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule],
    exports: [TreeViewComponent, TreeViewCheckableDirective, TreeViewNodeTextTemplateDirective]
})
export class TreeViewModule {}
