import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
    PopupRef,
    NodeDragStartEvent,
    NodeDragEvent,
    NodeDropEvent,
    NodeDragEndEvent,
    NodeClickEvent,
    TabCloseEvent,
    StepOptions,
    PopupService,
    WindowService
} from "mona-ui";
import { TestComponentComponent } from "./test-component/test-component.component";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faMoon, faSearch, faSnowflake, faSun } from "@fortawesome/free-solid-svg-icons";
import { IndexableList } from "@mirei/ts-collections";
import { map, Observable } from "rxjs";
import { DateTime } from "luxon";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    public readonly moonIcon: IconDefinition = faMoon;
    public readonly searchIcon: IconDefinition = faSearch;
    public readonly snowflakeIcon: IconDefinition = faSnowflake;
    public readonly sunIcon: IconDefinition = faSun;
    public autoCompleteValue: string = "Yakizakana";
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

    public comboBoxValueNormalizer$ = (text$: Observable<string>): Observable<any> => {
        return text$.pipe(
            map((text: string) => {
                return {
                    text: text,
                    value: Math.random(),
                    group: "Custom",
                    active: true
                };
            })
        );
    };

    public contextMenuItemVisible: boolean = true;
    public dateFormat24Hours: boolean = false;
    public dateTimePickerValue: Date | null = new Date();
    public disabledDates: Date[] = [
        new Date(2023, 0, 1),
        new Date(2023, 0, 2),
        new Date(2023, 0, 3),
        new Date(2023, 0, 13),
        new Date(2023, 0, 23),
        new Date(2023, 0, 17),
        new Date(2023, 1, 21),
        new Date(2023, 1, 28)
    ];
    public dateMax: Date = new Date(2023, 0, 27);
    public dateMin: Date = new Date(2023, 0, 6);
    public dropdownListDataItems: IndexableList<any> = new IndexableList([
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
        { text: "Yakizakana", value: 30, group: "Food", active: true },
        { text: "Pink-flowered native raspberry", value: 31, group: "Fruit", active: true }
    ]);
    public dropdownPartialPrimitiveDataItems: string[] = [];
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
    public menuBarMenuVisible: boolean = false;
    public multiSelectTagCount: number = 2;
    public numericTextBoxValue: number = 629;
    public progressLabelFormatter = (value: number) => `${value}/100`;
    public rangedSliderValues: [number, number] = [12, 18];
    public selectedComboBoxDataItem: any = null;
    public selectedDropdownListDataItem: any;
    public selectedMultiSelectDataItems: any[] = [this.dropdownListDataItems[2], this.dropdownListDataItems[4]];
    public selectedMultiSelectDataItems2: any[] = [
        { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true },
        { text: "REPLACED WITH Okonomiyaki", value: 29, group: "FOODIE", active: true }
    ];
    public selectedPrimitiveComboBoxDataItem: string | null = null;
    public sliderValue: number = 8;
    public switchValue: boolean = false;
    public stepperStep: number = 1;
    public stepperSteps: StepOptions[] = [
        { label: "Cart", data: { cart: true } },
        { label: "Shipping", data: { shipping: true } },
        { label: "Payment", data: { payment: true } },
        { label: "Review", data: { review: true } },
        { label: "Complete" }
    ];
    public textBoxValue: string = "TEXT BOX VALUE";
    public textBoxValue2: string = "a";
    public treeCheckedKeys: string[] = ["1-2", "1-3-1"];

    public treeData: any[] = [
        {
            text: "Root",
            id: "1",
            items: [
                {
                    text: "Fruits",
                    id: "1-1",
                    items: [
                        { text: "Apple", id: "1-1-1", disabled: true },
                        { text: "Apricot", id: "1-1-2", disabled: false },
                        { text: "Banana", id: "1-1-3" },
                        { text: "Cherry", id: "1-1-4", disabled: true }
                    ]
                },
                {
                    text: "Foods",
                    id: "1-2",
                    items: [
                        { text: "Yakisoba", id: "1-2-1" },
                        { text: "Yakitori", id: "1-2-2" },
                        { text: "Sushi", id: "1-2-3" },
                        { text: "Sashimi", id: "1-2-4" }
                    ]
                },
                {
                    text: "Vegetables",
                    id: "1-3",
                    items: [
                        { text: "Cabbage", id: "1-3-1" },
                        { text: "Cabbage Black", id: "1-3-2" },
                        { text: "Pumpkin", id: "1-3-3" },
                        { text: "Potato", id: "1-3-4" }
                    ]
                },
                {
                    text: "Trees",
                    id: "1-4",
                    items: [
                        { text: "Willow", id: "1-4-1" },
                        { text: "Birch", id: "1-4-2" },
                        { text: "Oak", id: "1-4-3" },
                        { text: "Pine", id: "1-4-4" },
                        { text: "Maple", id: "1-4-5" },
                        { text: "Cedar", id: "1-4-6" }
                    ]
                }
            ]
        }
    ];

    public treeDisabledKeys: string[] = ["1-1-1", "1-1-4", "1-4"];
    public treeExpandedKeys: string[] = ["1", "1-1", "1-2", "1-3", "1-4"];
    public treeSelectedKeys: string[] = [
        /*"1-2-1", "1-2-2", "1-2-3", "1-2-4"*/
    ];

    public windowHeight: number = 333;
    public windowLeft: number = 444;
    public windowTop: number = 555;
    public windowVisible: boolean = false;
    public windowVisible2: boolean = false;
    public windowWidth: number = 555;

    @ViewChild("italicButtonRef", { read: ElementRef })
    public italicButtonRef!: ElementRef<HTMLButtonElement>;

    @ViewChild("popupContentTemplate")
    public readonly popupContentTemplate!: TemplateRef<void>;

    @ViewChild("popupContentTemplate2")
    public readonly popupContentTemplate2!: TemplateRef<void>;

    @ViewChild("testButtonRef", { read: ElementRef })
    public testButtonRef!: ElementRef<HTMLButtonElement>;

    public constructor(private readonly popupService: PopupService, public readonly windowService: WindowService) {}

    public dropdownItemDisabler = (item: any): boolean => !item.active;
    public dropdownPrimitiveItemDisabler = (item: string): boolean => item.includes("i");

    // public ngAfterContentChecked(): void {
    //     console.log("ngAfterContentChecked :: AppComponent");
    // }

    public ngOnInit(): void {
        this.selectedDropdownListDataItem = { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true };
        this.selectedComboBoxDataItem = { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true };
        // window.setInterval(() => {
        //     // this.contextMenuItemVisible = !this.contextMenuItemVisible;
        //     // this.dropdownItemDisabler = (item: any): boolean => item.value % 3 === 0;
        // }, 3000);
        this.selectedDropdownListDataItem = { ...this.dropdownListDataItems[4] };
        this.selectedPrimitiveComboBoxDataItem = this.dropdownPrimitiveDataItems[7];

        this.dropdownPartialPrimitiveDataItems = this.dropdownPrimitiveDataItems.slice();

        // window.setInterval(() => {
        //     const randomIndex = Math.floor(Math.random() * this.dropdownListDataItems.length);
        //     const randomIndex2 = Math.floor(Math.random() * this.dropdownListDataItems.length);
        //     this.dropdownPartialPrimitiveDataItems = this.dropdownPrimitiveDataItems.slice(
        //         Math.min(randomIndex, randomIndex2),
        //         Math.max(randomIndex, randomIndex2)
        //     );
        // }, 3000);

        // window.setInterval(() => {
        //     this.updateTreeData();
        // }, 2000);

        // window.setInterval(() => {
        //     this.dateMax = DateTime.fromJSDate(this.dateMax).plus({ days: 1 }).toJSDate();
        //     this.dateMin = DateTime.fromJSDate(this.dateMin).plus({ days: 1 }).toJSDate();
        // }, 5000);

        // window.setInterval(() => {
        //     this.menuBarMenuVisible = !this.menuBarMenuVisible;
        // }, 1000);

        // window.setInterval(() => {
        //     this.windowVisible = !this.windowVisible;
        // }, 2500);
    }

    public numericTextBoxFormatter = (value: number | null): string => (value != null ? `${value} °C` : "");

    public generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public onAutoCompleteValueChange(value: string): void {
        console.log("Auto-complete value changed: ", value);
    }

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

    public onDateTimePickerValueChange(value: Date | null): void {
        console.log(value);
    }

    public onDropDownValueChange(value: unknown): void {
        this.selectedDropdownListDataItem = value;
        console.log(`Dropdown value changed`, value);
        // console.log(value);
    }

    public onMultiSelectValueChange(value: unknown[]): void {
        console.log(`MultiSelect value changed`, value);
        this.selectedMultiSelectDataItems = value;
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

    public onStepperStepChange(value: number): void {
        console.log(value);
        this.stepperStep = value;
    }

    public onSwitchValueChange(value: boolean): void {
        // console.log(value);
        this.switchValue = value;
        this.menuBarMenuVisible = value;
    }

    public onTabStripTabClose(event: TabCloseEvent): void {
        console.log(event);
        this.dropdownPrimitiveDataItems.splice(event.index - 1, 1);
        this.dropdownPrimitiveDataItems = [...this.dropdownPrimitiveDataItems];
    }

    public onTextBoxValueChange(value: string): void {
        // console.log(value);
        this.textBoxValue = value;
    }

    public onTreeCheckedKeysChange(checkedKeys: string[]): void {
        console.log(checkedKeys);
        this.treeCheckedKeys = checkedKeys;
    }

    public onTreeDisabledKeysChange(disabledKeys: string[]): void {
        console.log(disabledKeys);
        this.treeDisabledKeys = disabledKeys;
    }

    public onTreeExpandedKeysChange(expandedKeys: string[]): void {
        console.log(expandedKeys);
        this.treeExpandedKeys = expandedKeys;
    }

    public onTreeNodeClick(event: NodeClickEvent): void {
        console.log(event);
        // event.preventDefault();
    }

    public onTreeNodeDoubleClick(event: NodeClickEvent): void {
        console.log(event);
        event.preventDefault();
    }

    public onTreeNodeDrag(event: NodeDragEvent): void {
        // console.log(event);
        // event.preventDefault();
    }

    public onTreeNodeDragEnd(event: NodeDragEndEvent): void {
        console.log(event);
    }

    public onTreeNodeDragStart(event: NodeDragStartEvent): void {
        // console.log(event);
        // event.preventDefault();
    }

    public onTreeNodeDrop(event: NodeDropEvent): void {
        console.log(event);
        if (event.destinationNode?.text === "Pine" && event.position === "inside") {
            event.preventDefault();
        }
    }

    public onTreeSelectedKeysChange(selectedKeys: string[]): void {
        console.log(selectedKeys);
        this.treeSelectedKeys = selectedKeys;
    }

    public openPopup(event: MouseEvent): void {
        // event.stopPropagation();
        // const popupSettings: PopupSettings = {
        //     anchor: this.testButtonRef,
        //     closeOnEscape: false,
        //     content: this.popupContentTemplate,
        //     popupClass: "popup-noselect",
        //     hasBackdrop: false,
        //     width: this.testButtonRef.nativeElement.getBoundingClientRect().width,
        //     offset: { vertical: 0.5 }
        // };
        // this.popupService.create(popupSettings);
    }

    public openPopup2(event: MouseEvent): void {
        event.stopPropagation();
        const prevented = 5;
        const ref = this.popupService.create({
            anchor: this.italicButtonRef,
            content: TestComponentComponent,
            popupClass: "popup-noselect",
            hasBackdrop: true,
            offset: { horizontal: 0, vertical: 1 },
            preventClose: event => {
                console.log(event);
                return event.via === "backdropClick";
            }
        });
    }

    public openWindow(windowContentTemplate: TemplateRef<void>, titleTemplate?: TemplateRef<void>): void {
        const ref = this.windowService.open({
            content: TestComponentComponent,
            height: 600,
            width: 800,
            draggable: true,
            resizable: true,
            modal: true,
            minWidth: 150,
            minHeight: 150,
            maxWidth: 1200,
            maxHeight: 768,
            title: titleTemplate,
            preventClose: event => {
                // console.log(event);
                return event.via === "backdropClick";
            }
        });
        // window.setTimeout(() => {
        //     ref.resize({ width: 1024, height: 768, center: true });
        //     console.log(ref.component?.instance);
        //     // window.setTimeout(() => ref.close(), 2500);
        //     ref.popupRef.closed.subscribe(console.log);
        // }, 2500);
        // ref.closed$.subscribe(console.log);
        // window.setTimeout(() => {
        //     ref.close("Aoi");
        // }, 1500);

        // window.setTimeout(() => {
        //     ref.move({ top: 100, left: 100 });
        //     ref.resize({ width: 333, height: 333, center: false });
        // }, 3333);

        // window.setTimeout(() => {
        //     ref.resize({ width: 333, height: 333, center: true });
        // }, 4444);

        // window.setTimeout(() => {
        //     ref.center();
        //     window.setTimeout(() => {
        //         ref.close();
        //     }, 4444);
        // }, 5000);
    }

    public print(value: unknown): void {
        console.log(value);
    }

    public progressBarColorSelector(value: number): string {
        if (value < 25) {
            return "red";
        } else if (value < 50) {
            return "orange";
        } else if (value < 75) {
            return "yellow";
        } else {
            return "green";
        }
    }

    public updateTreeData(): void {
        this.treeData = [
            ...this.treeData,
            {
                text: Math.random().toString(),
                id: Math.random().toString(),
                items: [{ text: "New 2", id: Math.random().toString(), disabled: Math.random() * 100 < 50 }]
            }
        ];
    }
}
