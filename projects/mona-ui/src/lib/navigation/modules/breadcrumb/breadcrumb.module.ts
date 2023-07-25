import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [BreadcrumbComponent],
    imports: [CommonModule, FontAwesomeModule],
    exports: [BreadcrumbComponent]
})
export class BreadcrumbModule {}
