import {
    AfterViewInit,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    SkipSelf,
    TemplateRef,
    ViewChildren
} from "@angular/core";
import { PopupListItem } from "../../data/PopupListItem";
import { SelectionMode } from "../../../models/SelectionMode";
import { PopupListService } from "../../services/popup-list.service";
import { debounceTime, fromEvent, Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";
import { PopupListItemComponent } from "../popup-list-item/popup-list-item.component";
import { PopupListValueChangeEvent } from "../../data/PopupListValueChangeEvent";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { TextBoxModule } from "../../../inputs/modules/text-box/text-box.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSearch, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "mona-popup-list",
    templateUrl: "./popup-list.component.html",
    styleUrls: ["./popup-list.component.scss"],
    standalone: true,
    imports: [CommonModule, PopupListItemComponent, TextBoxModule, FontAwesomeModule, FormsModule]
})
export class PopupListComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    public readonly filterIcon: IconDefinition = faSearch;
    public readonly filter$: Subject<string> = new Subject<string>();

    @Input()
    public filterable: boolean = false;

    @Input()
    public groupField?: string;

    @ContentChild(ListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<void>;

    @Input()
    public set highlightedValues(values: any[]) {
        this.updateHighlightedValues(values);
    }

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<void>;

    @Input()
    public navigable: boolean = true;

    @ViewChildren(PopupListItemComponent)
    public popupListItemComponents: QueryList<PopupListItemComponent> = new QueryList<PopupListItemComponent>();

    @Input()
    public selectionMode: SelectionMode = "single";

    @Input()
    public textField?: string;

    @Input()
    public set value(values: any[]) {
        this.updateSelectedValues(values);
    }

    @Output()
    public valueChange: EventEmitter<PopupListValueChangeEvent> = new EventEmitter<PopupListValueChangeEvent>();

    @Input()
    public valueField?: string;

    public constructor(
        @SkipSelf()
        public readonly popupListService: PopupListService
    ) {}

    public ngAfterViewInit(): void {
        const firstSelectedItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .firstOrDefault(i => i.selected || i.highlighted);
        if (firstSelectedItem) {
            window.setTimeout(() => this.scrollToItem(firstSelectedItem), 250);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["highlightedValues"] && changes["highlightedValues"].isFirstChange()) {
            window.setTimeout(() => this.updateHighlightedValues(changes["highlightedValues"].currentValue));
        }
        if (changes["value"] && changes["value"].isFirstChange()) {
            window.setTimeout(() => this.updateSelectedValues(changes["value"].currentValue));
        }
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }

    public ngOnInit(): void {
        this.setEvents();
        this.setSubscriptions();
    }

    public onListItemClick(item: PopupListItem, event: MouseEvent): void {
        if (item.disabled) {
            return;
        }
        if (this.selectionMode === "single") {
            this.updateSelectedValues([item.data]);
            this.valueChange.emit({
                value: [item],
                via: "selection"
            });
        } else if (this.selectionMode === "multiple") {
            item.selected = !item.selected;
            const selectedItems = this.popupListService.viewListData
                .selectMany(g => g.source)
                .where(i => i.selected)
                .toArray();
            this.valueChange.emit({
                via: "selection",
                value: selectedItems
            });
        }
    }

    private findListItemComponent(item: PopupListItem): PopupListItemComponent | null {
        const component = this.popupListItemComponents.find(c => c.item?.dataEquals(item.data) ?? false);
        return component ?? null;
    }

    private scrollToItem(item: PopupListItem): void {
        const component = this.findListItemComponent(item);
        if (component) {
            component.elementRef.nativeElement.scrollIntoView({ behavior: "auto", block: "center" });
        }
    }

    private setEvents(): void {
        fromEvent<KeyboardEvent>(document, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event: KeyboardEvent) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    if (!this.navigable) {
                        return;
                    }
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    const listItem = this.popupListService.navigate(event, this.selectionMode);
                    if (listItem) {
                        this.scrollToItem(listItem);
                        if (this.selectionMode === "single") {
                            this.valueChange.emit({
                                via: "navigation",
                                value: [listItem]
                            });
                        }
                    }
                } else if (event.key === "Enter") {
                    if (this.selectionMode === "multiple") {
                        console.log("TODO: Implement Enter handling for popup list component");
                    } else {
                        if (this.popupListService.filterModeActive) {
                            const selectedItem = this.popupListService.viewListData
                                .selectMany(g => g.source)
                                .firstOrDefault(i => i.selected);
                            if (selectedItem) {
                                this.valueChange.emit({
                                    value: [selectedItem],
                                    via: "selection"
                                });
                            }
                        }
                    }
                }
            });
    }

    private setSubscriptions(): void {
        this.filter$
            .pipe(takeUntil(this.componentDestroy$), debounceTime(200))
            .subscribe(filter => this.popupListService.filterItems(filter));
        this.popupListService.scrollToListItem$
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(item => this.scrollToItem(item));
    }

    private updateHighlightedValues(values: any[]): void {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.highlighted = values.some(v => i.dataEquals(v));
            });
        });
    }

    private updateSelectedValues(values: any[]): void {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.selected = values.some(v => i.dataEquals(v));
            });
        });
        const selectedItem = PopupListService.findFirstSelectedItem(this.popupListService.viewListData);
        if (selectedItem) {
            this.scrollToItem(selectedItem);
        }
    }
}
