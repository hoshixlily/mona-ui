import { Component, TemplateRef } from "@angular/core";

@Component({
    selector: "mona-popup-wrapper",
    templateUrl: "./popup-wrapper.component.html",
    styleUrls: ["./popup-wrapper.component.scss"]
})
export class PopupWrapperComponent {
    public templateRef: TemplateRef<any> | null = null;
}
