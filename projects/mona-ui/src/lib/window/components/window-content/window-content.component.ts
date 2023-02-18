import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    OnInit,
    TemplateRef
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
    public readonly TemplateRef = TemplateRef;
    public readonly closeIcon: IconDefinition = faClose;
    public readonly contentType: "template" | "component" = "template";

    public constructor(
        @Inject(PopupInjectionToken) public windowData: WindowInjectorData,
        private readonly elementRef: ElementRef<HTMLElement>
    ) {
        if (windowData.content instanceof TemplateRef) {
            this.contentType = "template";
        } else {
            this.contentType = "component";
        }
    }

    public ngAfterViewInit(): void {
        this.focusElement();
    }

    public ngOnInit(): void {}

    public onCloseClick(event: MouseEvent): void {
        const closeEvent = new WindowCloseEvent({ event, via: PopupCloseSource.CloseButton });
        if (this.windowData.preventClose && this.windowData.preventClose(closeEvent)) {
            return;
        }
        this.windowData.windowReference.close();
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
