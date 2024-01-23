import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faFilter,
    faHeart,
    faHome,
    faMoon,
    faSearch,
    faSnowflake,
    faStar,
    faSun,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import { Enumerable, ImmutableList, IndexableList } from "@mirei/ts-collections";
import { DateTime } from "luxon";
import {
    AutoCompleteComponent,
    AvatarComponent,
    BreadcrumbComponent,
    BreadcrumbItem,
    BreadcrumbItemTemplateDirective,
    BreadcrumbSeparatorTemplateDirective,
    ButtonDirective,
    ButtonGroupComponent,
    CalendarComponent,
    CellEditEvent,
    ChipComponent,
    CircularProgressBarComponent,
    CircularProgressBarLabelTemplateDirective,
    ColorGradientComponent,
    ColorPaletteComponent,
    ColorPickerComponent,
    ComboBoxComponent,
    ComboBoxFooterTemplateDirective,
    ComboBoxGroupHeaderTemplateDirective,
    ComboBoxHeaderTemplateDirective,
    ComboBoxItemTemplateDirective,
    ComboBoxNoDataTemplateDirective,
    CompositeFilterDescriptor,
    ContextMenuComponent,
    DatePickerComponent,
    DateTimePickerComponent,
    DialogService,
    DropDownButtonComponent,
    DropDownFilterableDirective,
    DropDownGroupableDirective,
    DropDownListComponent,
    DropDownListFooterTemplateDirective,
    DropDownListGroupHeaderTemplateDirective,
    DropDownListHeaderTemplateDirective,
    DropDownListItemTemplateDirective,
    DropDownListNoDataTemplateDirective,
    DropDownListValueTemplateDirective,
    DropDownTreeComponent,
    DropDownTreeDisableDirective,
    DropDownTreeExpandableDirective,
    DropDownTreeFilterableDirective,
    DropDownTreeFooterTemplateDirective,
    DropDownTreeHeaderTemplateDirective,
    DropDownTreeNoDataTemplateDirective,
    DropDownTreeNodeTemplateDirective,
    ExpansionPanelActionsTemplateDirective,
    ExpansionPanelComponent,
    ExpansionPanelTitleTemplateDirective,
    FieldsetComponent,
    FieldsetLegendTemplateDirective,
    FilterChangeEvent,
    FilterMenuComponent,
    FilterMenuValue,
    GridCellTemplateDirective,
    GridColumnComponent,
    GridColumnTitleTemplateDirective,
    GridComponent,
    GridEditableDirective,
    GridSelectableDirective,
    ListBoxActionClickEvent,
    ListBoxComponent,
    ListBoxItemTemplateDirective,
    ListViewComponent,
    ListViewFooterTemplateDirective,
    ListViewGroupableDirective,
    ListViewGroupHeaderTemplateDirective,
    ListViewHeaderTemplateDirective,
    ListViewItemTemplateDirective,
    ListViewNavigableDirective,
    ListViewPageableDirective,
    ListViewSelectableDirective,
    ListViewVirtualScrollDirective,
    MenubarComponent,
    MenuComponent,
    MenuItemComponent,
    MenuItemIconTemplateDirective,
    MenuItemTextTemplateDirective,
    MultiSelectComponent,
    MultiSelectFooterTemplateDirective,
    MultiSelectGroupHeaderTemplateDirective,
    MultiSelectHeaderTemplateDirective,
    MultiSelectItemTemplateDirective,
    MultiSelectNoDataTemplateDirective,
    MultiSelectSummaryTagDirective,
    MultiSelectSummaryTagTemplateDirective,
    MultiSelectTagTemplateDirective,
    NodeCheckEvent,
    NodeClickEvent,
    NodeDragEndEvent,
    NodeDragEvent,
    NodeDragStartEvent,
    NodeDropEvent,
    NodeSelectEvent,
    NotificationService,
    NumericTextBoxComponent,
    NumericTextBoxPrefixTemplateDirective,
    PageChangeEvent,
    PageSizeChangeEvent,
    PopoverComponent,
    PopoverFooterTemplateDirective,
    PopoverHideEvent,
    PopoverShowEvent,
    PopoverShownEvent,
    PopoverTitleTemplateDirective,
    PopupRef,
    PopupService,
    ProgressBarComponent,
    Query,
    RangeSliderComponent,
    RangeSliderTickValueTemplateDirective,
    ScrollViewComponent,
    SlicePipe,
    SliderComponent,
    SliderTickValueTemplateDirective,
    SortableOptions,
    SortDescriptor,
    SplitButtonComponent,
    SplitButtonTextTemplateDirective,
    SplitterComponent,
    SplitterPaneComponent,
    StepOptions,
    StepperComponent,
    StepperIndicatorTemplateDirective,
    StepperLabelTemplateDirective,
    StepperStepTemplateDirective,
    SwitchComponent,
    SwitchOffLabelTemplateDirective,
    SwitchOnLabelTemplateDirective,
    TabCloseEvent,
    TabComponent,
    TabContentTemplateDirective,
    TabStripComponent,
    TabTitleTemplateDirective,
    TextBoxComponent,
    TextBoxDirective,
    TextBoxPrefixTemplateDirective,
    TextBoxSuffixTemplateDirective,
    TimePickerComponent,
    TooltipComponent,
    TreeViewCheckableDirective,
    TreeViewComponent,
    TreeViewDisableDirective,
    TreeViewExpandableDirective,
    TreeViewFilterableDirective,
    TreeViewNodeTemplateDirective,
    TreeViewSelectableDirective,
    WindowService
} from "mona-ui";
import { debounceTime, map, Observable, of, take, timer } from "rxjs";
import { v4 } from "uuid";
import { ListViewNoDataTemplateDirective } from "../../../mona-ui/src/lib/list-view/directives/list-view-no-data-template.directive";
import { GridOrderData } from "./GridOrderData";
import { GridProductData } from "./GridProductData";
import { TestComponentComponent } from "./test-component/test-component.component";

interface TreeNodeDataItem {
    id: string;
    text: string;
    items: TreeNodeDataItem[];
    disabled?: boolean;
}

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [
        AutoCompleteComponent,
        AvatarComponent,
        BreadcrumbComponent,
        BreadcrumbItemTemplateDirective,
        BreadcrumbSeparatorTemplateDirective,
        ButtonGroupComponent,
        ButtonDirective,
        CalendarComponent,
        CircularProgressBarComponent,
        CircularProgressBarLabelTemplateDirective,
        ColorGradientComponent,
        ColorPaletteComponent,
        ColorPickerComponent,
        ComboBoxComponent,
        ComboBoxFooterTemplateDirective,
        ComboBoxHeaderTemplateDirective,
        ComboBoxGroupHeaderTemplateDirective,
        ComboBoxItemTemplateDirective,
        ComboBoxNoDataTemplateDirective,
        CommonModule,
        ContextMenuComponent,
        DatePickerComponent,
        DateTimePickerComponent,
        DropDownButtonComponent,
        DropDownFilterableDirective,
        DropDownGroupableDirective,
        DropDownListComponent,
        DropDownListFooterTemplateDirective,
        DropDownListGroupHeaderTemplateDirective,
        DropDownListHeaderTemplateDirective,
        DropDownListItemTemplateDirective,
        DropDownListNoDataTemplateDirective,
        DropDownListValueTemplateDirective,
        ExpansionPanelComponent,
        ExpansionPanelActionsTemplateDirective,
        ExpansionPanelTitleTemplateDirective,
        FieldsetComponent,
        FieldsetLegendTemplateDirective,
        FontAwesomeModule,
        FormsModule,
        GridComponent,
        GridCellTemplateDirective,
        GridColumnComponent,
        GridColumnTitleTemplateDirective,
        GridEditableDirective,
        GridSelectableDirective,
        ListBoxComponent,
        ListBoxItemTemplateDirective,
        ListViewComponent,
        ListViewSelectableDirective,
        ListViewItemTemplateDirective,
        ListViewVirtualScrollDirective,
        ListViewFooterTemplateDirective,
        ListViewGroupableDirective,
        ListViewGroupHeaderTemplateDirective,
        ListViewHeaderTemplateDirective,
        ListViewNavigableDirective,
        ListViewNoDataTemplateDirective,
        ListViewPageableDirective,
        MenubarComponent,
        MenuComponent,
        MenuItemComponent,
        MenuItemIconTemplateDirective,
        MenuItemTextTemplateDirective,
        MultiSelectComponent,
        MultiSelectFooterTemplateDirective,
        MultiSelectGroupHeaderTemplateDirective,
        MultiSelectHeaderTemplateDirective,
        MultiSelectItemTemplateDirective,
        MultiSelectNoDataTemplateDirective,
        MultiSelectSummaryTagDirective,
        MultiSelectSummaryTagTemplateDirective,
        MultiSelectTagTemplateDirective,
        NgOptimizedImage,
        NumericTextBoxComponent,
        NumericTextBoxPrefixTemplateDirective,
        PopoverComponent,
        PopoverFooterTemplateDirective,
        PopoverTitleTemplateDirective,
        ProgressBarComponent,
        RangeSliderComponent,
        RangeSliderTickValueTemplateDirective,
        ScrollViewComponent,
        SlicePipe,
        SliderComponent,
        SliderTickValueTemplateDirective,
        SplitButtonComponent,
        SplitButtonTextTemplateDirective,
        SplitterComponent,
        SplitterPaneComponent,
        StepperComponent,
        StepperIndicatorTemplateDirective,
        StepperLabelTemplateDirective,
        StepperStepTemplateDirective,
        SwitchComponent,
        SwitchOffLabelTemplateDirective,
        SwitchOnLabelTemplateDirective,
        TabComponent,
        TabContentTemplateDirective,
        TabTitleTemplateDirective,
        TabStripComponent,
        TextBoxComponent,
        TextBoxDirective,
        TextBoxPrefixTemplateDirective,
        TextBoxSuffixTemplateDirective,
        TimePickerComponent,
        TooltipComponent,
        TreeViewCheckableDirective,
        TreeViewComponent,
        TreeViewDisableDirective,
        TreeViewExpandableDirective,
        TreeViewFilterableDirective,
        TreeViewSelectableDirective,
        TreeViewNodeTemplateDirective,
        ChipComponent,
        DropDownTreeComponent,
        DropDownTreeDisableDirective,
        DropDownTreeExpandableDirective,
        DropDownTreeFilterableDirective,
        DropDownTreeFooterTemplateDirective,
        DropDownTreeHeaderTemplateDirective,
        DropDownTreeNoDataTemplateDirective,
        DropDownTreeNodeTemplateDirective
    ]
})
export class AppComponent implements OnInit {
    public readonly closeIcon: IconDefinition = faTimes;
    public readonly filterIcon: IconDefinition = faFilter;
    public readonly heartIcon: IconDefinition = faHeart;
    public readonly homeIcon: IconDefinition = faHome;
    public readonly moonIcon: IconDefinition = faMoon;
    public readonly searchIcon: IconDefinition = faSearch;
    public readonly snowflakeIcon: IconDefinition = faSnowflake;
    public readonly starIcon: IconDefinition = faStar;
    public readonly sunIcon: IconDefinition = faSun;
    public autoCompleteValue: string = "Yakizakana";
    public breadcrumbItems: BreadcrumbItem[] = [
        { text: "Home", title: "Home" },
        { text: "Products", title: "Products" },
        { text: "Fruits", title: "Fruits" },
        { text: "Quince", title: "Quince" }
    ];
    public breadcrumbViewItems: BreadcrumbItem[] = this.breadcrumbItems;
    public buttonGroupButtonSelected: boolean = true;
    public calendarDisabledDates: WritableSignal<Date[]> = signal([]);
    public calendarMaxValue: WritableSignal<Date | null> = signal(null); // new Date(2022, 6, 15);
    public calendarMinValue: WritableSignal<Date | null> = signal(null); //new Date(2022, 6, 10);
    public calendarValue: Date | null = new Date(2023, 8, 16);
    public colorGradientColor: string = "#4d0f33";
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
    public colorPickerValue: string | null = "#7D3C98";

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

    public datePickerMaxValue: Date = new Date(2023, 7, 10);
    public datePickerMinValue: Date = new Date(2023, 6, 10);
    public datePickerValue: Date | null = new Date();

    public dateTimePickerMaxValue: Date = new Date(2019, 2, 15, 11, 30);
    public dateTimePickerMinValue: Date = new Date(2019, 2, 10, 12, 30);
    public dateTimePickerValue: Date | null = new Date(2019, 2, 16, 21, 40);

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
    public dropdownListDataItems: ImmutableList<any> = ImmutableList.create([
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

    public filterMenuValue: FilterMenuValue = {
        value1: "Item 2",
        value2: "Item 63",
        logic: "or"
    };

    public gridFilters: CompositeFilterDescriptor[] = [
        // {
        //     logic: "or",
        //     filters: [
        //         {
        //             field: "ShipCountry",
        //             operator: "startswith",
        //             value: "A"
        //         },
        //         {
        //             field: "ShipCountry",
        //             operator: "startswith",
        //             value: "E"
        //         }
        //     ]
        // },
        // {
        //     logic: "and",
        //     filters: [
        //         {
        //             field: "ShipCity",
        //             operator: "contains",
        //             value: "z"
        //         }
        //     ]
        // }
    ];

    public gridOrderColumns: any[] = [
        { field: "OrderID", title: "Order ID", filterType: "number" },
        { field: "ShipCountry", title: "Ship Country", filterType: "string" },
        { field: "OrderDate", title: "Order Date", filterType: "date" },
        { field: "Freight", title: "Freight", filterType: "number" },
        // { field: "CustomerID", title: "Customer ID", filterType: "string" },
        // { field: "EmployeeID", title: "Employee ID", filterType: "number" },
        // { field: "RequiredDate", title: "Required Date", filterType: "date" },
        { field: "ShippedDate", title: "Shipped Date", filterType: "date" },
        // { field: "ShipVia", title: "Ship Via", filterType: "number" },
        { field: "ShipName", title: "Ship Name", filterType: "string" },
        // { field: "ShipAddress", title: "Ship Address", filterType: "string" },
        { field: "ShipCity", title: "Ship City", filterType: "string" },
        { field: "ShipRegion", title: "Ship Region", filterType: "string" }
        // { field: "ShipPostalCode", title: "Ship Postal Code", filterType: "string" }
    ];

    public gridOrderData: any[] = GridOrderData.map(d => {
        return {
            ...d,
            OrderDate: new Date(d.OrderDate),
            ShippedDate: d.ShippedDate != null ? new Date(d.ShippedDate) : null
        };
    });
    public gridOrderDataRandom = this.generateRandomGridData(100000);

    public gridProductColumns: any[] = [
        { field: "ProductID", title: "Product ID", filterType: "number" },
        { field: "ProductName", title: "Product Name", filterType: "string" },
        { field: "SupplierID", title: "Supplier ID", filterType: "number" },
        { field: "CategoryID", title: "Category ID", filterType: "number" }
        // { field: "QuantityPerUnit", title: "Quantity Per Unit", filterType: "string" },
        // { field: "UnitPrice", title: "Unit Price", filterType: "number" },
        // { field: "UnitsInStock", title: "Units In Stock", filterType: "number" },
        // { field: "UnitsOnOrder", title: "Units On Order", filterType: "number" },
        // { field: "ReorderLevel", title: "Reorder Level", filterType: "number" },
        // { field: "Discontinued", title: "Discontinued", filterType: "boolean" },
        // { field: "FirstOrderedOn", title: "First Ordered On", filterType: "date" }
    ];

    public gridProductData: any[] = GridProductData;
    public gridSelectionKeys: number[] = [];
    public gridSort: SortDescriptor[] = [
        // {
        //     dir: "asc",
        //     field: "ShipCountry"
        // }
    ];
    public gridSortOptions: SortableOptions = {
        enabled: true,
        mode: "multiple",
        allowUnsort: true,
        showIndices: true
    };
    public listBox2Items: IndexableList<any> = new IndexableList([] as any[]);
    public listViewDataItems: IndexableList<any> = new IndexableList();
    public listViewScrollBottomItemCount: number = 20;
    public listViewSelectedKeys: Set<string> = new Set([]);
    public menuBarMenuVisible: boolean = false;
    public multiSelectTagCount: number = 2;
    public numericTextBoxValue: number | null = 10;
    public pagerTestData: Array<{ index: number; text: string }> = Enumerable.range(1, 1337)
        .select(i => {
            return { index: i, text: `Item ${i}` };
        })
        .toArray();
    public pagerPageSize: number = 10;
    public pagerSkip: number = 33;
    public progressLabelFormatter = (value: number) => `${value}/100`;
    public rangedSliderValues: [number, number] = [12, 18];
    public scrollViewData: string[] = [
        "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        // "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        // "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        // "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        // "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        // "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        // "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        // "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        // "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        // "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        // "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg",
        "https://photos.smugmug.com/photos/i-qQv8THj/0/5a269061/O/i-qQv8THj.jpg",
        "https://photos.smugmug.com/photos/i-F8Wtj6x/0/e384c898/O/i-F8Wtj6x.jpg",
        "https://photos.smugmug.com/photos/i-Lr7g2pR/0/95219439/O/i-Lr7g2pR.jpg",
        "https://photos.smugmug.com/photos/i-Nvhp58k/0/777327be/O/i-Nvhp58k.jpg",
        "https://photos.smugmug.com/photos/i-tKx2tKq/0/f79eab88/O/i-tKx2tKq.png",
        "https://photos.smugmug.com/photos/i-VHNKL53/0/cbfcb2fb/O/i-VHNKL53.jpg"
    ];
    public selectedComboBoxDataItem: any = null;
    public selectedDropdownListDataItem: any;
    public selectedListItem: any;
    public selectedMultiSelectDataItems: any[] = [this.dropdownListDataItems.get(2), this.dropdownListDataItems.get(4)];
    public selectedMultiSelectDataItems2: any[] = [
        { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true },
        { text: "REPLACED WITH Okonomiyaki", value: 29, group: "FOODIE", active: true }
    ];
    public selectedPrimitiveComboBoxDataItem: string | null = null;
    public sliderValue: number = 7;
    public switchValue: boolean = false;
    public stepperStep: number = 1;
    public stepperSteps: StepOptions[] = [
        { label: "Cart", data: { cart: true } },
        { label: "Shipping", data: { shipping: true } },
        { label: "Payment", data: { payment: true } },
        { label: "Review", data: { review: true } },
        { label: "Complete" }
    ];
    public tabData: Array<{ title: string; id: string }> = [
        { title: "Tab 1", id: "tab1" },
        { title: "Tab 2", id: "tab2" },
        { title: "Tab 3", id: "tab3" },
        { title: "Tab 4", id: "tab4" },
        { title: "Tab 5", id: "tab5" },
        { title: "Tab 6", id: "tab6" },
        { title: "Tab 7", id: "tab7" },
        { title: "Tab 8", id: "tab8" },
        { title: "Tab 9", id: "tab9" },
        { title: "Tab 10", id: "tab10" },
        { title: "Tab 11", id: "tab11" },
        { title: "Tab 12", id: "tab12" },
        { title: "Tab 13", id: "tab13" },
        { title: "Tab 14", id: "tab14" }
    ];
    public textBoxValue: string = "TEXT BOX VALUE";
    public textBoxValue2: string = "a";
    public timePickerMaxValue: Date | null = new Date(2002, 2, 10, 17, 15, 9);
    public timePickerMinValue: Date | null = new Date(2000, 2, 10, 8, 30, 0);
    public timePickerValue: Date | null = new Date(2000, 2, 10, 10, 0, 0);
    public toggleableButtonSelected: boolean = true;
    public treeCheckedKeys: string[] = [];

    public treeData: TreeNodeDataItem[] = [
        {
            text: "Root",
            id: "1",
            items: [
                {
                    text: "Fruits",
                    id: "1-1",
                    items: [
                        { text: "Apple", id: "1-1-1", disabled: true, items: [] },
                        { text: "Apricot", id: "1-1-2", disabled: false, items: [] },
                        { text: "Banana", id: "1-1-3", items: [] },
                        { text: "Cherry", id: "1-1-4", disabled: true, items: [] }
                    ]
                },
                {
                    text: "Foods",
                    id: "1-2",
                    items: [
                        { text: "Yakisoba", id: "1-2-1", items: [] },
                        { text: "Yakitori", id: "1-2-2", items: [] },
                        { text: "Sushi", id: "1-2-3", items: [] },
                        { text: "Sashimi", id: "1-2-4", items: [] }
                    ]
                },
                {
                    text: "Vegetables",
                    id: "1-3",
                    items: [
                        { text: "Cabbage", id: "1-3-1", items: [] },
                        { text: "Cabbage Black", id: "1-3-2", items: [] },
                        { text: "Pumpkin", id: "1-3-3", items: [] },
                        { text: "Potato", id: "1-3-4", items: [] }
                    ]
                },
                {
                    text: "Trees",
                    id: "1-4",
                    items: [
                        { text: "Willow", id: "1-4-1", items: [] },
                        { text: "Birch", id: "1-4-2", items: [] },
                        { text: "Oak", id: "1-4-3", items: [] },
                        { text: "Pine", id: "1-4-4", items: [] },
                        { text: "Maple", id: "1-4-5", items: [] },
                        { text: "Cedar", id: "1-4-6", items: [] }
                    ]
                }
            ]
        }
    ];
    public treeDataRandom: any[] = this.generateRandomTreeData(50);
    public treeFilter: WritableSignal<string> = signal("Apple");

    public dropdownTreeDisabler: (item: any) => boolean = (item: any) => item.text.toLowerCase().startsWith("c");
    public dropdownTreeExpandedKeys: string[] = ["1", "1-4"];
    public dropdownTreeSelectedValue = this.treeData[0].items![1].items![0];

    public treeChildren = (item: TreeNodeDataItem) => of(item.items ?? []);
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
    public readonly popupContentTemplate!: TemplateRef<any>;

    @ViewChild("popupContentTemplate2")
    public readonly popupContentTemplate2!: TemplateRef<any>;

    @ViewChild("testButtonRef", { read: ElementRef })
    public testButtonRef!: ElementRef<HTMLButtonElement>;

    public constructor(
        private readonly popupService: PopupService,
        public readonly windowService: WindowService,
        // protected readonly listService: ListService<{ text: string; value: number; group: string; active: boolean }>,
        private readonly cdr: ChangeDetectorRef,
        private readonly notificationService: NotificationService,
        private readonly dialogService: DialogService
        // protected readonly treeService: TreeService<TreeNodeDataItem>
    ) {}

    public dropdownItemDisabler = (item: any): boolean => !item.active;
    public dropdownPrimitiveItemDisabler = (item: string): boolean => item.includes("i");

    // public ngAfterContentChecked(): void {
    //     console.log("ngAfterContentChecked :: AppComponent");
    // }

    public ngAfterViewInit(): void {
        // this.listService.setTextField(i => i.text);
        // // this.listService.setDisabledBy(this.dropdownItemDisabler);
        //
        // this.listService.setSelectableOptions({ enabled: true, mode: "multiple" });
        // this.listService.setValueField(i => i.value);
        // this.listService.setSelectedKeys([
        //     this.dropdownListDataItems.get(17).value
        //     // this.dropdownListDataItems.get(14).value
        // ]);
        //
        // this.listService.setGroupBy(i => `${i.text.charAt(0).toUpperCase()}`);
        // this.listService.setGroupableOptions({
        //     enabled: true,
        //     headerOrder: "asc"
        //     // orderBy: i => i.text.charAt(i.text.length - 1),
        //     // orderByDirection: "desc"
        // });
        // this.listService.setNavigableOptions({ enabled: true, mode: "select", wrap: true });
        //
        // this.listService.setFilterableOptions({ enabled: true, caseSensitive: true, debounce: 0 });
        // this.listService.setFilterPlaceholder("Search items...");
        // // this.listService.setFilter("n");
        // this.listService.filterChange = new EventEmitter<FilterChangeEvent>();
        // this.listService.filterChange.subscribe((e: FilterChangeEvent) => {
        //     // e.preventDefault();
        //     console.log(e);
        // });
        // this.listService.selectedKeysChange = new EventEmitter<Array<any>>();
        // this.listService.selectedKeysChange.subscribe((e: ImmutableSet<any>) => {
        //     // console.log("Selected Keys: ", e.toArray());
        //     console.log(
        //         "Selected Items: ",
        //         this.listService
        //             .selectedListItems()
        //             .select(i => i.data)
        //             .toArray()
        //     );
        // });
        //
        // // window.setTimeout(() => {
        // //     this.listService.setVirtualScrollOptions({ enabled: true, height: 28 });
        // // }, 6000);
        //
        // this.listService.setData(this.dropdownListDataItems);
    }

    public filterData(): void {
        // const data = Enumerable.range(1, 100)
        //     .select(i => ({ text: `Item ${i}`, value: i }))
        //     .toArray();
        // const result = Query.from(data)
        //     // .filter({ field: "value", operator: "between", value: [17, 33] })
        //     // .filter({ field: "text", operator: "endswith", value: "7" })
        //     .filter({
        //         logic: "or",
        //         filters: [{ field: "value", operator: "between", value: [17, 33] }]
        //     })
        //     .filter({
        //         field: "value",
        //         operator: "function",
        //         predicate: (value: number) => value % 3 === 0
        //     })
        //     .run();
        // console.log(result);
    }

    public ngOnInit(): void {
        this.selectedDropdownListDataItem = { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true };
        this.selectedComboBoxDataItem = { text: "REPLACED WITH PAPRIKA", value: 13, group: "Fruit", active: true };
        let turn: number = 0;
        window.setInterval(() => {
            // this.contextMenuItemVisible = !this.contextMenuItemVisible;
            // this.dropdownItemDisabler = (item: any): boolean => turn % item.value === 0;
            // this.listService.setDisabledBy(this.dropdownItemDisabler);
            // this.listService.setGroupSelector(i => i.text.charAt(turn % 4).toUpperCase());
            // this.listService.setValueField(i => (turn % 2 === 0 ? i.value : i));
            // this.listService.setGroupableOptions({ enabled: true, headerOrder: turn % 2 === 0 ? "asc" : "desc" });
            turn++;
        }, 3000);
        this.selectedDropdownListDataItem = { ...this.dropdownListDataItems.get(14) };
        this.selectedPrimitiveComboBoxDataItem = this.dropdownPrimitiveDataItems[7];

        this.dropdownPartialPrimitiveDataItems = this.dropdownPrimitiveDataItems.slice();

        this.filterData();

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
        //     this.calendarMinValue.set(this.calendarMinValue() != null ? null : new Date(2023, 8, 11));
        //     this.calendarMaxValue.set(this.calendarMaxValue() != null ? null : new Date(2023, 8, 27));
        //     // this.calendarDisabledDates.set(
        //     //     this.calendarDisabledDates().length > 0
        //     //         ? []
        //     //         : [
        //     //               new Date(2023, 8, 1),
        //     //               new Date(2023, 8, 2),
        //     //               new Date(2023, 8, 3),
        //     //               new Date(2023, 8, 13),
        //     //               new Date(2023, 8, 23)
        //     //           ]
        //     // );
        // }, 3000);

        // window.setInterval(() => {
        //     this.menuBarMenuVisible = !this.menuBarMenuVisible;
        // }, 1000);

        // window.setInterval(() => {
        //     this.windowVisible = !this.windowVisible;
        // }, 2500);

        // window.setTimeout(() => {
        //     this.selectedMultiSelectDataItems = [
        //         this.dropdownListDataItems[0],
        //         this.dropdownListDataItems[2],
        //         this.dropdownListDataItems[4],
        //         this.dropdownListDataItems[6],
        //         this.dropdownListDataItems[8],
        //         this.dropdownListDataItems[10]
        //     ];
        // }, 5000);
        // window.setTimeout(() => {
        //     this.gridFilters = [this.gridFilters[1]];
        // }, 5000);
        // window.setInterval(() => {
        //     console.log(this.gridOrderData[0]);
        // }, 3000);

        const listViewItems = new Array<{ text: string; value: number; group: string }>();
        for (let vx = 1; vx <= 3000; ++vx) {
            listViewItems.push({ text: `Item ${vx}`, value: vx, group: vx % 3 === 0 ? "Group 1" : "Group 2" });
        }
        this.listViewDataItems = new IndexableList(listViewItems);
        this.listViewSelectedKeys = new Set([
            "Item 3",
            "Item 5",
            "Item 7",
            "Item 9",
            "Item 11",
            "Item 13",
            "Item 15",
            "Item 2999"
        ]);

        // this.treeService.setData(this.treeData);
        // this.treeService.setChildrenSelector(i => i.items);
        // this.treeService.setTextField(i => i.text);
        // this.treeService.setExpandableOptions({ enabled: true });
        // this.treeService.setExpandBy(i => i.id);
        // this.treeService.setAnimationEnabled(true);
        // this.treeService.setExpandedKeys(["1", "1-1", "1-2", "1-3", "1-4"]);
        // this.treeCheckedKeys = [this.treeData[0].items[0].items[0], this.treeData[0].items[0].items[2]];
        // this.treeExpandedKeys = [this.treeData[0], this.treeData[0].items[1]];
        // this.treeService.setSelectableOptions({ enabled: true, mode: "single", childrenOnly: true, toggleable: false });
        // this.treeService.setSelectBy(i => i.id);

        // this.treeSelectedKeys = ["1-1-1", "1-4-2"];

        // this.treeService.setCheckableOptions({
        //     enabled: true,
        //     mode: "multiple",
        //     childrenOnly: false,
        //     checkChildren: true,
        //     checkDisabledChildren: false,
        //     checkParents: true
        // });
        //
        // this.treeService.setDisableOptions({ enabled: true, disableChildren: true });
        // this.treeService.setDisabledKeys(["1-1-1", "1-4-2", "1-3"]);
        // this.treeService.setDisableBy(i => i.id);

        // window.setInterval(() => {
        //     this.treeService.setData(this.generateRandomTreeData(10));
        // }, 2000);

        // this.treeService.setCheckBy(i => i.id);

        // window.setTimeout(() => this.treeService.setSelectedKeys(["1", "1-1"]));
        // const treeDataR = this.generateRandomTreeData(500);
        // const flatten = (items: any[]): any[] => {
        //     const flattenedNodes = [];
        //     for (const node of items) {
        //         flattenedNodes.push(node);
        //         if (node.items.length !== 0) {
        //             flattenedNodes.push(...flatten(node.items));
        //         }
        //     }
        //     return flattenedNodes;
        // };
        // const flatTreeDataR = flatten(treeDataR);
        // console.log(flatTreeDataR);
        // this.treeDataRandom = treeDataR;
        // this.treeService.setData(this.treeDataRandom);

        // let turn2 = 0;
        // window.setInterval(() => {
        //     const randomKeys = () => {
        //         const keys = [
        //             ["1", "1-1"],
        //             ["1", "1-2"],
        //             ["1", "1-3"],
        //             ["1", "1-4"]
        //         ];
        //         const keys2 = keys[turn2++ % keys.length];
        //         console.log(keys2);
        //         return keys2;
        //     };
        //     // this.treeService.setExpandedKeys(randomKeys());
        //     // this.treeSelectedKeys = randomKeys();
        // }, 1000);
    }

    public numericTextBoxFormatter = (value: number | null): string => (value != null ? `${value} °C` : "");

    public generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public onAutoCompleteFilterChange(event: FilterChangeEvent): void {
        event.preventDefault();
        console.log(event);
    }

    public onAutoCompleteValueChange(value: string): void {
        this.autoCompleteValue = value;
        console.log("AutoComplete value changed: ", value);
    }

    public onBreadcrumbItemClick(item: BreadcrumbItem): void {
        const index = this.breadcrumbViewItems.indexOf(item);
        this.breadcrumbViewItems = this.breadcrumbViewItems.slice(0, index + 1);
    }

    public onButtonSelectedChange(selected: boolean): void {
        // console.log(`Button selected: ${selected}`);
    }

    public onColorGradientValueChange(value: string): void {
        this.colorGradientColor = value;
        // console.log(value);
    }

    public onColorPickerValueChange(value: string | null): void {
        this.colorPickerValue = value;
        console.log(value);
    }

    public onComboBoxFilterChange(event: FilterChangeEvent): void {
        console.log(event);
    }

    public onComboBoxPrimitiveValueChange(value: string): void {
        this.selectedPrimitiveComboBoxDataItem = value;
        console.log(`Combobox primitive value changed`, value);
    }

    public onComboBoxValueChange(value: unknown): void {
        this.selectedComboBoxDataItem = value;
        console.log(`Combobox value changed`, value);
    }

    public onDatePickerValueChange(value: Date | null): void {
        console.log(value);
        this.datePickerValue = value;
    }

    public onDateTimePickerValueChange(value: Date | null): void {
        console.log(value);
    }

    public onDropDownValueChange(value: unknown): void {
        // if (true) return;
        this.selectedDropdownListDataItem = value;
        console.log(`Dropdown value changed`, value);
        // console.log(value);
    }

    public onDropdownTreeExpandedKeysChange(expandedKeys: unknown[]): void {
        this.dropdownTreeExpandedKeys = expandedKeys as string[];
        console.log(expandedKeys);
    }

    public onDropdownTreeValueChange(value: TreeNodeDataItem): void {
        this.dropdownTreeSelectedValue = value;
        console.log(`Dropdown tree value changed`, value);
    }

    public onFilterMenuFilterApply(filter: CompositeFilterDescriptor): void {
        console.log(filter);
        const data = Enumerable.range(1, 100)
            .select(i => ({
                text: i % 6 === 0 ? "" : i % 4 === 0 ? null : `Item ${i}`,
                value: i % 7 === 0 ? null : i,
                active: i % 5 === 0 ? true : i % 8 === 0 ? null : false,
                date:
                    i % 9 === 0
                        ? null
                        : DateTime.local()
                              .plus({ days: i })
                              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                              .toJSDate()
            }))
            .toArray();
        const result = Query.from(data)
            .filter(filter)
            // .sort([
            //     { field: "active", dir: "asc" },
            //     { field: "value", dir: "desc" }
            // ])
            .run();
        // console.log(data);
        console.log(result);
    }

    public onGridCellEdit(event: CellEditEvent): void {
        if (!event.newValue) {
            event.preventDefault();
            event.setNewValue("--");
        }
        console.log(event);
    }

    public onGridFilterChange(filters: CompositeFilterDescriptor[]): void {
        console.log(filters);
        this.gridFilters = filters;
    }

    public onGridSelectionKeysChange(keys: unknown[]): void {
        this.gridSelectionKeys = keys as number[];
        console.log(keys);
    }

    public onGridSortChange(sort: SortDescriptor[]): void {
        this.gridSort = sort;
        console.log(sort);
    }

    public onListFilterChange(event: FilterChangeEvent): void {
        console.log(event);
    }

    public onListBoxActionClick(event: ListBoxActionClickEvent): void {
        if (event.action === "moveDown" && event.selectedItem?.text === "Plum") {
            event.preventDefault();
            console.log(event);
        }
    }

    public onListViewScrollBottom(event: Event): void {
        this.listViewScrollBottomItemCount = this.listViewScrollBottomItemCount + 10;
        console.log("ListView scroll bottom", event);
    }

    public onListViewSelectionChange(keys: string[]): void {
        this.listViewSelectedKeys = new Set(keys);
        console.log(keys);
    }

    public onMultiSelectValueChange(value: unknown[]): void {
        this.selectedMultiSelectDataItems = value;
        // this.cdr.detectChanges();
        console.log(`MultiSelect value changed`, value);
    }

    public onNumericTextBoxValueChange(value: number | null): void {
        this.numericTextBoxValue = value;
        console.log(value);
    }

    public onPagerPageChange(event: PageChangeEvent): void {
        this.pagerSkip = event.skip;
        console.log(this.pagerTestData.slice(this.pagerSkip, this.pagerSkip + this.pagerPageSize));
    }

    public onPagerPageSizeChange(event: PageSizeChangeEvent): void {
        if (event.newPageSize >= 50) {
            event.preventDefault();
            console.log("Prevented page size change to 50 or more");
        } else {
            this.pagerPageSize = event.newPageSize;
        }
    }

    public onPopoverHidden(): void {
        console.log("Popover hidden");
    }

    public onPopoverHide(event: PopoverHideEvent): void {
        // event.preventDefault();
        console.log(event);
    }

    public onPopoverShow(event: PopoverShowEvent): void {
        // event.preventDefault();
        console.log(event);
    }

    public onPopoverShownEvent(event: PopoverShownEvent): void {
        console.log(event);
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
        this.tabData = this.tabData.filter((_, index) => index !== event.index - 4);
    }

    public onTextBoxValueChange(value: string): void {
        // console.log(value);
        this.textBoxValue = value;
    }

    public onTreeCheckedKeysChange(checkedKeys: unknown[]): void {
        console.log(checkedKeys);
        this.treeCheckedKeys = checkedKeys as string[];
    }

    public onTreeDisabledKeysChange(disabledKeys: string[]): void {
        console.log(disabledKeys);
        this.treeDisabledKeys = disabledKeys;
    }

    public onTreeExpandedKeysChange(expandedKeys: unknown[]): void {
        console.log(expandedKeys);
        this.treeExpandedKeys = expandedKeys as string[];
    }

    public onTreeFilterChange(event: FilterChangeEvent): void {
        // event.preventDefault();
        // console.log(event.filter);
    }

    public onTreeNodeCheck(event: NodeCheckEvent<any>): void {
        if (event.nodeItem.data.text.startsWith("C")) {
            event.preventDefault();
            console.log(event);
        }
    }

    public onTreeNodeClick(event: NodeClickEvent<any>): void {
        // if (event.nodeItem.hasChildren) {
        //     event.preventDefault();
        //     console.log(event);
        // }
        // event.preventDefault();
    }

    public onTreeNodeDoubleClick(event: NodeClickEvent<any>): void {
        console.log(event);
        event.preventDefault();
    }

    public onTreeNodeDrag(event: NodeDragEvent<any>): void {
        // console.log(event);
        // event.preventDefault();
    }

    public onTreeNodeDragEnd(event: NodeDragEndEvent<any>): void {
        // console.log(event);
    }

    public onTreeNodeDragStart(event: NodeDragStartEvent<any>): void {
        // event.preventDefault();
        // console.log(event);
    }

    public onTreeNodeDrop(event: NodeDropEvent<any>): void {
        // console.log(event);
        // if (event.targetNodeItem?.data.text.startsWith("A") && event.position === "inside") {
        //     event.preventDefault();
        // }
    }

    public onTreeNodeSelect(event: NodeSelectEvent<any>): void {
        if (event.nodeItem.data.text.startsWith("P")) {
            event.preventDefault();
            console.log(event);
        }
    }

    public onTreeSelectedKeysChange(selectedKeys: unknown[]): void {
        console.log(selectedKeys);
        this.treeSelectedKeys = selectedKeys as string[];
    }

    public openFilterPopup(anchor: HTMLButtonElement): void {
        const filterPopupRef = this.popupService.create({
            content: FilterMenuComponent,
            anchor,
            preventClose: event => {
                if (event.originalEvent instanceof PointerEvent) {
                    const target = event.originalEvent.target as HTMLElement;
                    if (target.closest(".mona-popup-content")) {
                        return true;
                    }
                }
                return false;
            }
        });
        if (filterPopupRef.component) {
            const component = filterPopupRef.component.instance as FilterMenuComponent;
            component.value = this.filterMenuValue;
            component.apply.subscribe(() => {
                this.filterMenuValue = component.value;
                filterPopupRef.close();
            });
        }
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
        // event.stopPropagation();
        // const prevented = 5;
        // const ref = this.popupService.create({
        //     anchor: this.italicButtonRef,
        //     content: TestComponentComponent,
        //     popupClass: "popup-noselect",
        //     hasBackdrop: true,
        //     offset: { horizontal: 0, vertical: 1 },
        //     preventClose: event => {
        //         console.log(event);
        //         return event.via === "backdropClick";
        //     }
        // });
    }

    public onTimePickerValueChange(value: Date | null): void {
        console.log(value);
        this.timePickerValue = value;
    }

    public openWindow(titleTemplate?: TemplateRef<any>): void {
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
            closeOnEscape: true
            // preventClose: event => {
            //     console.log(event);
            // return event.via === "backdropClick";
            // }
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

    public showDialog(): void {
        const dialogRef = this.dialogService.show({
            text: "Enter title: ",
            title: "Dialog",
            type: "confirm",
            inputType: "string"
        });
        dialogRef.result.pipe(take(1)).subscribe({
            next: result => {
                console.log(result);
                // dialogRef.close();
            }
        });
    }

    public showNotification(): void {
        this.notificationService.show({
            text: "Hello World!",
            title: "Notification",
            type: "error",
            duration: 5000
        });
    }

    public updateTreeData(): void {
        this.treeData = [
            ...this.treeData,
            {
                text: Math.random().toString(),
                id: Math.random().toString(),
                items: [{ text: "New 2", id: Math.random().toString(), disabled: Math.random() * 100 < 50, items: [] }]
            }
        ];
    }

    private generateRandomGridData(count: number) {
        const generatedData = [];
        const cities = [
            "Paris",
            "Berlin",
            "London",
            "Madrid",
            "Munich",
            "Rome",
            "Prague",
            "Vienna",
            "Amsterdam",
            "Barcelona",
            "Brussels",
            "Athens",
            "Copenhagen",
            "Dublin",
            "Helsinki",
            "Lisbon",
            "Oslo",
            "Warsaw",
            "Stockholm",
            "Budapest"
        ];
        const countries = [
            "France",
            "Germany",
            "UK",
            "Spain",
            "Italy",
            "Austria",
            "Netherlands",
            "Belgium",
            "Greece",
            "Denmark",
            "Ireland",
            "Finland",
            "Portugal",
            "Norway",
            "Poland",
            "Sweden",
            "Hungary",
            "Czech Republic",
            "Switzerland",
            "Slovakia"
        ];
        const shipNames = [
            "Sea Explorer",
            "Ocean Vision",
            "Wave Jumper",
            "Marine Dream",
            "Nautical Disrupter",
            "Water Bookmark",
            "Aquatic Friend",
            "Windy Ship",
            "Breezy Transport",
            "Salty Companion",
            "Maritime Galore",
            "Sunny Voyage",
            "Ripple Marvel",
            "Watery Trail",
            "Jolly Sailor",
            "Brave Navigator",
            "Vibrant Lifeline",
            "Seafarer's Delight",
            "Uncharted Journey",
            "Thunderous Whirlpool"
        ];
        let orderNumber = 10000;

        for (let i = 0; i < count; i++) {
            const now = new Date();
            const randomCityIndex = Math.floor(Math.random() * cities.length);
            const randomCountryIndex = Math.floor(Math.random() * countries.length);
            const randomShipNameIndex = Math.floor(Math.random() * shipNames.length);

            generatedData.push({
                OrderID: orderNumber++,
                CustomerID: v4(),
                EmployeeID: Math.floor(Math.random() * 10),
                OrderDate: new Date(),
                RequiredDate: new Date(now.setDate(now.getDate() + Math.random() * 30)),
                ShippedDate: new Date(now.setDate(now.getDate() + Math.random() * 30)),
                ShipVia: Math.floor(Math.random() * 4),
                Freight: Math.floor(Math.random() * 100),
                ShipName: shipNames[randomShipNameIndex],
                ShipAddress: "Random Street, " + Math.floor(Math.random() * 100),
                ShipCity: cities[randomCityIndex],
                ShipRegion: "",
                ShipPostalCode: "0000" + Math.floor(Math.random() * 100),
                ShipCountry: countries[randomCountryIndex]
            });
        }

        return generatedData;
    }

    private generateRandomTreeData(nodeCount: number): TreeNodeDataItem[] {
        function generateNode(idPrefix: string, remainingNodes: number): [any, number] {
            const node: TreeNodeDataItem = {
                text: Math.random().toString(36).substring(7),
                id: idPrefix,
                items: []
            };

            if (remainingNodes > 0) {
                const childCount = Math.min(Math.floor(Math.random() * remainingNodes), remainingNodes);
                for (let i = 0; i < childCount; i++) {
                    const [childNode, newRemainingNodes] = generateNode(`${idPrefix}-${i + 1}`, remainingNodes - 1);
                    node.items.push(childNode);
                    remainingNodes = newRemainingNodes;
                }
            }

            return [node, remainingNodes];
        }

        const trees: TreeNodeDataItem[] = [];
        let remainingNodes = nodeCount;
        let rootId = 1;
        while (remainingNodes > 0) {
            const [tree, newRemainingNodes] = generateNode(rootId.toString(), remainingNodes - 1);
            trees.push(tree);
            remainingNodes = newRemainingNodes;
            rootId++;
        }

        return trees;
    }
}
