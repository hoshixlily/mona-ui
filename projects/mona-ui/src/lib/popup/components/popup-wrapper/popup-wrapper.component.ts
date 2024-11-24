import { NgTemplateOutlet } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnInit,
    signal,
    TemplateRef
} from "@angular/core";
import { PopupSettingsInjectionToken } from "../../models/PopupInjectionToken";
import { PopupSettings } from "../../models/PopupSettings";

@Component({
    selector: "mona-popup-wrapper",
    templateUrl: "./popup-wrapper.component.html",
    styleUrls: ["./popup-wrapper.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    host: {
        class: "mona-popup-wrapper"
    }
})
export class PopupWrapperComponent implements OnInit, AfterViewInit {
    readonly #popupSettings: PopupSettings = inject<PopupSettings>(PopupSettingsInjectionToken);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    public readonly templateRef = signal<TemplateRef<any> | null>(null);
    public visible = signal(false);
    public wrapperClass = signal("");

    public ngAfterViewInit(): void {
        if (this.wrapperClass()) {
            this.#hostElementRef.nativeElement.classList.add(this.wrapperClass());
        }
    }

    public ngOnInit(): void {
        if (this.#popupSettings.popupWrapperClass != null) {
            if (this.#popupSettings.popupWrapperClass instanceof Array) {
                this.wrapperClass.set(this.#popupSettings.popupWrapperClass.join(" "));
            } else {
                this.wrapperClass.set(this.#popupSettings.popupWrapperClass);
            }
        }
    }
}
