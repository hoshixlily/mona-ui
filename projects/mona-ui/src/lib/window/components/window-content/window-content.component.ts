import { NgTemplateOutlet } from "@angular/common";
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
    Injector,
    OnInit,
    signal,
    TemplateRef,
    viewChild,
    ViewContainerRef
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { filter, fromEvent } from "rxjs";
import { AnimationService } from "../../../animations/services/animation.service";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { PopupCloseSource } from "../../../popup/models/PopupCloseEvent";
import { PopupDataInjectionToken } from "../../../popup/models/PopupInjectionToken";
import { WindowDragHandlerDirective } from "../../directives/window-drag-handler.directive";
import { WindowResizeHandlerDirective } from "../../directives/window-resize-handler.directive";
import { WindowCloseEvent } from "../../models/WindowCloseEvent";
import { WindowInjectorData } from "../../models/WindowInjectorData";

@Component({
    selector: "mona-window-content",
    templateUrl: "./window-content.component.html",
    styleUrls: ["./window-content.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        WindowDragHandlerDirective,
        NgTemplateOutlet,
        ButtonDirective,
        FontAwesomeModule,
        WindowResizeHandlerDirective
    ]
})
export class WindowContentComponent implements OnInit, AfterViewInit {
    readonly #animationService: AnimationService = inject(AnimationService);
    readonly #appRef: ApplicationRef = inject(ApplicationRef);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #injector: Injector = inject(Injector);
    readonly #viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
    protected readonly closeIcon = faClose;
    protected readonly componentAnchor = viewChild.required("componentAnchor", {
        read: ViewContainerRef
    });
    protected readonly componentRef?: ComponentRef<any>;
    protected readonly contentType = signal<"template" | "component">("template");
    protected readonly windowData: WindowInjectorData = inject<WindowInjectorData>(PopupDataInjectionToken);

    public constructor() {
        if (this.windowData.content instanceof TemplateRef) {
            this.contentType.set("template");
        } else {
            this.contentType.set("component");
            this.componentRef = createComponent(this.windowData.content, {
                environmentInjector: this.#appRef.injector,
                elementInjector: this.#injector
            });
        }
    }

    public ngAfterViewInit(): void {
        if (this.contentType() === "component" && this.componentAnchor() && this.componentRef) {
            const index = this.#viewContainerRef.indexOf(this.componentRef.hostView);
            if (index !== -1) {
                this.#viewContainerRef.detach(index);
            }
            this.componentAnchor().insert(this.componentRef.hostView, 0);
            this.componentRef.changeDetectorRef.detectChanges();
        }
        this.focusElement();
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    public onCloseClick(event: MouseEvent): void {
        this.closeWindow(event);
    }

    private closeWindow(event: Event): void {
        const closeEvent = new WindowCloseEvent({ event, via: PopupCloseSource.CloseButton, originalEvent: event });
        if (this.windowData.preventClose && this.windowData.preventClose(closeEvent)) {
            return;
        }
        this.windowData.windowReference.beforeClose$$.next(closeEvent);
        if (closeEvent.isDefaultPrevented()) {
            return;
        }
        this.#animationService.scaleOut(this.windowData.windowReference.element);
        this.windowData.windowReference.closeWithDelay(100, closeEvent);
    }

    private focusElement(): void {
        const element = this.windowData.focusedElement;
        if (element === undefined) {
            return;
        }
        const windowElement = this.#hostElementRef.nativeElement;
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
                    takeUntilDestroyed(this.#destroyRef)
                )
                .subscribe(event => {
                    this.closeWindow(event);
                });
        }
    }
}
