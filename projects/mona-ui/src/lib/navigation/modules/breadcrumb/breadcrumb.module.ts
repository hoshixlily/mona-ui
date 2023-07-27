import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BreadcrumbItemTemplateDirective } from "./directives/breadcrumb-item-template.directive";
import { BreadcrumbSeparatorTemplateDirective } from "./directives/breadcrumb-separator-template.directive";

@NgModule({
    declarations: [BreadcrumbComponent, BreadcrumbItemTemplateDirective, BreadcrumbSeparatorTemplateDirective],
    imports: [CommonModule, FontAwesomeModule],
    exports: [BreadcrumbComponent, BreadcrumbItemTemplateDirective, BreadcrumbSeparatorTemplateDirective]
})
export class BreadcrumbModule {}
