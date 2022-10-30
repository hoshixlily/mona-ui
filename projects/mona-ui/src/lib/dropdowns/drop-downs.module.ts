import { NgModule } from "@angular/core";
import { PopupListComponent } from "./components/popup-list/popup-list.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [PopupListComponent],
    imports: [CommonModule],
    exports: [PopupListComponent]
})
export class DropDownsModule {}
