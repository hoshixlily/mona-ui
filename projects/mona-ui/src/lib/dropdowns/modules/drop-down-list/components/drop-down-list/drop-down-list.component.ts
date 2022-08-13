import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { PopupService } from "../../../../../popup/services/popup.service";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { take } from "rxjs";
import { Enumerable, Group, IndexableList } from "@mirei/ts-collections";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { DropDownListDataItem } from "../../models/DropDownListDataItem";
import { DropDownListItemTemplateDirective } from "../../directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "../../directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "../../directives/drop-down-list-group-template.directive";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"]
})
export class DropDownListComponent implements OnInit {
    private dropdownPopupRef: PopupRef | null = null;
    public dropdownData: IndexableList<Group<string, DropDownListDataItem>> = new IndexableList<
        Group<string, DropDownListDataItem>
    >();

    public selectedItem: DropDownListDataItem | null = null;

    @Input()
    public set data(data: Iterable<any>) {
        this.processDropdownData(data);
    }

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownPopupTemplate")
    public dropdownPopupTemplate!: TemplateRef<void>;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @Input()
    public groupField?: string;

    @ContentChild(DropDownListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @ContentChild(DropDownListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @Input()
    public textField?: string;

    @Input()
    public value?: any;

    @Output()
    public valueChange: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    public valueField?: string;

    @ContentChild(DropDownListValueTemplateDirective, { read: TemplateRef })
    public valueTemplate?: TemplateRef<void>;

    public constructor(private readonly popupService: PopupService) {}

    public ngOnInit(): void {
        if (this.value) {
            this.selectedItem = this.dropdownData.selectMany(g => g.source).firstOrDefault(d => d.data === this.value);
        }
    }

    public onDropDownItemClick(item: DropDownListDataItem): void {
        this.dropdownPopupRef?.close();
        this.selectedItem = item;
        this.valueChange.emit(item.data);
    }

    public openDropdown(): void {
        this.dropdownPopupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.dropdownPopupTemplate,
            hasBackdrop: true,
            withPush: false,
            width: this.dropdownWrapper.nativeElement.clientWidth + 2,
            offset: {
                vertical: 0.5
            },
            popupClass: ["mona-dropdown-popup-content"],
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" }
                )
            ]
        });
        this.dropdownPopupRef.closed.pipe(take(1)).subscribe(() => {
            this.dropdownPopupRef = null;
        });
    }

    private processDropdownData(data: Iterable<any>): void {
        this.dropdownData.clear();
        if (this.groupField) {
            this.dropdownData = Enumerable.from(data)
                .groupBy(d => d[this.groupField as string])
                .select(g => {
                    const items = g.source.select(d => {
                        return {
                            data: d,
                            text: this.textField ? d[this.textField] : d,
                            value: this.valueField ? d[this.valueField] : d
                        } as DropDownListDataItem;
                    });
                    return new Group(g.key, items);
                })
                .orderBy(g => g.key)
                .toIndexableList();
        } else {
            const items = Enumerable.from(data)
                .select(d => {
                    return {
                        data: d,
                        text: this.textField ? d[this.textField] : d,
                        value: this.valueField ? d[this.valueField] : d
                    } as DropDownListDataItem;
                })
                .toIndexableList();
            this.dropdownData.add(new Group<string, any>("", items));
        }
    }
}
