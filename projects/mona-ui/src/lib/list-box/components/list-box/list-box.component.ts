import { ChangeDetectionStrategy, Component, ElementRef, Input, signal, WritableSignal } from "@angular/core";
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

@Component({
    selector: "mona-list-box",
    templateUrl: "./list-box.component.html",
    styleUrls: ["./list-box.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListBoxComponent<T> {
    public readonly moveDownIcon: IconDefinition = faAngleDown;
    public readonly moveUpIcon: IconDefinition = faAngleUp;
    public readonly removeIcon: IconDefinition = faTrash;
    public readonly transferAllLeftIcon: IconDefinition = faAnglesLeft;
    public readonly transferAllRightIcon: IconDefinition = faAnglesRight;
    public readonly transferLeftIcon: IconDefinition = faAngleLeft;
    public readonly transferRightIcon: IconDefinition = faAngleRight;
    public listBoxItems: WritableSignal<List<T>> = signal(new List<T>());
    public selectedItem: T | null = null;
    public selectedItems: List<T> = new List<T>();

    @Input()
    public connectedList: ListBoxComponent<T> | null = null;

    @Input()
    public set items(value: Iterable<T>) {
        this.listBoxItems.set(new List<T>(value));
    }

    @Input()
    public textField: string = "";

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

    public onTransferAllLeftClick(): void {
        if (this.connectedList) {
            this.moveInto(this.connectedList.listBoxItems());
            this.connectedList.listBoxItems.set(new List<T>());
            this.connectedList.selectedItem = null;
            this.connectedList.selectedItems = new List<T>();
        }
    }

    public onTransferAllRightClick(): void {
        if (this.connectedList) {
            this.connectedList.moveInto(this.listBoxItems());
            this.listBoxItems.set(new List<T>());
            this.selectedItem = null;
            this.selectedItems = new List<T>();
        }
    }

    public onTransferLeftClick(): void {
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

    public onTransferRightClick(): void {
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

    private scrollToSelectedItem(): void {
        const selectedItemElement = this.elementRef.nativeElement.querySelector(".mona-selected");
        if (selectedItemElement) {
            selectedItemElement.scrollIntoView({ behavior: "auto", block: "center" });
        }
    }
}
