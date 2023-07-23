import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Inject,
    OnInit,
    Output,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
import { PopupInjectionToken } from "../../models/PopupInjectionToken";
import { PopupInjectorData } from "../../models/PopupInjectorData";
import { animate, AnimationEvent, style, transition, trigger } from "@angular/animations";
import { filter, fromEvent } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { PopupCloseEvent, PopupCloseSource } from "../../models/PopupCloseEvent";

@Component({
    selector: "mona-popup-wrapper",
    templateUrl: "./popup-wrapper.component.html",
    styleUrls: ["./popup-wrapper.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger("display", [
            transition(":enter", [
                style({ transform: "translateY(-100%)", opacity: 1 }),
                animate("0.25s ease-out", style({ transform: "translateY(0)", opacity: 1 }))
            ])
        ])
    ]
})
export class PopupWrapperComponent implements OnInit, AfterViewInit {
    readonly #destroyRef = inject(DestroyRef);
    readonly #outsideEventsToClose = ["click", "mousedown", "dblclick", "contextmenu", "auxclick"];
    public animationDisabled: WritableSignal<boolean> = signal(false);
    public templateRef: TemplateRef<any> | null = null;
    public visible: WritableSignal<boolean> = signal(false);
    public wrapperClass: WritableSignal<string> = signal("");

    @Output()
    public animationStateChange: EventEmitter<AnimationEvent> = new EventEmitter<AnimationEvent>();

    public constructor(
        @Inject(PopupInjectionToken) private readonly popupData: PopupInjectorData,
        private readonly elementRef: ElementRef<HTMLElement>
    ) {}

    public ngAfterViewInit(): void {
        const parent = this.elementRef.nativeElement.parentElement;
        if (parent) {
            window.setTimeout(() => {
                parent.classList.add("mona-popup-wrapper-host");
            }, 150);
        }
    }

    public ngOnInit(): void {
        this.setSubscriptions();
        this.visible.set(true);
        if (this.popupData.wrapperClass != null) {
            if (this.popupData.wrapperClass instanceof Array) {
                this.wrapperClass.set(this.popupData.wrapperClass.join(" "));
            } else {
                this.wrapperClass.set(this.popupData.wrapperClass);
            }
        }
        if (this.popupData.disableAnimation) {
            this.animationDisabled.set(true);
        }
    }

    public onAnimationDone(event: AnimationEvent): void {
        if (event.toState === "hidden") {
            this.popupData.popupReference.close();
        }
    }

    private closePopup(): void {
        this.elementRef.nativeElement.parentElement?.classList.remove("mona-popup-wrapper-host");
        this.visible.set(false);
    }

    private setSubscriptions(): void {
        if (this.popupData.closeOnEscape) {
            fromEvent<KeyboardEvent>(document, "keydown")
                .pipe(
                    filter((event: KeyboardEvent) => event.key === "Escape"),
                    takeUntilDestroyed(this.#destroyRef)
                )
                .subscribe(() => {
                    this.closePopup();
                });
        }
        if (this.popupData.closeOnBackdropClick) {
            this.popupData.popupReference.overlayRef
                .backdropClick()
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe(e => {
                    const event = new PopupCloseEvent({ event: e, via: PopupCloseSource.BackdropClick });
                    const prevented = this.popupData.preventClose
                        ? this.popupData.preventClose(event) || event.isDefaultPrevented()
                        : false;
                    if (!prevented) {
                        this.closePopup();
                    }
                });
        }
        if (this.popupData.closeOnOutsideClick) {
            this.popupData.popupReference.overlayRef
                .outsidePointerEvents()
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe(event => {
                    if (this.#outsideEventsToClose.includes(event.type)) {
                        const closeEvent = new PopupCloseEvent({ event, via: PopupCloseSource.OutsideClick });
                        const prevented = this.popupData.preventClose
                            ? this.popupData.preventClose(closeEvent) || closeEvent.isDefaultPrevented()
                            : false;
                        if (!prevented) {
                            this.closePopup();
                        }
                    }
                });
        }
    }
}
