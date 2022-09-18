import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { PopupRef, PopupService, PopupSettings } from "mona-ui";
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

    public colorPalette: string[] = [
        "#263400",
        "#d61dff",
        "#009700",
        "#003ef0",
        "#c1ca5a",
        "#004dcf",
        "#3e6f00",
        "#d444c6",
        "#002b00",
        "#ff007f",
        "#008981",
        "#c4000c",
        "#00c9ff",
        "#c32f00",
        "#0086fc",
        "#ff6134",
        "#00369b",
        "#ffbe73",
        "#002b7c",
        "#ce773a",
        "#ab8bff",
        "#514700",
        "#dbbfff",
        "#003819",
        "#97001f",
        "#c8ebff",
        "#4d0000",
        "#f5ecf2",
        "#001c1c",
        "#ffd4c2",
        "#00281c",
        "#bd4b75",
        "#00331f",
        "#80519a",
        "#302d00",
        "#0078bb",
        "#481100",
        "#a37b5f",
        "#4d162f",
        "#57503a"
    ];

    public colorPaletteValue: string = "#fb9a99";
    public colorPickerValue: string | null = "#0086fc";

    public contextMenuItemVisible: boolean = true;
    public dropdownListDataItems: any[] = [
        { text: "Item 1", value: 1, group: "Artistic", active: false },
        { text: "Item 2", value: 2, group: "Bizarre", active: true },
        { text: "Item 3", value: 3, group: "Curious", active: false },
        { text: "Item 4", value: 4, group: "Artistic", active: false },
        { text: "Item 5", value: 5, group: "Artistic", active: true }
    ];
    public numericTextBoxValue: number = 629;
    public rangedSliderValues: [number, number] = [12, 18];
    public selectedDropdownListDataItem: any;
    public sliderValue: number = 8;
    public switchValue: boolean = false;
    public textBoxValue: string = "TEXT BOX VALUE";

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
        this.selectedDropdownListDataItem = this.dropdownListDataItems[2];
        // window.setInterval(() => {
        //     this.contextMenuItemVisible = !this.contextMenuItemVisible;
        // }, 3000);
    }

    public numericTextBoxFormatter = (value: number | null): string => (value != null ? `${value} °C` : "");

    public onButtonSelectedChange(selected: boolean): void {
        // console.log(`Button selected: ${selected}`);
    }

    public onColorPickerValueChange(value: string | null): void {
        this.colorPickerValue = value;
        console.log(value);
    }

    public onDropDownValueChange(value: unknown): void {
        this.selectedDropdownListDataItem = value;
        // console.log(`Dropdown value changed`);
        // console.log(value);
    }

    public onPopupClose(): void {
        // console.log("Popup closed");
    }

    public onPopupOpen(ref: PopupRef): void {
        // console.log("Popup opened: ", ref);
    }

    public onRangedSliderValueChange(value: [number, number]): void {
        console.log(value);
        this.rangedSliderValues = value;
    }

    public onSliderValueChange(value: number): void {
        console.log(value);
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
