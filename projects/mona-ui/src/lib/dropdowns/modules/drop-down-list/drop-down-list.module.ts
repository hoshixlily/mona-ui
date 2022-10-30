import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropDownListComponent } from "./components/drop-down-list/drop-down-list.component";
import { PopupListComponent } from "../../components/popup-list/popup-list.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [DropDownListComponent],
    imports: [CommonModule, PopupListComponent, FontAwesomeModule],
    exports: [DropDownListComponent]
})
export class DropDownListModule {}
