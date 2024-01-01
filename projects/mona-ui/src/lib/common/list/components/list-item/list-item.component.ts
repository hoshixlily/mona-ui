import { NgClass } from "@angular/common";
import { Component, computed, Input, signal, Signal, WritableSignal } from "@angular/core";
import { ListItem } from "../../models/ListItem";
import { ListService } from "../../services/list.service";

@Component({
    selector: "mona-list-item",
    standalone: true,
    imports: [NgClass],
    templateUrl: "./list-item.component.html",
    styleUrl: "./list-item.component.scss"
})
export class ListItemComponent {
    readonly #item: WritableSignal<ListItem | null> = signal(null);
    protected readonly itemText: Signal<string> = computed(() => {
        const item = this.#item();
        if (item == null) {
            return "";
        }
        if (item.header) {
            return item.header;
        }
        return this.listService.getItemText(item);
    });

    @Input({ required: true })
    public set item(value: ListItem) {
        this.#item.set(value);
    }

    public constructor(protected readonly listService: ListService) {}
}
