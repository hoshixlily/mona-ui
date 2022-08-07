import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonGroupComponent } from "./components/button-group/button-group.component";

@NgModule({
    declarations: [ButtonGroupComponent],
    imports: [CommonModule],
    exports: [ButtonGroupComponent]
})
export class ButtonGroupModule {}
