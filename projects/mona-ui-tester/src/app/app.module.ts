import { NgOptimizedImage } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    ButtonsModule,
    ContextMenuModule,
    DateInputsModule,
    DropDownsModule,
    FilterModule,
    GridModule,
    InputsModule,
    LayoutModule,
    ListViewModule,
    MenubarModule,
    NavigationModule,
    NotificationModule,
    PagerModule,
    PopupListComponent,
    PopupModule,
    ProgressBarsModule,
    SlicePipe,
    TooltipsModule,
    TreeViewModule,
    WindowModule
} from "mona-ui";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TestComponentComponent } from "./test-component/test-component.component";

@NgModule({
    declarations: [AppComponent, TestComponentComponent],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        ButtonsModule,
        DropDownsModule,
        InputsModule,
        PopupModule,
        ContextMenuModule,
        FontAwesomeModule,
        FormsModule,
        LayoutModule,
        PopupListComponent,
        TreeViewModule,
        DateInputsModule,
        TooltipsModule,
        MenubarModule,
        WindowModule,
        ProgressBarsModule,
        PagerModule,
        FilterModule,
        GridModule,
        NotificationModule,
        NgOptimizedImage,
        NavigationModule,
        ListViewModule,

        SlicePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
