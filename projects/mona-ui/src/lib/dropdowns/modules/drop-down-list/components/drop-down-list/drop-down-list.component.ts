import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { fromEvent, Subject, take, takeUntil } from "rxjs";
import { Group, List } from "@mirei/ts-collections";
import { DropDownListItemTemplateDirective } from "../../directives/drop-down-list-item-template.directive";
import { DropDownListValueTemplateDirective } from "../../directives/drop-down-list-value-template.directive";
import { DropDownListGroupTemplateDirective } from "../../directives/drop-down-list-group-template.directive";
import { Action } from "../../../../../utils/Action";
import { ListItem } from "../../../../../shared/data/ListItem";
import { ValueChangeEvent } from "../../../../../shared/data/ValueChangeEvent";
import { ListComponent } from "../../../../../shared/components/list/list.component";
import { PopupService } from "../../../../../popup/services/popup.service";
import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { faChevronDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-drop-down-list",
    templateUrl: "./drop-down-list.component.html",
    styleUrls: ["./drop-down-list.component.scss"]
})
export class DropDownListComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly componentDestroy$: Subject<void> = new Subject();
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public listData: List<Group<string, ListItem>> = new List();
    public popupRef: PopupRef | null = null;
    public selectedListItems: ListItem[] = [];

    @Input()
    public data: Iterable<any> = [];

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

    @Input()
    public itemDisabler: Action<any, boolean> | string | null = null;

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

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupService: PopupService
    ) {}

    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.listData = ListComponent.createListData({
            data: this.data,
            disabler: ListComponent.getDisabler(this.itemDisabler) ?? undefined,
            groupField: this.groupField,
            textField: this.textField,
            valueField: this.valueField
        });
        if (this.value) {
            const listItem = this.listData.selectMany(g => g.source).firstOrDefault(i => i.data === this.value);
            this.selectedListItems = listItem && !listItem.disabled ? [listItem] : [];
        }
        this.setEventListeners();
    }

    public onSelectedListItemsChange(event: ValueChangeEvent): void {
        this.selectedListItems = event.value;
        this.value = this.selectedListItems.length > 0 ? this.selectedListItems[0].data : null;
        this.valueChange.emit(this.value);
        if (event.via === "selection") {
            this.popupRef?.close();
            this.popupRef = null;
        }
    }

    public open(): void {
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.dropdownPopupTemplate,
            hasBackdrop: true,
            withPush: false,
            width: this.elementRef.nativeElement.clientWidth,
            offset: {
                vertical: 0
            },
            popupClass: ["mona-dropdown-popup-content"],
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" }
                )
            ]
        });
        const ul = this.popupRef.overlayRef.overlayElement.querySelector("ul");
        if (ul) {
            ul.focus();
        }
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
        });
    }

    private setEventListeners(): void {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((e: Event) => {
                if (this.popupRef) {
                    return;
                }
                e.stopPropagation();
                const event = e as KeyboardEvent;
                if (event.key === "ArrowDown") {
                    const nextItem = ListComponent.findNextNotDisabledItem(this.listData, this.selectedListItems[0]);
                    if (nextItem) {
                        this.selectedListItems = [nextItem];
                        this.value = nextItem.data;
                        this.valueChange.emit(this.value);
                    }
                } else if (event.key === "ArrowUp") {
                    const previousItem = ListComponent.findPrevNotDisabledItem(
                        this.listData,
                        this.selectedListItems[0]
                    );
                    if (previousItem) {
                        this.selectedListItems = [previousItem];
                        this.value = previousItem.data;
                        this.valueChange.emit(this.value);
                    }
                }
            });
    }
}
