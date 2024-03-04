import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from "@angular/core";
import { NotificationData } from "../../models/NotificationData";
import { NotificationPosition } from "../../models/NotificationPosition";
import { NotificationComponent } from "../notification/notification.component";

@Component({
    selector: "mona-notification-container",
    templateUrl: "./notification-container.component.html",
    styleUrls: ["./notification-container.component.scss"],
    standalone: true,
    imports: [NgClass, NotificationComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-notification-container",
        "[class]": "positionClass()"
    }
})
export class NotificationContainerComponent {
    protected readonly positionClass: Signal<string> = computed(() => {
        return this.position() as string;
    });
    public readonly notificationDataList: WritableSignal<NotificationData[]> = signal([]);
    public readonly position: WritableSignal<NotificationPosition> = signal("topright");
}
