import { NgStyle, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input, OnDestroy, OnInit, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimes,
    faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { asyncScheduler, interval, takeWhile } from "rxjs";
import { ProgressBarComponent } from "../../../progress-bars/progress-bar/components/progress-bar/progress-bar.component";
import { NotificationFade, NotificationSlide } from "../../animations/animation";
import { NotificationData } from "../../models/NotificationData";
import { NotificationType } from "../../models/NotificationType";

@Component({
    selector: "mona-notification",
    templateUrl: "./notification.component.html",
    styleUrls: ["./notification.component.scss"],
    animations: [NotificationSlide, NotificationFade],
    standalone: true,
    imports: [FontAwesomeModule, NgTemplateOutlet, NgStyle, ProgressBarComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-notification"
    }
})
export class NotificationComponent implements OnInit, OnDestroy {
    protected readonly closeIcon = faTimes;
    protected readonly errorIcon = faTimesCircle;
    protected readonly infoIcon = faInfoCircle;
    protected readonly progressColor = computed(() => {
        const type = this.type();
        const propertyName = `--mona-${type}`;
        return getComputedStyle(document.documentElement).getPropertyValue(propertyName);
    });
    protected readonly progressValue = signal(100);
    protected readonly successIcon = faCheckCircle;
    protected readonly type = signal<NotificationType>("info");
    protected readonly warningIcon = faExclamationCircle;
    public data = input.required<NotificationData>();

    public close(): void {
        this.data().visible.set(false);
        window.setTimeout(() => this.data().componentDestroy$.next(this.data().options.id as string), 300);
    }

    public ngOnDestroy(): void {
        this.data().componentDestroy$.next(this.data().options.id as string);
    }

    public ngOnInit(): void {
        this.type.set(this.data().options.type ?? "info");
        const duration = this.data().options.duration;
        if (duration == null) {
            return;
        }
        const progressInterval = duration / 100;
        interval(progressInterval)
            .pipe(takeWhile(() => this.progressValue() > 0))
            .subscribe({
                next: () => {
                    this.progressValue.set(this.progressValue() - 1);
                    if (this.progressValue() === 0) {
                        asyncScheduler.schedule(() => {
                            this.close();
                        }, 300);
                    }
                }
            });
    }
}
