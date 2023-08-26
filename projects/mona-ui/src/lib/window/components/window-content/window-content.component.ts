import {
    AfterViewInit,
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    createComponent,
    DestroyRef,
    ElementRef,
    inject,
    Inject,
    Injector,
    OnInit,
    signal,
    TemplateRef,
    Type,
    ViewChild,
    ViewContainerRef,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { faClose, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { filter, fromEvent } from "rxjs";
import { AnimationService } from "../../../animations/animation.service";
import { PopupCloseSource } from "../../../popup/models/PopupCloseEvent";
import { PopupDataInjectionToken } from "../../../popup/models/PopupInjectionToken";
import { WindowCloseEvent } from "../../models/WindowCloseEvent";
import { WindowInjectorData } from "../../models/WindowInjectorData";

@Component({
    selector: "mona-window-content",
    templateUrl: "./window-content.component.html",
    styleUrls: ["./window-content.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowContentComponent implements OnInit, AfterViewInit {
    private readonly destroyRef = inject(DestroyRef);
    public readonly closeIcon: IconDefinition = faClose;
    public readonly componentRef?: ComponentRef<any>;
    public readonly contentType: "template" | "component" = "template";
    public isVisible: WritableSignal<boolean> = signal(false);

    @ViewChild("componentAnchor", { read: ViewContainerRef })
    public componentAnchor!: ViewContainerRef;

    public constructor(
        private readonly animationService: AnimationService,
        private readonly appRef: ApplicationRef,
        private injector: Injector,
        @Inject(PopupDataInjectionToken) public windowData: WindowInjectorData,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly viewContainerRef: ViewContainerRef
    ) {
        if (windowData.content instanceof TemplateRef) {
            this.contentType = "template";
        } else {
            this.contentType = "component";
            this.componentRef = createComponent(windowData.content as Type<any>, {
                environmentInjector: this.appRef.injector,
                elementInjector: this.injector
            });
        }
    }

    public ngAfterViewInit(): void {
        if (this.contentType === "component" && this.componentAnchor && this.componentRef) {
            const index = this.viewContainerRef.indexOf(this.componentRef.hostView);
            if (index !== -1) {
                this.viewContainerRef.detach(index);
            }
            this.componentAnchor.insert(this.componentRef.hostView, 0);
            this.componentRef.changeDetectorRef.detectChanges();
        }
        this.focusElement();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
        this.isVisible.set(true);
    }

    public onCloseClick(event: MouseEvent): void {
        this.closeWindow(event);
    }

    private closeWindow(event: Event): void {
        const closeEvent = new WindowCloseEvent({ event, via: PopupCloseSource.CloseButton });
        if (this.windowData.preventClose && this.windowData.preventClose(closeEvent)) {
            return;
        }
        this.animationService.scaleOut(this.windowData.windowReference.element);
        this.windowData.windowReference.closeWithDelay(100, closeEvent);
    }

    private focusElement(): void {
        const element = this.windowData.focusedElement;
        if (element === undefined) {
            return;
        }
        const windowElement = this.elementRef.nativeElement;
        if (element instanceof ElementRef) {
            element.nativeElement.focus();
        } else if (element instanceof HTMLElement) {
            element.focus();
        } else {
            const elements = windowElement.querySelectorAll(element);
            if (elements.length > 0) {
                (elements[0] as HTMLElement).focus();
            }
        }
    }

    private setSubscriptions(): void {
        if (this.windowData.closeOnEscape) {
            fromEvent<KeyboardEvent>(document, "keydown")
                .pipe(
                    filter(event => event.key === "Escape"),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe(event => {
                    this.closeWindow(event);
                });
        }
    }
}
