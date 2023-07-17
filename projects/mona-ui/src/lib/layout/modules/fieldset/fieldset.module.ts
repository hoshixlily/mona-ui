import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FieldsetComponent } from "./components/fieldset/fieldset.component";
import { FieldsetLegendTemplateDirective } from "./directives/fieldset-legend-template.directive";

@NgModule({
    declarations: [FieldsetComponent, FieldsetLegendTemplateDirective],
    imports: [CommonModule],
    exports: [FieldsetComponent, FieldsetLegendTemplateDirective]
})
export class FieldsetModule {}
