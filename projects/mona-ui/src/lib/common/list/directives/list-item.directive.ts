import { Directive, effect, ElementRef, Input, Renderer2, signal, WritableSignal } from "@angular/core";
import { ListItem } from "../models/ListItem";
import { ListService } from "../services/list.service";

@Directive({
    selector: "li[monaListItem]",
    standalone: true
})
export class ListItemDirective {
    readonly #item: WritableSignal<ListItem | null> = signal(null);

    @Input({ required: true })
    public set item(value: ListItem) {
        this.#item.set(value);
    }

    public constructor(
        private readonly host: ElementRef<HTMLLIElement>,
        private readonly listService: ListService,
        private readonly renderer: Renderer2
    ) {
        effect(() => {
            const item = this.#item();
            this.updateDisabled(item);
            this.updateSelected(item);
        });
    }

    private updateDisabled(item: ListItem | null): void {
        const disabled = item ? this.listService.isDisabled(item) : false;
        if (disabled) {
            this.renderer.addClass(this.host.nativeElement, "mona-disabled");
        } else {
            this.renderer.removeClass(this.host.nativeElement, "mona-disabled");
        }
    }

    private updateSelected(item: ListItem | null): void {
        const selected = item ? this.listService.isSelected(item) : false;
        if (selected) {
            this.renderer.addClass(this.host.nativeElement, "mona-selected");
        } else {
            this.renderer.removeClass(this.host.nativeElement, "mona-selected");
        }
    }
}
