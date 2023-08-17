import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { ListViewModule } from "../list-view/list-view.module";
import { ListBoxComponent } from "./components/list-box/list-box.component";

@NgModule({
    declarations: [ListBoxComponent],
    imports: [CommonModule, ListViewModule, ButtonModule, FontAwesomeModule],
    exports: [ListBoxComponent]
})
export class ListBoxModule {}
