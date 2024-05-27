import { NgOptimizedImage } from "@angular/common";
import { enableProdMode, importProvidersFrom, provideExperimentalZonelessChangeDetection } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppComponent } from "./app/app.component";

import { environment } from "./environments/environment";

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(FontAwesomeModule, FormsModule, NgOptimizedImage),
        provideAnimations(),
        provideExperimentalZonelessChangeDetection()
    ]
}).catch(err => console.error(err));
