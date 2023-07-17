import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScrollViewComponent } from "./components/scroll-view/scroll-view.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [ScrollViewComponent],
    imports: [CommonModule, FontAwesomeModule],
    exports: [ScrollViewComponent]
})
export class ScrollViewModule {}
