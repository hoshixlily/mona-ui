import { Component, ElementRef, TemplateRef, ViewChild } from "@angular/core";
import { PopupService } from "mona-ui";
import { take } from "rxjs";
import { TestComponentComponent } from "./test-component/test-component.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    providers: [PopupService]
})
export class AppComponent {
    @ViewChild("italicButtonRef", { read: ElementRef })
    public italicButtonRef!: ElementRef<HTMLButtonElement>;

    @ViewChild("popupContentTemplate")
    public readonly popupContentTemplate!: TemplateRef<void>;

    @ViewChild("popupContentTemplate2")
    public readonly popupContentTemplate2!: TemplateRef<void>;

    @ViewChild("testButtonRef", { read: ElementRef })
    public testButtonRef!: ElementRef<HTMLButtonElement>;

    public constructor(public readonly popupService: PopupService) {}

    public onButtonSelectedChange(selected: boolean): void {
        console.log(`Button selected: ${selected}`);
    }

    public openPopup(): void {
        const ref = this.popupService.create({
            anchor: this.testButtonRef,
            content: this.popupContentTemplate,
            popupClass: "popup-noselect",
            hasBackdrop: false
        });
        ref.closed.pipe(take(1)).subscribe(result => console.log(result));
    }

    public openPopup2(): void {
        const ref = this.popupService.create({
            anchor: this.italicButtonRef,
            content: TestComponentComponent,
            popupClass: "popup-noselect",
            hasBackdrop: false,
            offset: { horizontal: 0, vertical: 10 }
        });
        ref.closed.pipe(take(1)).subscribe(result => console.log(result));
    }
}
