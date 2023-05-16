import { Component } from "@angular/core";
import { NotificationPosition } from "../../models/NotificationPosition";
import { NotificationData } from "../../models/NotificationData";

@Component({
    selector: "mona-notification-container",
    templateUrl: "./notification-container.component.html",
    styleUrls: ["./notification-container.component.scss"]
})
export class NotificationContainerComponent {
    public notificationDataList: NotificationData[] = [];
    public position: NotificationPosition = "topright";
    public constructor() {}
    public trackByFn(index: number, item: NotificationData): string {
        return item.options.id as string;
    }
}
