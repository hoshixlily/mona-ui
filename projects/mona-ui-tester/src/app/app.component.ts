import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { PopupService, PopupRef, PopupSettings } from "mona-ui";
import { take } from "rxjs";
import { TestComponentComponent } from "./test-component/test-component.component";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faMoon, faSearch, faSnowflake, faSun } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    providers: [PopupService]
})
export class AppComponent implements OnInit {
    public readonly moonIcon: IconDefinition = faMoon;
    public readonly searchIcon: IconDefinition = faSearch;
    public readonly snowflakeIcon: IconDefinition = faSnowflake;
    public readonly sunIcon: IconDefinition = faSun;
    public contextMenuItemVisible: boolean = true;
    public numericTextBoxValue: number = 629;
    public rangedSliderValues: [number, number] = [6, 22];
    public sliderValue: number = 14;
    public switchValue: boolean = false;
    public textBoxValue: string = "TEXT BOX VALUE";

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

    public numericTextBoxFormatter = (value: number | null): string => (value != null ? `${value} °C` : "");

    public onButtonSelectedChange(selected: boolean): void {
        // console.log(`Button selected: ${selected}`);
    }

    public onDropDownValueChange(value: unknown): void {
        // console.log(`Dropdown value changed`);
        // console.log(value);
    }

    public onPopupClose(): void {
        // console.log("Popup closed");
    }

    public onPopupOpen(ref: PopupRef): void {
        // console.log("Popup opened: ", ref);
    }

    public onRangedSliderValueChange(value: number | [number, number]): void {
        // console.log(value);
        this.rangedSliderValues = value as [number, number];
    }

    public onSliderValueChange(value: number): void {
        // console.log(value);
        this.sliderValue = value;
    }

    public onSwitchValueChange(value: boolean): void {
        // console.log(value);
        this.switchValue = value;
    }

    public onTextBoxValueChange(value: string): void {
        // console.log(value);
        this.textBoxValue = value;
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
