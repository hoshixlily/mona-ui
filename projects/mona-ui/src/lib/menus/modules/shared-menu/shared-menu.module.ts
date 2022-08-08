import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenuItemComponent } from "./components/menu-item/menu-item.component";

@NgModule({
    declarations: [MenuItemComponent],
    imports: [CommonModule],
    exports: [MenuItemComponent]
})
export class SharedMenuModule {}
