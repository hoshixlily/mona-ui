import { Directive, effect, ElementRef, inject, input, Renderer2 } from "@angular/core";
import { ListItem } from "../models/ListItem";
import { ListService } from "../services/list.service";

@Directive({
    selector: "li[monaListItem]",
    standalone: true
})
export class ListItemDirective<TData> {
    readonly #host: ElementRef<HTMLLIElement> = inject(ElementRef);
    readonly #listService: ListService<TData> = inject(ListService);
    readonly #renderer: Renderer2 = inject(Renderer2);

    public item = input.required<ListItem<TData>>();

    public constructor() {
        effect(() => {
            const item = this.item();
            this.updateDisabled(item);
            this.updateHighlighted(item);
            this.updateSelected(item);
        });
    }

    private updateDisabled(item: ListItem<TData> | null): void {
        const disabled = item ? this.#listService.isDisabled(item) : false;
        if (disabled) {
            this.#renderer.addClass(this.#host.nativeElement, "mona-disabled");
        } else {
            this.#renderer.removeClass(this.#host.nativeElement, "mona-disabled");
        }
    }

    private updateHighlighted(item: ListItem<TData> | null): void {
        const highlighted = item ? this.#listService.isHighlighted(item) : false;
        if (highlighted) {
            this.#renderer.addClass(this.#host.nativeElement, "mona-highlighted");
        } else {
            this.#renderer.removeClass(this.#host.nativeElement, "mona-highlighted");
        }
    }

    private updateSelected(item: ListItem<TData> | null): void {
        const selected = item ? this.#listService.isSelected(item) : false;
        if (selected) {
            this.#renderer.addClass(this.#host.nativeElement, "mona-selected");
        } else {
            this.#renderer.removeClass(this.#host.nativeElement, "mona-selected");
        }
    }
}
