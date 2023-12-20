import { CommonModule } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    Signal,
    SimpleChanges,
    SkipSelf,
    TemplateRef,
    ViewChildren
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { debounceTime, fromEvent, Subject } from "rxjs";
import { FilterInputComponent } from "../../../../common/components/filter-input/filter-input.component";
import { TextBoxComponent } from "../../../../inputs/text-box/components/text-box/text-box.component";
import { TextBoxPrefixTemplateDirective } from "../../../../inputs/text-box/directives/text-box-prefix-template.directive";
import { SelectionMode } from "../../../../models/SelectionMode";
import { TypeCastPipe } from "../../../../pipes/type-cast.pipe";
import { PopupListItem } from "../../../models/PopupListItem";
import { PopupListValueChangeEvent } from "../../../models/PopupListValueChangeEvent";
import { ListGroupTemplateDirective } from "../../directives/list-group-template.directive";
import { ListItemTemplateDirective } from "../../directives/list-item-template.directive";
import { PopupListService } from "../../services/popup-list.service";
import { PopupListItemComponent } from "../popup-list-item/popup-list-item.component";

@Component({
    selector: "mona-popup-list",
    templateUrl: "./popup-list.component.html",
    styleUrls: ["./popup-list.component.scss"],
    standalone: true,
    imports: [
        CommonModule,
        PopupListItemComponent,
        FontAwesomeModule,
        FormsModule,
        TextBoxComponent,
        TextBoxPrefixTemplateDirective,
        FilterInputComponent,
        TypeCastPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupListComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    public readonly filter$: Subject<string> = new Subject<string>();
    public readonly filterText: Signal<string> = toSignal(this.filter$.pipe(debounceTime(0)), {
        initialValue: ""
    });

    @Input()
    public filterable: boolean = false;

    @Input()
    public groupField?: string;

    @ContentChild(ListGroupTemplateDirective, { read: TemplateRef })
    public groupTemplate?: TemplateRef<any>;

    @Input()
    public set highlightedValues(values: any[]) {
        this.updateHighlightedValues(values);
    }

    @ContentChild(ListItemTemplateDirective, { read: TemplateRef })
    public itemTemplate?: TemplateRef<any>;

    @Input()
    public navigable: boolean = true;

    @ViewChildren(PopupListItemComponent)
    public popupListItemComponents: QueryList<PopupListItemComponent> = new QueryList<PopupListItemComponent>();

    @Input()
    public selectionMode: SelectionMode = "single";

    @Input()
    public textField?: string;

    @Input()
    public value: any[] = [];

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
            .firstOrDefault(i => i.selected() || i.highlighted());
        if (firstSelectedItem) {
            window.setTimeout(() => this.scrollToItem(firstSelectedItem), 0);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["highlightedValues"] && changes["highlightedValues"].isFirstChange()) {
            window.setTimeout(() => this.updateHighlightedValues(changes["highlightedValues"].currentValue));
        }
        if (changes["value"]) {
            window.setTimeout(() => {
                this.updateSelectedValues(changes["value"].currentValue);
                if (changes["value"].isFirstChange() || this.selectionMode === "single") {
                    const firstSelectedItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(i => i.selected() || i.highlighted());
                    if (firstSelectedItem) {
                        window.setTimeout(() => this.scrollToItem(firstSelectedItem), 0);
                    }
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.popupListService.sourceListData.selectMany(g => g.source).forEach(i => i.selected.set(false));
    }

    public ngOnInit(): void {
        const selectedItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .firstOrDefault(i => i.dataEquals(this.value));
        if (selectedItem) {
            selectedItem.selected.set(true);
        }
        this.setEvents();
        this.setSubscriptions();
    }

    public onListItemClick(item: PopupListItem, event: MouseEvent): void {
        if (item.disabled) {
            return;
        }
        if (this.selectionMode === "single") {
            this.updateSelectedValues([item.data]);
            this.value = [item.data];
            this.valueChange.emit({
                value: [item],
                via: "selection"
            });
        } else if (this.selectionMode === "multiple") {
            item.selected.set(!item.selected());
            let values: any[] = [...this.value];
            let items: PopupListItem[] = [];
            if (item.selected()) {
                values.push(item.data);
                items = this.popupListService.getListItemsOfValues(values);
            } else {
                const valueItems = this.popupListService.getListItemsOfValues(values);
                items = valueItems.filter(i => !i.dataEquals(item));
            }
            this.valueChange.emit({
                via: "selection",
                value: items
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
            .pipe(takeUntilDestroyed(this.#destroyRef))
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
                        const highlightedItem = this.popupListService.viewListData
                            .selectMany(g => g.source)
                            .firstOrDefault(i => i.highlighted());
                        if (highlightedItem) {
                            if (highlightedItem.selected()) {
                                highlightedItem.selected.set(false);
                                const values = this.value.filter(v => !highlightedItem.dataEquals(v));
                                const items = this.popupListService.getListItemsOfValues(values);
                                this.valueChange.emit({
                                    via: "selection",
                                    value: items
                                });
                            } else {
                                highlightedItem.selected.set(true);
                                const values = [...this.value, highlightedItem.data];
                                const items = this.popupListService.getListItemsOfValues(values);
                                this.valueChange.emit({
                                    via: "selection",
                                    value: items
                                });
                            }
                        }
                    } else {
                        if (this.popupListService.filterModeActive) {
                            const selectedItem = this.popupListService.viewListData
                                .selectMany(g => g.source)
                                .firstOrDefault(i => i.selected());
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
            .pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(200))
            .subscribe(filter => this.popupListService.filterItems(filter, this.selectionMode));
        this.popupListService.scrollToListItem$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(item => this.scrollToItem(item));
    }

    private updateHighlightedValues(values: any[]): void {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.highlighted.set(values.length === 0 ? false : values.some(v => i.dataEquals(v)));
            });
        });
    }

    private updateSelectedValues(values: any[]): void {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.selected.set(values.length === 0 ? false : values.some(v => i.dataEquals(v)));
            });
        });
    }
}
