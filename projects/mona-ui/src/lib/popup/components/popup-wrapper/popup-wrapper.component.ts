import { ChangeDetectionStrategy, Component, Inject, OnInit, signal, TemplateRef, WritableSignal } from "@angular/core";
import { PopupSettingsInjectionToken } from "../../models/PopupInjectionToken";
import { PopupSettings } from "../../models/PopupSettings";

@Component({
    selector: "mona-popup-wrapper",
    templateUrl: "./popup-wrapper.component.html",
    styleUrls: ["./popup-wrapper.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupWrapperComponent implements OnInit {
    public templateRef: TemplateRef<any> | null = null;
    public visible: WritableSignal<boolean> = signal(false);
    public wrapperClass: WritableSignal<string> = signal("");

    public constructor(@Inject(PopupSettingsInjectionToken) private readonly popupSettings: PopupSettings) {}

    public ngOnInit(): void {
        if (this.popupSettings.popupWrapperClass != null) {
            if (this.popupSettings.popupWrapperClass instanceof Array) {
                this.wrapperClass.set(this.popupSettings.popupWrapperClass.join(" "));
            } else {
                this.wrapperClass.set(this.popupSettings.popupWrapperClass);
            }
        }
    }
}
