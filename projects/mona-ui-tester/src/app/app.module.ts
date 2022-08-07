import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ButtonsModule, PopupModule } from "mona-ui";
import { TestComponentComponent } from './test-component/test-component.component';

@NgModule({
    declarations: [AppComponent, TestComponentComponent],
    imports: [BrowserModule, AppRoutingModule, ButtonsModule, PopupModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
