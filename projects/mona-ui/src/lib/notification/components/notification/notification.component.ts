import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal, WritableSignal } from "@angular/core";
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimes,
    faTimesCircle,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { NotificationType } from "../../models/NotificationType";
import { NotificationData } from "../../models/NotificationData";
import { NotificationFade, NotificationSlide } from "../../../animations/NotificationSlide";
import { asyncScheduler, interval, takeWhile } from "rxjs";

@Component({
    selector: "mona-notification",
    templateUrl: "./notification.component.html",
    styleUrls: ["./notification.component.scss"],
    animations: [NotificationSlide, NotificationFade]
})
export class NotificationComponent implements OnInit, OnDestroy {
    public readonly closeIcon: IconDefinition = faTimes;
    public readonly errorIcon: IconDefinition = faTimesCircle;
    public readonly infoIcon: IconDefinition = faInfoCircle;
    public readonly successIcon: IconDefinition = faCheckCircle;
    public readonly warningIcon: IconDefinition = faExclamationCircle;
    public readonly progressValue: WritableSignal<number> = signal<number>(100);
    public type: NotificationType = "info";

    @Input({ required: true })
    public data!: NotificationData;

    public close(): void {
        this.data.visible = false;
        this.data.componentDestroy$.next(this.data.options.id as string);
    }

    public ngOnDestroy(): void {
        this.data.componentDestroy$.next(this.data.options.id as string);
    }

    public ngOnInit(): void {
        if (this.data.options?.duration) {
            const progressInterval = this.data.options.duration / 100;
            interval(progressInterval)
                .pipe(takeWhile(() => this.progressValue() > 0))
                .subscribe({
                    next: () => {
                        this.progressValue.set(this.progressValue() - 1);
                        if (this.progressValue() === 0) {
                            asyncScheduler.schedule(() => this.close(), 350); // wait for animation
                        }
                    }
                });
        }
        this.type = this.data.options.type ?? "info";
    }

    public get progressColor(): string {
        const propertyName = `--mona-${this.type}`;
        return getComputedStyle(document.documentElement).getPropertyValue(propertyName);
    }
}