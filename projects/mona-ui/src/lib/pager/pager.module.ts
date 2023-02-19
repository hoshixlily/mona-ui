import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagerComponent } from "./components/pager/pager.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { SlicePipe } from "../pipes/slice.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [PagerComponent],
    imports: [CommonModule, ButtonModule, SlicePipe, FontAwesomeModule],
    exports: [PagerComponent]
})
export class PagerModule {}
