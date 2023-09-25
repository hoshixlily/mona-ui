import { NgClass, NgFor } from "@angular/common";
import { Component } from "@angular/core";
import { NotificationData } from "../../models/NotificationData";
import { NotificationPosition } from "../../models/NotificationPosition";
import { NotificationComponent } from "../notification/notification.component";

@Component({
    selector: "mona-notification-container",
    templateUrl: "./notification-container.component.html",
    styleUrls: ["./notification-container.component.scss"],
    standalone: true,
    imports: [NgClass, NgFor, NotificationComponent]
})
export class NotificationContainerComponent {
    public notificationDataList: NotificationData[] = [];
    public position: NotificationPosition = "topright";

    public constructor() {}

    public trackByFn(index: number, item: NotificationData): string {
        return item.options.id as string;
    }
}
