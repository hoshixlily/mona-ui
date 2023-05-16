import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationContainerComponent } from "./components/notification-container/notification-container.component";
import { NotificationComponent } from "./components/notification/notification.component";
import { ButtonModule } from "../buttons/modules/button/button.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { ProgressBarModule } from "../progress-bars/modules/progress-bar/progress-bar.module";

@NgModule({
    declarations: [NotificationContainerComponent, NotificationComponent],
    imports: [CommonModule, ButtonModule, FontAwesomeModule, FormsModule, ProgressBarModule],
    exports: [NotificationComponent]
})
export class NotificationModule {}
