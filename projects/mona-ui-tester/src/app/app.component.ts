import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { PopupRef, PopupService, PopupSettings } from "mona-ui";
import { TestComponentComponent } from "./test-component/test-component.component";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faMoon, faSearch, faSnowflake, faSun } from "@fortawesome/free-solid-svg-icons";
import { Enumerable, Group, List } from "@mirei/ts-collections";
// import { PopupListItem } from "../../../../dist/mona-ui/lib/shared/data/PopupListItem";

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
        { text: "Cherry", value: 1, group: "Fruit", active: true },
        { text: "Cabbage", value: 2, group: "Vegetable", active: true },
        { text: "Grilled Meat", value: 3, group: "Food", active: true },
        { text: "Plum", value: 4, group: "Fruit", active: true },
        { text: "Banana", value: 5, group: "Fruit", active: true },
        { text: "Cabbage Black", value: 6, group: "Vegetable", active: true },
        { text: "Quince", value: 7, group: "Fruit", active: true },
        { text: "Pineapple", value: 8, group: "Fruit", active: true },
        { text: "Pumpkin", value: 9, group: "Vegetable", active: false },
        { text: "Peach", value: 10, group: "Fruit", active: false },
        { text: "Pear", value: 11, group: "Fruit", active: true },
        { text: "Pomegranate", value: 12, group: "Fruit", active: true },
        { text: "Paprika", value: 13, group: "Vegetable", active: true },
        { text: "Potato", value: 14, group: "Vegetable", active: false },
        { text: "Raspberry", value: 15, group: "Fruit", active: true },
        { text: "Strawberry", value: 16, group: "Fruit", active: true },
        { text: "Tomato", value: 17, group: "Vegetable", active: true },
        { text: "Watermelon", value: 18, group: "Fruit", active: true },
        { text: "Zucchini", value: 19, group: "Vegetable", active: true },
        { text: "Apple", value: 20, group: "Fruit", active: true },
        { text: "Apricot", value: 21, group: "Fruit", active: true },
        { text: "Yakisoba", value: 22, group: "Food", active: true },
        { text: "Yakitori", value: 23, group: "Food", active: true },
        { text: "Sushi", value: 24, group: "Food", active: false },
        { text: "Sashimi", value: 25, group: "Food", active: true },
        { text: "Soba", value: 26, group: "Food", active: false },
        { text: "Ramen", value: 27, group: "Food", active: true },
        { text: "Onigiri", value: 28, group: "Food", active: true },
        { text: "Okonomiyaki", value: 29, group: "Food", active: true },
        { text: "Yakizakana", value: 30, group: "Food", active: true }
    ];
    public dropdownPrimitiveDataItems: string[] = [
        "Willow",
        "Birch",
        "Oak",
        "Pine",
        "Maple",
        "Cedar",
        "Elm",
        "Hemlock",
        "Spruce",
        "Cypress",
        "Fir",
        "Larch",
        "Beech",
        "Ash",
        "Hazel",
        "Hawthorn",
        "Holly",
        "Hornbeam",
        "Horse Chestnut",
        "Linden",
        "Maidenhair Tree"
    ];
    // public groupedDropdownListDataItems: List<Group<string, PopupListItem>> = new List<Group<string, PopupListItem>>([
    //     new Group<string, PopupListItem>(
    //         "",
    //         Enumerable.from(this.dropdownListDataItems)
    //             .select(d => {
    //                 return {
    //                     data: d,
    //                     text: d.text,
    //                     value: d.value
    //                 } as PopupListItem;
    //             })
    //             .toList()
    //     )
    // ]);

    public numericTextBoxValue: number = 629;
    public rangedSliderValues: [number, number] = [12, 18];
    public selectedComboBoxDataItem: any = null;
    public selectedDropdownListDataItem: any;
    public selectedMultiSelectDataItems: any[] = [this.dropdownListDataItems[2], this.dropdownListDataItems[4]];
    public selectedMultiSelectDataItems2: any[] = [
        { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true },
        { text: "REPLACED WITH Okonomiyaki", value: 29, group: "FOODIE", active: true }
    ];
    public sliderValue: number = 8;
    public switchValue: boolean = false;
    public textBoxValue: string = "TEXT BOX VALUE";
    public textBoxValue2: string = "a";

    @ViewChild("italicButtonRef", { read: ElementRef })
    public italicButtonRef!: ElementRef<HTMLButtonElement>;

    @ViewChild("popupContentTemplate")
    public readonly popupContentTemplate!: TemplateRef<void>;

    @ViewChild("popupContentTemplate2")
    public readonly popupContentTemplate2!: TemplateRef<void>;

    @ViewChild("testButtonRef", { read: ElementRef })
    public testButtonRef!: ElementRef<HTMLButtonElement>;

    public constructor(public readonly popupService: PopupService) {}

    public dropdownItemDisabler = (item: any): boolean => !item.active;

    public ngOnInit(): void {
        this.selectedDropdownListDataItem = { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true };
        this.selectedComboBoxDataItem = { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true };
        window.setInterval(() => {
            // this.contextMenuItemVisible = !this.contextMenuItemVisible;
            // this.dropdownItemDisabler = (item: any): boolean => item.value % 3 === 0;
        }, 3000);
    }

    public numericTextBoxFormatter = (value: number | null): string => (value != null ? `${value} °C` : "");

    public onButtonSelectedChange(selected: boolean): void {
        // console.log(`Button selected: ${selected}`);
    }

    public onColorPickerValueChange(value: string | null): void {
        this.colorPickerValue = value;
        console.log(value);
    }

    public onComboBoxValueChange(value: unknown): void {
        this.selectedComboBoxDataItem = value;
        console.log(`Combobox value changed`, value);
    }

    public onDropDownValueChange(value: unknown): void {
        this.selectedDropdownListDataItem = value;
        console.log(`Dropdown value changed`, value);
        // console.log(value);
    }

    public onMultiSelectValueChange(value: unknown[]): void {
        console.log(`MultiSelect value changed`, value);
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
