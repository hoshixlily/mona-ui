import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    effect,
    ElementRef,
    EventEmitter,
    inject,
    input,
    InputSignal,
    InputSignalWithTransform,
    OnInit,
    Output,
    Signal,
    signal,
    TemplateRef,
    untracked,
    WritableSignal
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
    faAngleDown,
    faAngleLeft,
    faAngleRight,
    faAnglesLeft,
    faAnglesRight,
    faAngleUp,
    faTrash,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { Collections, Enumerable, ImmutableList, List } from "@mirei/ts-collections";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { ListViewComponent } from "../../../list-view/components/list-view/list-view.component";
import { ListViewItemTemplateDirective } from "../../../list-view/directives/list-view-item-template.directive";
import { ListViewNavigableDirective } from "../../../list-view/directives/list-view-navigable.directive";
import { ListViewNoDataTemplateDirective } from "../../../list-view/directives/list-view-no-data-template.directive";
import { ListViewSelectableDirective } from "../../../list-view/directives/list-view-selectable.directive";
import { ContainsPipe } from "../../../pipes/contains.pipe";
import { ListBoxItemTemplateDirective } from "../../directives/list-box-item-template.directive";
import { ListBoxNoDataTemplateDirective } from "../../directives/list-box-no-data-template.directive";
import { ListBoxActionClickEvent } from "../../models/ListBoxActionClickEvent";
import { ListBoxItemTemplateContext } from "../../models/ListBoxItemTemplateContext";
import { ListBoxSelectionEvent } from "../../models/ListBoxSelectionEvent";
import { ToolbarAction, ToolbarOptions } from "../../models/ToolbarOptions";

type ListBoxDirection = "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";

@Component({
    selector: "mona-list-box",
    templateUrl: "./list-box.component.html",
    styleUrls: ["./list-box.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ListViewComponent,
        ListViewSelectableDirective,
        ListViewItemTemplateDirective,
        NgTemplateOutlet,
        ButtonDirective,
        FontAwesomeModule,
        ContainsPipe,
        ListViewNavigableDirective,
        ListViewNoDataTemplateDirective
    ],
    host: {
        class: "mona-list-box",
        "[class.mona-list-box-horizontal]": "direction()==='horizontal'",
        "[class.mona-list-box-vertical]": "direction()==='vertical'",
        "[class.mona-list-box-horizontal-reverse]": "direction()==='horizontal-reverse'",
        "[class.mona-list-box-vertical-reverse]": "direction()==='vertical-reverse'"
    }
})
export class ListBoxComponent<T = any> implements OnInit {
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    protected readonly activeListBox: Signal<ListBoxComponent<T> | null> = computed(() => {
        const selectedItem = this.selectedItem();
        if (selectedItem) {
            return this;
        }
        const connectedList = this.connectedList();
        if (connectedList?.selectedItem() != null) {
            return connectedList;
        }
        return this;
    });
    protected readonly direction: Signal<ListBoxDirection> = computed(() => {
        const position = this.toolbarOptions()?.position;
        switch (position) {
            case "right":
                return "horizontal";
            case "left":
                return "horizontal-reverse";
            case "top":
                return "vertical-reverse";
            case "bottom":
                return "vertical";
            default:
                return "horizontal";
        }
    });
    protected readonly moveDownIcon: IconDefinition = faAngleDown;
    protected readonly moveUpIcon: IconDefinition = faAngleUp;
    protected readonly removeIcon: IconDefinition = faTrash;
    protected readonly transferAllFromIcon: IconDefinition = faAnglesLeft;
    protected readonly transferAllToIcon: IconDefinition = faAnglesRight;
    protected readonly transferFromIcon: IconDefinition = faAngleLeft;
    protected readonly transferToIcon: IconDefinition = faAngleRight;
    protected selectedItem: WritableSignal<T | null> = signal(null);
    protected selectedItems: WritableSignal<ImmutableList<T>> = signal(ImmutableList.create());
    protected toolbarOptions: Signal<ToolbarOptions | null> = computed(() => {
        const toolbar = this.toolbar();
        if (typeof toolbar === "boolean") {
            return toolbar ? this.getDefaultToolbarOptions() : null;
        }
        return this.updateToolbarOptions(toolbar);
    });

    public readonly listBoxItems: WritableSignal<ImmutableList<T>> = signal(ImmutableList.create());
    public connectedList: InputSignal<ListBoxComponent<T> | null> = input<ListBoxComponent<T> | null>(null);
    public items: InputSignalWithTransform<List<T>, Iterable<T>> = input(new List(), {
        transform: (items: Iterable<T>) => new List(items)
    });
    public textField: InputSignal<string> = input("");
    public toolbar: InputSignal<boolean | Partial<ToolbarOptions>> = input<boolean | Partial<ToolbarOptions>>(true);

    @Output()
    public actionClick: EventEmitter<ListBoxActionClickEvent> = new EventEmitter<ListBoxActionClickEvent>();

    @ContentChild(ListBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<ListBoxItemTemplateContext> | null = null;

    @ContentChild(ListBoxNoDataTemplateDirective, { read: TemplateRef })
    public noDataTemplate: TemplateRef<any> | null = null;

    @Output()
    public selectionChange: EventEmitter<ListBoxSelectionEvent> = new EventEmitter<ListBoxSelectionEvent>();

    public constructor() {
        effect(() => {
            const items = this.items();
            untracked(() => this.listBoxItems.set(ImmutableList.create(items)));
        });
    }

    public createAndEmitActionEvent(action: ToolbarAction, originalEvent: MouseEvent): boolean {
        const event = new ListBoxActionClickEvent(action, this.selectedItem(), originalEvent);
        this.actionClick.emit(event);
        return event.isDefaultPrevented();
    }

    public moveInto(items: Iterable<T>) {
        const itemsToAdd = Enumerable.from(items).where(item => !this.listBoxItems().contains(item));
        this.listBoxItems.update(list => list.concat(itemsToAdd).toImmutableList());
    }

    public ngOnInit(): void {
        if (this.connectedList()) {
            this.connectedList()!.selectionChange.subscribe(() => {
                this.selectedItems.update(list => list.clear());
                this.selectedItem.set(null);
            });
        }
    }

    public onMoveDownClick(event: MouseEvent): void {
        const activeListBox = this.getActiveListBox();
        if (!activeListBox) {
            return;
        }
        const selectedItem = activeListBox.selectedItem();
        if (selectedItem && !activeListBox.createAndEmitActionEvent("moveDown", event)) {
            const index = activeListBox.listBoxItems().indexOf(selectedItem);
            if (index < activeListBox.listBoxItems().length - 1) {
                const itemList = activeListBox.listBoxItems().toList();
                Collections.swap(itemList, index, index + 1);
                activeListBox.listBoxItems.update(list => list.clear().addAll(itemList));
                activeListBox.scrollToSelectedItem();
            }
        }
    }

    public onMoveUpClick(event: MouseEvent): void {
        const activeListBox = this.getActiveListBox();
        if (!activeListBox) {
            return;
        }
        const selectedItem = activeListBox.selectedItem();
        if (selectedItem && !activeListBox.createAndEmitActionEvent("moveUp", event)) {
            const index = activeListBox.listBoxItems().indexOf(selectedItem);
            if (index > 0) {
                const itemList = activeListBox.listBoxItems().toList();
                Collections.swap(itemList, index, index - 1);
                activeListBox.listBoxItems.update(list => list.clear().addAll(itemList));
                activeListBox.scrollToSelectedItem();
            }
        }
    }

    public onRemoveClick(event: MouseEvent): void {
        const selectedItem = this.selectedItem();
        if (selectedItem && !this.createAndEmitActionEvent("remove", event)) {
            const index = this.listBoxItems().indexOf(selectedItem);
            this.listBoxItems.update(list => list.removeAt(index));
            this.selectedItems.update(list => list.remove(selectedItem));
            this.selectedItem.set(null);
        }
    }

    public onSelectedItemChange(items: T[]): void {
        const item = this.selectedItem();
        this.selectedItems.update(list => list.clear().addAll(items));
        this.selectedItem.set(items[0]);
        this.connectedList()?.selectedItem.set(null);
        this.connectedList()?.selectedItems.update(list => list.clear());
        this.activeListBox()?.selectionChange.emit({
            previous: item ? { item, index: this.listBoxItems().indexOf(item) } : null,
            current: { item: items[0], index: item ? this.listBoxItems().indexOf(items[0]) : -1 }
        });
    }

    public onTransferAllFromClick(event: MouseEvent): void {
        const connectedList = this.connectedList();
        if (connectedList && !this.createAndEmitActionEvent("transferAllFrom", event)) {
            this.moveInto(connectedList.listBoxItems());
            connectedList.listBoxItems.update(list => list.clear());
            connectedList.selectedItem.set(null);
            connectedList.selectedItems.update(list => list.clear());
        }
    }

    public onTransferAllToClick(event: MouseEvent): void {
        const connectedList = this.connectedList();
        if (connectedList && !this.createAndEmitActionEvent("transferAllTo", event)) {
            connectedList.moveInto(this.listBoxItems());
            this.listBoxItems.update(list => list.clear());
            this.selectedItem.set(null);
            this.selectedItems.update(list => list.clear());
        }
    }

    public onTransferFromClick(event: MouseEvent): void {
        const connectedList = this.connectedList();
        const connectedSelectedItem = connectedList?.selectedItem();
        if (connectedList && connectedSelectedItem && !this.createAndEmitActionEvent("transferFrom", event)) {
            this.moveInto([connectedSelectedItem]);
            connectedList.listBoxItems.update(list => list.remove(connectedSelectedItem));
            this.selectedItem.set(connectedSelectedItem);
            this.selectedItems.update(list => list.clear().add(connectedSelectedItem));
            connectedList.selectedItem.set(null);
            connectedList.selectedItems.update(list => list.clear());
        }
    }

    public onTransferToClick(event: MouseEvent): void {
        const connectedList = this.connectedList();
        const selectedItem = this.selectedItem();
        if (connectedList && selectedItem && !this.createAndEmitActionEvent("transferTo", event)) {
            connectedList.moveInto([selectedItem]);
            this.listBoxItems.update(list => list.remove(selectedItem));
            connectedList.selectedItem.set(selectedItem);
            connectedList.selectedItems.update(list => list.clear().add(selectedItem));
            this.selectedItem.set(null);
            this.selectedItems.update(list => list.clear());
        }
    }

    private getActiveListBox(): ListBoxComponent<T> | null {
        if (this.selectedItem() != null) {
            return this;
        }
        if (this.connectedList() != null) {
            return this.connectedList()!.getActiveListBox();
        }
        return null;
    }

    private getDefaultToolbarOptions(): ToolbarOptions {
        return {
            actions: ["moveDown", "moveUp", "remove", "transferAllFrom", "transferAllTo", "transferFrom", "transferTo"],
            position: "right"
        };
    }

    private scrollToSelectedItem(): void {
        const selectedItemElement = this.#hostElementRef.nativeElement.querySelector(".mona-selected");
        if (selectedItemElement) {
            selectedItemElement.scrollIntoView({ behavior: "auto", block: "center" });
        }
    }

    private updateToolbarOptions(options: boolean | Partial<ToolbarOptions>): ToolbarOptions | null {
        if (typeof options === "boolean") {
            return options ? this.getDefaultToolbarOptions() : null;
        } else if (options.actions && options.actions.length > 0 && options.position) {
            return options as Required<ToolbarOptions>;
        } else if (options.actions && options.actions.length > 0 && !options.position) {
            return { ...options, position: "right" } as Required<ToolbarOptions>;
        } else if ((!options.actions || options.actions.length === 0) && options.position) {
            return {
                ...options,
                actions: [
                    "moveDown",
                    "moveUp",
                    "remove",
                    "transferAllFrom",
                    "transferAllTo",
                    "transferFrom",
                    "transferTo"
                ]
            } as Required<ToolbarOptions>;
        }
        return null;
    }
}
