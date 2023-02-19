import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressBarModule } from "./modules/progress-bar/progress-bar.module";
import { CircularProgressBarModule } from "./modules/circular-progress-bar/circular-progress-bar.module";

@NgModule({
    declarations: [],
    imports: [CommonModule],
    exports: [CircularProgressBarModule, ProgressBarModule]
})
export class ProgressBarsModule {}
