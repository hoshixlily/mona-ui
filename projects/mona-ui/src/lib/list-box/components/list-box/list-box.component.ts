import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    Input,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
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
import { Collections, Enumerable, List } from "@mirei/ts-collections";
import { ListBoxItemTemplateDirective } from "../../directives/list-box-item-template.directive";
import { ListBoxItemTemplateContext } from "../../models/ListBoxItemTemplateContext";
import { ToolbarOptions } from "../../models/ToolbarOptions";

type ListBoxDirection = "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";

@Component({
    selector: "mona-list-box",
    templateUrl: "./list-box.component.html",
    styleUrls: ["./list-box.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListBoxComponent<T = any> {
    public readonly moveDownIcon: IconDefinition = faAngleDown;
    public readonly moveUpIcon: IconDefinition = faAngleUp;
    public readonly removeIcon: IconDefinition = faTrash;
    public readonly transferAllFromIcon: IconDefinition = faAnglesLeft;
    public readonly transferAllToIcon: IconDefinition = faAnglesRight;
    public readonly transferFromIcon: IconDefinition = faAngleLeft;
    public readonly transferToIcon: IconDefinition = faAngleRight;
    public direction: WritableSignal<ListBoxDirection> = signal("horizontal");
    public listBoxItems: WritableSignal<List<T>> = signal(new List<T>());
    public selectedItem: T | null = null;
    public selectedItems: List<T> = new List<T>();
    public toolbarOptions: ToolbarOptions | null = this.getDefaultToolbarOptions();

    @Input()
    public connectedList: ListBoxComponent<T> | null = null;

    @ContentChild(ListBoxItemTemplateDirective, { read: TemplateRef })
    public itemTemplate: TemplateRef<ListBoxItemTemplateContext> | null = null;

    @Input()
    public set items(value: Iterable<T>) {
        this.listBoxItems.set(new List<T>(value));
    }

    @Input()
    public textField: string = "";

    @Input()
    public set toolbar(value: boolean | Partial<ToolbarOptions>) {
        this.updateToolbarOptions(value);
    }

    public constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    public moveInto(items: Iterable<T>) {
        const itemsToAdd = Enumerable.from(items).where(item => !this.listBoxItems().contains(item));
        this.listBoxItems.set(this.listBoxItems().concat(itemsToAdd).toList());
    }

    public onMoveDownClick(): void {
        if (this.selectedItem) {
            const index = this.listBoxItems().indexOf(this.selectedItem);
            if (index < this.listBoxItems().length - 1) {
                Collections.swap(this.listBoxItems(), index, index + 1);
                this.listBoxItems.set(new List<T>(this.listBoxItems()));
                this.scrollToSelectedItem();
            }
        }
    }

    public onMoveUpClick(): void {
        if (this.selectedItem) {
            const index = this.listBoxItems().indexOf(this.selectedItem);
            if (index > 0) {
                Collections.swap(this.listBoxItems(), index, index - 1);
                this.listBoxItems.set(new List<T>(this.listBoxItems()));
                this.scrollToSelectedItem();
            }
        }
    }

    public onRemoveClick(): void {
        if (this.selectedItem) {
            const index = this.listBoxItems().indexOf(this.selectedItem);
            this.listBoxItems().removeAt(index);
            this.listBoxItems.set(new List<T>(this.listBoxItems()));
        }
    }

    public onSelectedItemChange(items: T[]): void {
        this.selectedItems = new List<T>(items);
        this.selectedItem = items[0];
    }

    public onTransferAllFromClick(): void {
        if (this.connectedList) {
            this.moveInto(this.connectedList.listBoxItems());
            this.connectedList.listBoxItems.set(new List<T>());
            this.connectedList.selectedItem = null;
            this.connectedList.selectedItems = new List<T>();
        }
    }

    public onTransferAllToClick(): void {
        if (this.connectedList) {
            this.connectedList.moveInto(this.listBoxItems());
            this.listBoxItems.set(new List<T>());
            this.selectedItem = null;
            this.selectedItems = new List<T>();
        }
    }

    public onTransferFromClick(): void {
        if (this.connectedList && this.connectedList.selectedItem) {
            this.moveInto([this.connectedList.selectedItem]);
            this.connectedList.listBoxItems().remove(this.connectedList.selectedItem);
            this.connectedList.listBoxItems.set(new List<T>(this.connectedList.listBoxItems()));
            this.selectedItem = this.connectedList.selectedItem;
            this.selectedItems = new List<T>([this.connectedList.selectedItem]);
            this.connectedList.selectedItem = null;
            this.connectedList.selectedItems = new List<T>();
        }
    }

    public onTransferToClick(): void {
        if (this.connectedList && this.selectedItem) {
            this.connectedList.moveInto([this.selectedItem]);
            this.listBoxItems().remove(this.selectedItem);
            this.listBoxItems.set(new List<T>(this.listBoxItems()));
            this.connectedList.selectedItem = this.selectedItem;
            this.connectedList.selectedItems = new List<T>([this.selectedItem]);
            this.selectedItem = null;
            this.selectedItems = new List<T>();
        }
    }

    private getDefaultToolbarOptions(): ToolbarOptions {
        return {
            actions: ["moveDown", "moveUp", "remove", "transferAllFrom", "transferAllTo", "transferFrom", "transferTo"],
            position: "right"
        };
    }

    private scrollToSelectedItem(): void {
        const selectedItemElement = this.elementRef.nativeElement.querySelector(".mona-selected");
        if (selectedItemElement) {
            selectedItemElement.scrollIntoView({ behavior: "auto", block: "center" });
        }
    }

    private updateDirection(): void {
        if (this.toolbarOptions) {
            switch (this.toolbarOptions.position) {
                case "right":
                    this.direction.set("horizontal");
                    break;
                case "left":
                    this.direction.set("horizontal-reverse");
                    break;
                case "top":
                    this.direction.set("vertical-reverse");
                    break;
                case "bottom":
                    this.direction.set("vertical");
                    break;
            }
        }
    }

    private updateToolbarOptions(options: boolean | Partial<ToolbarOptions>) {
        if (typeof options === "boolean") {
            this.toolbarOptions = options ? this.getDefaultToolbarOptions() : null;
        } else {
            if (options.actions && options.actions.length > 0 && options.position) {
                this.toolbarOptions = options as Required<ToolbarOptions>;
            } else if (options.actions && options.actions.length > 0 && !options.position) {
                this.toolbarOptions = { ...options, position: "right" } as Required<ToolbarOptions>;
            } else if ((!options.actions || options.actions.length === 0) && options.position) {
                this.toolbarOptions = {
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
        }
        this.updateDirection();
    }
}
