import { Subject } from "rxjs";
import { ComponentRef } from "@angular/core";
import { NotificationComponent } from "../components/notification/notification.component";
import { NotificationOptions } from "./NotificationOptions";

export interface NotificationData {
    componentDestroy$: Subject<string>;
    componentRef?: ComponentRef<NotificationComponent>;
    options: NotificationOptions;
    visible: boolean;
}
