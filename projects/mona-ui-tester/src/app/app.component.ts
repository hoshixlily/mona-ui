import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { PopupService, PopupRef, PopupSettings } from "mona-ui";
import { take } from "rxjs";
import { TestComponentComponent } from "./test-component/test-component.component";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    providers: [PopupService]
})
export class AppComponent implements OnInit {
    public contextMenuItemVisible: boolean = true;

    @ViewChild("italicButtonRef", { read: ElementRef })
    public italicButtonRef!: ElementRef<HTMLButtonElement>;

    @ViewChild("popupContentTemplate")
    public readonly popupContentTemplate!: TemplateRef<void>;

    @ViewChild("popupContentTemplate2")
    public readonly popupContentTemplate2!: TemplateRef<void>;

    @ViewChild("testButtonRef", { read: ElementRef })
    public testButtonRef!: ElementRef<HTMLButtonElement>;

    public constructor(public readonly popupService: PopupService) {}

    public ngOnInit(): void {
        // window.setInterval(() => {
        //     this.contextMenuItemVisible = !this.contextMenuItemVisible;
        // }, 3000);
    }

    public onButtonSelectedChange(selected: boolean): void {
        console.log(`Button selected: ${selected}`);
    }

    public onPopupClosed(): void {
        console.log("Popup closed");
    }

    public onPopupOpened(ref: PopupRef): void {
        console.log("Popup opened: ", ref);
    }

    public openPopup(event: MouseEvent): void {
        event.stopPropagation();
        const popupSettings: PopupSettings = {
            anchor: this.testButtonRef,
            closeOnEscape: false,
            content: this.popupContentTemplate,
            popupClass: "popup-noselect",
            hasBackdrop: false,
            width: this.testButtonRef.nativeElement.getBoundingClientRect().width,
            offset: { vertical: 0.5 }
        };
        this.popupService.create(popupSettings);
    }

    public openPopup2(event: MouseEvent): void {
        event.stopPropagation();
        const ref = this.popupService.create({
            anchor: this.italicButtonRef,
            content: TestComponentComponent,
            popupClass: "popup-noselect",
            hasBackdrop: false,
            offset: { horizontal: 0, vertical: 10 }
        });
        ref.closed.pipe(take(1)).subscribe(result => console.log(result));
    }

    public print(value: unknown): void {
        console.log(value);
    }
}
