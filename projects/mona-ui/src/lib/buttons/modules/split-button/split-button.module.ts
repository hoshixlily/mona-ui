import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SplitButtonComponent } from "./components/split-button/split-button.component";
import { PopupModule } from "../../../popup/popup.module";

@NgModule({
    declarations: [SplitButtonComponent],
    imports: [CommonModule, PopupModule],
    exports: [SplitButtonComponent]
})
export class SplitButtonModule {}
