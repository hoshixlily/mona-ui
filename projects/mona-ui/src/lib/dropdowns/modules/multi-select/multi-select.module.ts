import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MultiSelectComponent } from "./components/multi-select/multi-select.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";
import { ChipModule } from "../../../buttons/modules/chip/chip.module";
import { MultiSelectItemTemplateDirective } from "./directives/multi-select-item-template.directive";
import { MultiSelectGroupTemplateDirective } from "./directives/multi-select-group-template.directive";
import { MultiSelectSummaryTagDirective } from "./directives/multi-select-summary-tag.directive";
import { MultiSelectSummaryTagTemplateDirective } from "./directives/multi-select-summary-tag-template.directive";
import { MultiSelectTagTemplateDirective } from "./directives/multi-select-tag-template.directive";

@NgModule({
    declarations: [
        MultiSelectComponent,
        MultiSelectItemTemplateDirective,
        MultiSelectGroupTemplateDirective,
        MultiSelectSummaryTagDirective,
        MultiSelectSummaryTagTemplateDirective,
        MultiSelectTagTemplateDirective
    ],
    imports: [CommonModule, TextBoxModule, FontAwesomeModule, FormsModule, SharedModule, ChipModule],
    exports: [
        MultiSelectComponent,
        MultiSelectGroupTemplateDirective,
        MultiSelectItemTemplateDirective,
        MultiSelectSummaryTagDirective,
        MultiSelectSummaryTagTemplateDirective,
        MultiSelectTagTemplateDirective
    ]
})
export class MultiSelectModule {}
