import { NgOptimizedImage } from "@angular/common";
import { enableProdMode, importProvidersFrom } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";

import { environment } from "./environments/environment";

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule, FontAwesomeModule, FormsModule, NgOptimizedImage),
        provideAnimations()
    ]
}).catch(err => console.error(err));
