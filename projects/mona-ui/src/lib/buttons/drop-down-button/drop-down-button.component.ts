import {
    AfterViewInit,
    Component,
    computed,
    contentChildren,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    Signal,
    signal,
    viewChild,
    WritableSignal
} from "@angular/core";
import { ContextMenuComponent } from "../../menus/context-menu/context-menu.component";
import { MenuItemComponent } from "../../menus/menu-item/menu-item.component";
import { MenuItem } from "../../menus/models/MenuItem";
import { ButtonDirective } from "../button/button.directive";

@Component({
    selector: "mona-drop-down-button",
    templateUrl: "./drop-down-button.component.html",
    styleUrls: ["./drop-down-button.component.scss"],
    standalone: true,
    imports: [ButtonDirective, ContextMenuComponent],
    host: {
        "[class.mona-drop-down-button]": "true"
    }
})
export class DropDownButtonComponent implements AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #resizeObserver: ResizeObserver | null = null;

    protected readonly buttonElement: Signal<ElementRef<HTMLButtonElement>> = viewChild.required("dropdownButton", {
        read: ElementRef
    });
    protected readonly contextMenuComponent: Signal<ContextMenuComponent> = viewChild.required("contextMenuComponent");
    protected readonly menuItemComponents: Signal<readonly MenuItemComponent[]> = contentChildren(MenuItemComponent);
    protected readonly menuItems: Signal<readonly MenuItem[]> = computed(() =>
        this.menuItemComponents().map(m => m.getMenuItem())
    );

    public disabled: InputSignal<boolean> = input(false);
    public popupWidth: WritableSignal<number> = signal(0);

    public constructor() {
        this.#destroyRef.onDestroy(() => {
            this.#resizeObserver?.disconnect();
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.contextMenuComponent().setPrecise(false);
            this.popupWidth.set(this.buttonElement().nativeElement.offsetWidth);
        });
        this.#resizeObserver = new ResizeObserver(() => {
            this.popupWidth.set(this.buttonElement().nativeElement.offsetWidth);
        });
        this.#resizeObserver.observe(this.buttonElement().nativeElement);
    }
}
