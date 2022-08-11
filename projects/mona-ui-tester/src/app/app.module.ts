import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ButtonsModule, PopupModule, ContextMenuModule } from "mona-ui";
import { TestComponentComponent } from "./test-component/test-component.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@NgModule({
    declarations: [AppComponent, TestComponentComponent],
    imports: [BrowserModule, AppRoutingModule, ButtonsModule, PopupModule, ContextMenuModule, FontAwesomeModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
