import { NotificationPosition } from "./NotificationPosition";
import { TemplateRef } from "@angular/core";
import { NotificationType } from "./NotificationType";

export interface NotificationOptions {
    duration?: number;
    id?: string;
    position?: NotificationPosition;
    text?: string;
    textTemplate?: TemplateRef<any>;
    title?: string;
    type?: NotificationType;
}
