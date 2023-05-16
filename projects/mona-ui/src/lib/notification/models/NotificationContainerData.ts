import { ComponentRef } from "@angular/core";
import { NotificationContainerComponent } from "../components/notification-container/notification-container.component";
import { NotificationData } from "./NotificationData";
import { Subscription } from "rxjs";

export interface NotificationContainerData {
    componentRef: ComponentRef<NotificationContainerComponent> | null;
    notifications: Map<string, NotificationData>;
    subscription?: Subscription;
}
