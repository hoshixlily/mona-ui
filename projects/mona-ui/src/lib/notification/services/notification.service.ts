import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, signal } from "@angular/core";
import { Subject, Subscription, take } from "rxjs";
import { v4 } from "uuid";
import { NotificationContainerComponent } from "../components/notification-container/notification-container.component";
import { NotificationContainerData } from "../models/NotificationContainerData";
import { NotificationData } from "../models/NotificationData";
import { NotificationOptions } from "../models/NotificationOptions";
import { NotificationPosition } from "../models/NotificationPosition";
import { NotificationType } from "../models/NotificationType";

@Injectable({
    providedIn: "root"
})
export class NotificationService {
    readonly #appRef: ApplicationRef = inject(ApplicationRef);
    private notificationContainerMap: Map<NotificationPosition, NotificationContainerData> = new Map<
        NotificationPosition,
        NotificationContainerData
    >();
    private notificationContainerSubscriptions: Record<NotificationPosition, Subscription | null> = {
        bottomright: null,
        bottomleft: null,
        topleft: null,
        topright: null
    };

    public constructor() {
        this.initialize();
    }

    private static getDefaultTitle(type: NotificationType): string {
        switch (type) {
            case "info":
                return "Info";
            case "success":
                return "Success";
            case "warning":
                return "Warning";
            case "error":
                return "Error";
        }
    }

    public close(id: string): void {
        const notificationData = this.getNotificationDataById(id);
        if (notificationData) {
            this.removeNotificationData(id, notificationData.options.position as NotificationPosition);
        }
    }

    public show(options: NotificationOptions): void {
        if (!options.id) {
            options.id = `Notification_${v4()}`;
        }
        if (!options.text && !options.textTemplate) {
            throw new Error(`Either notification text or textTemplate is required.`);
        }
        if (!options.position) {
            options.position = "topright";
        }
        if (!options.type) {
            options.type = "info";
        }
        if (!options.title) {
            options.title = NotificationService.getDefaultTitle(options.type);
        }
        const containerData: NotificationContainerData | undefined = this.notificationContainerMap.get(
            options.position
        );
        if (containerData?.notifications.has(options.id)) {
            return;
        }
        if (this.notificationContainerSubscriptions[options.position as NotificationPosition]) {
            this.createNotification(options);
        } else {
            this.createNotificationContainer(options);
        }
    }

    private createContainerComponent(): Subject<ComponentRef<NotificationContainerComponent>> {
        const containerSubject = new Subject<ComponentRef<NotificationContainerComponent>>();
        const notificationContainerComponent = createComponent(NotificationContainerComponent, {
            environmentInjector: this.#appRef.injector
        });
        document.body.appendChild(notificationContainerComponent.location.nativeElement);
        this.#appRef.attachView(notificationContainerComponent.hostView);
        notificationContainerComponent.changeDetectorRef.detectChanges();
        window.setTimeout(() => {
            containerSubject.next(notificationContainerComponent);
        });
        return containerSubject;
    }

    private createNotification(options: NotificationOptions): void {
        const notificationContainerData: NotificationContainerData | undefined = this.notificationContainerMap.get(
            options.position as NotificationPosition
        );
        if (!notificationContainerData) {
            throw new Error(`Notification container for position ${options.position} was not found.`);
        }
        const componentDestroy$ = new Subject<string>();
        if (!notificationContainerData.notifications.has(options.id as string)) {
            notificationContainerData.notifications.set(options.id as string, {
                options,
                componentDestroy$,
                visible: signal(true)
            });
            if (notificationContainerData.componentRef) {
                notificationContainerData.componentRef.instance.notificationDataList.set(
                    Array.from(notificationContainerData.notifications.values())
                );
            }
        }
        componentDestroy$.pipe(take(1)).subscribe(id => {
            this.removeNotificationData(id, options.position as NotificationPosition);
        });
    }

    private createNotificationContainer(options: NotificationOptions): void {
        const position = options.position as NotificationPosition;
        this.notificationContainerSubscriptions[position] = this.createContainerComponent().subscribe(ncr => {
            ncr.instance.position.set(options.position as NotificationPosition);
            const notificationContainerData = this.notificationContainerMap.get(
                options.position as NotificationPosition
            ) as NotificationContainerData;
            notificationContainerData.componentRef = ncr;
            notificationContainerData.subscription = this.notificationContainerSubscriptions[position] as Subscription;
            this.createNotification(options);
        });
    }

    private getNotificationDataById(id: string): NotificationData | null {
        for (const notificationContainerData of this.notificationContainerMap.values()) {
            const notificationData = notificationContainerData.notifications.get(id);
            if (notificationData) {
                return notificationData;
            }
        }
        return null;
    }

    private initialize(): void {
        this.notificationContainerMap.set("bottomleft", {
            componentRef: null,
            notifications: new Map<string, NotificationData>()
        });
        this.notificationContainerMap.set("bottomright", {
            componentRef: null,
            notifications: new Map<string, NotificationData>()
        });
        this.notificationContainerMap.set("topleft", {
            componentRef: null,
            notifications: new Map<string, NotificationData>()
        });
        this.notificationContainerMap.set("topright", {
            componentRef: null,
            notifications: new Map<string, NotificationData>()
        });
    }

    private removeNotificationData(id: string, position: NotificationPosition): void {
        const container = this.notificationContainerMap.get(position);
        if (container) {
            const notificationData = container.notifications.get(id);
            if (notificationData) {
                notificationData.visible.set(false);
            }
            container.notifications.delete(id);
            if (container.notifications.size === 0) {
                container.subscription?.unsubscribe();
                this.notificationContainerSubscriptions[position] = null;
                window.setTimeout(() => {
                    if (container.componentRef) {
                        this.#appRef.detachView(container.componentRef.hostView);
                        container.componentRef.destroy();
                    }
                }, 200);
            }
        }
    }
}
