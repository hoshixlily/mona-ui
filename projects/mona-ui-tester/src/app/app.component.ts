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

    public dropdownListDataItems: any[] = [
        { text: "Item 1", value: 1, group: "Artistic", disabled: false },
        { text: "Item 2", value: 2, group: "Bizarre", disabled: true },
        { text: "Item 3", value: 3, group: "Curious", disabled: true },
        { text: "Item 4", value: 4, group: "Artistic", disabled: false },
        { text: "Item 5", value: 5, group: "Artistic", disabled: true }
    ];

    @ViewChild("italicButtonRef", { read: ElementRef })
    public italicButtonRef!: ElementRef<HTMLButtonElement>;

    @ViewChild("popupContentTemplate")
    public readonly popupContentTemplate!: TemplateRef<void>;

    @ViewChild("popupContentTemplate2")
    public readonly popupContentTemplate2!: TemplateRef<void>;

    @ViewChild("testButtonRef", { read: ElementRef })
    public testButtonRef!: ElementRef<HTMLButtonElement>;

    public constructor(public readonly popupService: PopupService) {}

    public dropdownItemDisabler = (item: any): boolean => item.value % 2 === 0;

    public ngOnInit(): void {
        // window.setInterval(() => {
        //     this.contextMenuItemVisible = !this.contextMenuItemVisible;
        // }, 3000);
    }

    public onButtonSelectedChange(selected: boolean): void {
        console.log(`Button selected: ${selected}`);
    }

    public onDropDownValueChange(value: unknown): void {
        // console.log(`Dropdown value changed`);
        console.log(value);
    }

    public onPopupClose(): void {
        console.log("Popup closed");
    }

    public onPopupOpen(ref: PopupRef): void {
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
    }

    public print(value: unknown): void {
        console.log(value);
    }
}
