import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
    ButtonsModule,
    ContextMenuModule,
    DropDownsModule,
    InputsModule,
    PopupListComponent,
    PopupModule,
    TreeViewModule,
    LayoutModule,
    DateInputsModule,
    TooltipsModule,
    MenubarModule,
    WindowModule,
    ProgressBarsModule,
    PagerModule,
    FilterModule,
    GridModule,
    NotificationModule,
    NavigationModule
} from "mona-ui";
import { TestComponentComponent } from "./test-component/test-component.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgOptimizedImage } from "@angular/common";

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
        NavigationModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
