import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonsModule, DropDownsModule, InputsModule, PopupModule, ContextMenuModule, LayoutModule, TreeViewModule, DateInputsModule, TooltipsModule, MenubarModule, WindowModule, ProgressBarsModule, PagerModule, FilterModule, GridModule, NotificationModule, NavigationModule, ListViewModule, ListBoxModule } from 'mona-ui';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule, ButtonsModule, DropDownsModule, InputsModule, PopupModule, ContextMenuModule, FontAwesomeModule, FormsModule, LayoutModule, TreeViewModule, DateInputsModule, TooltipsModule, MenubarModule, WindowModule, ProgressBarsModule, PagerModule, FilterModule, GridModule, NotificationModule, NgOptimizedImage, NavigationModule, ListViewModule, ListBoxModule),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
