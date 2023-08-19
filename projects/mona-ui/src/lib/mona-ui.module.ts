import { NgModule } from "@angular/core";
import { ButtonsModule } from "./buttons/buttons.module";
import { DateInputsModule } from "./date-inputs/date-inputs.module";
import { DropDownsModule } from "./dropdowns/drop-downs.module";
import { FilterModule } from "./filter/filter.module";
import { GridModule } from "./grid/grid.module";
import { InputsModule } from "./inputs/inputs.module";
import { LayoutModule } from "./layout/layout.module";
import { ListBoxModule } from "./list-box/list-box.module";
import { ListViewModule } from "./list-view/list-view.module";
import { MenusModule } from "./menus/menus.module";
import { NavigationModule } from "./navigation/navigation.module";
import { NotificationModule } from "./notification/notification.module";
import { PagerModule } from "./pager/pager.module";
import { PopupModule } from "./popup/popup.module";
import { ProgressBarsModule } from "./progress-bars/progress-bars.module";
import { TooltipsModule } from "./tooltips/tooltips.module";
import { TreeViewModule } from "./tree-view/tree-view.module";
import { WindowModule } from "./window/window.module";

@NgModule({
    exports: [
        ButtonsModule,
        DateInputsModule,
        DropDownsModule,
        FilterModule,
        GridModule,
        InputsModule,
        LayoutModule,
        ListBoxModule,
        ListViewModule,
        MenusModule,
        NavigationModule,
        NotificationModule,
        PagerModule,
        PopupModule,
        ProgressBarsModule,
        TooltipsModule,
        TreeViewModule,
        WindowModule
    ]
})
export class MonaUiModule {}
