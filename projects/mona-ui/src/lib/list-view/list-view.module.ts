import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PagerModule } from "../pager/pager.module";
import { ListViewComponent } from "./components/list-view/list-view.component";
import { ListViewFooterTemplateDirective } from "./directives/list-view-footer-template.directive";
import { ListViewHeaderTemplateDirective } from "./directives/list-view-header-template.directive";
import { ListViewItemTemplateDirective } from "./directives/list-view-item-template.directive";
import { ListViewSelectableDirective } from "./directives/list-view-selectable.directive";
import { ListViewVirtualScrollDirective } from "./directives/list-view-virtual-scroll.directive";

@NgModule({
    declarations: [
        ListViewComponent,
        ListViewItemTemplateDirective,
        ListViewHeaderTemplateDirective,
        ListViewFooterTemplateDirective,
        ListViewSelectableDirective,
        ListViewVirtualScrollDirective
    ],
    imports: [CommonModule, PagerModule, CdkVirtualForOf, CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll],
    exports: [
        ListViewComponent,
        ListViewItemTemplateDirective,
        ListViewFooterTemplateDirective,
        ListViewHeaderTemplateDirective,
        ListViewSelectableDirective,
        ListViewVirtualScrollDirective
    ]
})
export class ListViewModule {}
