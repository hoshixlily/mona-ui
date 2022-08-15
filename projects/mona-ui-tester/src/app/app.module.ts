import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ButtonsModule, ContextMenuModule, DropDownsModule, PopupModule, InputsModule } from "mona-ui";
import { TestComponentComponent } from "./test-component/test-component.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [AppComponent, TestComponentComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ButtonsModule,
        DropDownsModule,
        InputsModule,
        PopupModule,
        ContextMenuModule,
        FontAwesomeModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
