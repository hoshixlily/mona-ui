import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MultiSelectComponent } from "./components/multi-select/multi-select.component";
import { ChipModule } from "../../../buttons/modules/chip/chip.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { MultiSelectGroupTemplateDirective } from "./directives/multi-select-group-template.directive";
import { MultiSelectItemTemplateDirective } from "./directives/multi-select-item-template.directive";
import { MultiSelectTagTemplateDirective } from "./directives/multi-select-tag-template.directive";
import { MultiSelectSummaryTagTemplateDirective } from "./directives/multi-select-summary-tag-template.directive";
import { MultiSelectSummaryTagDirective } from "./directives/multi-select-summary-tag.directive";
import {ButtonModule} from "../../../buttons/modules/button/button.module";

@NgModule({
    declarations: [
        MultiSelectComponent,
        MultiSelectGroupTemplateDirective,
        MultiSelectItemTemplateDirective,
        MultiSelectTagTemplateDirective,
        MultiSelectSummaryTagTemplateDirective,
        MultiSelectSummaryTagDirective
    ],
    imports: [
        CommonModule,
        ChipModule,
        FontAwesomeModule,
        TextBoxModule,
        PopupListComponent,
        ListItemTemplateDirective,
        ListGroupTemplateDirective,
        ButtonModule
    ],
    exports: [
        MultiSelectComponent,
        MultiSelectGroupTemplateDirective,
        MultiSelectItemTemplateDirective,
        MultiSelectTagTemplateDirective,
        MultiSelectSummaryTagDirective,
        MultiSelectSummaryTagTemplateDirective
    ]
})
export class MultiSelectModule {}
