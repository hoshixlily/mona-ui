import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutoCompleteComponent } from "./components/auto-complete/auto-complete.component";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "../../../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";

@NgModule({
    declarations: [AutoCompleteComponent],
    imports: [
        CommonModule,
        TextBoxModule,
        FormsModule,
        ButtonModule,
        FontAwesomeModule,
        PopupListComponent,
        ListItemTemplateDirective,
        ListGroupTemplateDirective
    ],
    exports: [AutoCompleteComponent]
})
export class AutoCompleteModule {}
