import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeViewComponent } from "./components/tree-view/tree-view.component";
import { TreeViewNodeComponent } from "./components/tree-view-node/tree-view-node.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CheckBoxModule } from "../inputs/modules/check-box/check-box.module";
import { FormsModule } from "@angular/forms";
import { TreeViewCheckableDirective } from "./directives/tree-view-checkable.directive";
import { TreeViewNodeTextTemplateDirective } from "./directives/tree-view-node-text-template.directive";
import { TreeViewExpandableDirective } from "./directives/tree-view-expandable.directive";
import { TreeViewSelectableDirective } from "./directives/tree-view-selectable.directive";
import { ContextMenuModule } from "../menus/modules/context-menu/context-menu.module";
import { TreeViewDisableDirective } from "./directives/tree-view-disable.directive";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
    declarations: [
        TreeViewComponent,
        TreeViewNodeComponent,
        TreeViewCheckableDirective,
        TreeViewNodeTextTemplateDirective,
        TreeViewExpandableDirective,
        TreeViewSelectableDirective,
        TreeViewDisableDirective
    ],
    imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule, ContextMenuModule, DragDropModule],
    exports: [
        TreeViewComponent,
        TreeViewCheckableDirective,
        TreeViewNodeTextTemplateDirective,
        TreeViewExpandableDirective,
        TreeViewSelectableDirective,
        TreeViewDisableDirective
    ]
})
export class TreeViewModule {}
