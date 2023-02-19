import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CircularProgressBarComponent } from "./components/circular-progress-bar/circular-progress-bar.component";
import { CircularProgressBarLabelTemplateDirective } from "./directives/circular-progress-bar-label-template.directive";

@NgModule({
    declarations: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective],
    imports: [CommonModule],
    exports: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective]
})
export class CircularProgressBarModule {}
