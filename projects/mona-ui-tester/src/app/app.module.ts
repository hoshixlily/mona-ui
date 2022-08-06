import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ButtonsModule } from "mona-ui";

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AppRoutingModule, ButtonsModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
