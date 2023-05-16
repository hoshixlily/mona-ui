import {
    AfterViewInit,
    ApplicationRef,
    ChangeDetectionStrategy,
    Component,
    ComponentRef,
    createComponent,
    ElementRef,
    Inject,
    Injector,
    OnInit,
    TemplateRef,
    Type,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import { PopupInjectionToken } from "../../../popup/models/PopupInjectionToken";
import { WindowInjectorData } from "../../models/WindowInjectorData";
import { faClose, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { WindowCloseEvent } from "../../models/WindowCloseEvent";
import { PopupCloseSource } from "../../../popup/models/PopupCloseEvent";

@Component({
    selector: "mona-window-content",
    templateUrl: "./window-content.component.html",
    styleUrls: ["./window-content.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowContentComponent implements OnInit, AfterViewInit {
    public readonly closeIcon: IconDefinition = faClose;
    public readonly componentRef?: ComponentRef<any>;
    public readonly contentType: "template" | "component" = "template";

    @ViewChild("componentAnchor", { read: ViewContainerRef })
    public componentAnchor!: ViewContainerRef;

    public constructor(
        private readonly appRef: ApplicationRef,
        private injector: Injector,
        @Inject(PopupInjectionToken) public windowData: WindowInjectorData,
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

    public ngOnInit(): void {}

    public onCloseClick(event: MouseEvent): void {
        const closeEvent = new WindowCloseEvent({ event, via: PopupCloseSource.CloseButton });
        if (this.windowData.preventClose && this.windowData.preventClose(closeEvent)) {
            return;
        }
        this.windowData.windowReference.close(closeEvent);
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
}
