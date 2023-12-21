import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Host,
    HostBinding,
    Inject,
    OnInit,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
import { PopupSettingsInjectionToken } from "../../models/PopupInjectionToken";
import { PopupSettings } from "../../models/PopupSettings";
import { NgClass, NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "mona-popup-wrapper",
    templateUrl: "./popup-wrapper.component.html",
    styleUrls: ["./popup-wrapper.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgTemplateOutlet]
})
export class PopupWrapperComponent implements OnInit, AfterViewInit {
    public templateRef: TemplateRef<any> | null = null;
    public visible: WritableSignal<boolean> = signal(false);
    public wrapperClass: WritableSignal<string> = signal("");

    @HostBinding("class.mona-popup-wrapper")
    protected get hostClass(): boolean {
        return true;
    }

    public constructor(
        @Inject(PopupSettingsInjectionToken)
        private readonly popupSettings: PopupSettings,
        private readonly host: ElementRef<HTMLElement>
    ) {}

    public ngAfterViewInit(): void {
        if (this.wrapperClass()) {
            this.host.nativeElement.classList.add(this.wrapperClass());
        }
    }

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
