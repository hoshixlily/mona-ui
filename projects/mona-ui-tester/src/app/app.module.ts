import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
    ButtonsModule,
    ContextMenuModule,
    DropDownsModule,
    InputsModule,
    PopupListComponent,
    PopupModule
} from "mona-ui";
import { TestComponentComponent } from "./test-component/test-component.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TreeViewModule } from "../../../mona-ui/src/lib/tree-view/tree-view.module";

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
        PopupListComponent,
        TreeViewModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
