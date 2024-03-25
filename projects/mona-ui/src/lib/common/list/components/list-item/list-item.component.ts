import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    InputSignal,
    Signal,
    TemplateRef
} from "@angular/core";
import { ListItem } from "../../models/ListItem";
import { ListItemTemplateContext } from "../../models/ListItemTemplateContext";
import { ListService } from "../../services/list.service";

@Component({
    selector: "mona-list-item",
    standalone: true,
    imports: [NgClass, NgTemplateOutlet],
    templateUrl: "./list-item.component.html",
    styleUrl: "./list-item.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent<TData> {
    protected readonly dataItem: Signal<TData | null> = computed(() => this.item()?.data ?? null);
    protected readonly itemText: Signal<string> = computed(() => {
        const item = this.item();
        if (item == null) {
            return "";
        }
        if (item.header) {
            return item.header;
        }
        return this.listService.getItemText(item);
    });
    protected readonly listService: ListService<TData> = inject(ListService);

    public item: InputSignal<ListItem<TData>> = input.required();
    public template = input<TemplateRef<ListItemTemplateContext<TData>> | null>(null);
}
