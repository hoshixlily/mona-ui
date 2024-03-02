import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    Signal,
    signal,
    WritableSignal
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimes,
    faTimesCircle,
    IconDefinition
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
    protected readonly closeIcon: IconDefinition = faTimes;
    protected readonly errorIcon: IconDefinition = faTimesCircle;
    protected readonly infoIcon: IconDefinition = faInfoCircle;
    protected readonly progressColor: Signal<string> = computed(() => {
        const type = this.type();
        const propertyName = `--mona-${type}`;
        return getComputedStyle(document.documentElement).getPropertyValue(propertyName);
    });
    protected readonly progressValue: WritableSignal<number> = signal(100);
    protected readonly successIcon: IconDefinition = faCheckCircle;
    protected readonly type: WritableSignal<NotificationType> = signal("info");
    protected readonly warningIcon: IconDefinition = faExclamationCircle;
    public data: InputSignal<NotificationData> = input.required<NotificationData>();

    public close(): void {
        this.data().visible.set(false);
        window.setTimeout(() => this.data().componentDestroy$.next(this.data().options.id as string), 300);
    }

    public ngOnDestroy(): void {
        this.data().componentDestroy$.next(this.data().options.id as string);
    }

    public ngOnInit(): void {
        const duration = this.data().options.duration;
        if (duration != null) {
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
        this.type.set(this.data().options.type ?? "info");
    }
}
