import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComboBoxComponent } from "./components/combo-box/combo-box.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FormsModule } from "@angular/forms";
import { ComboBoxGroupTemplateDirective } from "./directives/combo-box-group-template.directive";
import { ComboBoxItemTemplateDirective } from "./directives/combo-box-item-template.directive";

@NgModule({
    declarations: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective],
    imports: [
        CommonModule,
        FontAwesomeModule,
        ButtonModule,
        PopupListComponent,
        ListItemTemplateDirective,
        ListGroupTemplateDirective,
        TextBoxModule,
        FormsModule
    ],
    exports: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective]
})
export class ComboBoxModule {}
