import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PagerModule } from "../pager/pager.module";
import { ListViewComponent } from "./components/list-view/list-view.component";
import { ListViewFooterTemplateDirective } from "./directives/list-view-footer-template.directive";
import { ListViewHeaderTemplateDirective } from "./directives/list-view-header-template.directive";
import { ListViewItemTemplateDirective } from "./directives/list-view-item-template.directive";

@NgModule({
    declarations: [
        ListViewComponent,
        ListViewItemTemplateDirective,
        ListViewHeaderTemplateDirective,
        ListViewFooterTemplateDirective
    ],
    imports: [CommonModule, PagerModule],
    exports: [
        ListViewComponent,
        ListViewItemTemplateDirective,
        ListViewFooterTemplateDirective,
        ListViewHeaderTemplateDirective
    ]
})
export class ListViewModule {}
