import { NgIf } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    DestroyRef,
    ElementRef,
    inject,
    Input,
    QueryList,
    signal,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ContextMenuComponent } from "../../menus/context-menu/context-menu.component";
import { MenuItemComponent } from "../../menus/menu-item/menu-item.component";
import { MenuItem } from "../../menus/models/MenuItem";
import { ButtonDirective } from "../button/button.directive";

@Component({
    selector: "mona-drop-down-button",
    templateUrl: "./drop-down-button.component.html",
    styleUrls: ["./drop-down-button.component.scss"],
    standalone: true,
    imports: [ButtonDirective, NgIf, ContextMenuComponent]
})
export class DropDownButtonComponent implements AfterViewInit, AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #resizeObserver: ResizeObserver | null = null;
    public menuItems: MenuItem[] = [];
    public popupWidth: WritableSignal<number> = signal(0);

    @ViewChild("contextMenuComponent")
    private readonly contextMenuComponent!: ContextMenuComponent;

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownButton", { read: ElementRef })
    public buttonElement!: ElementRef<HTMLButtonElement>;

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    public constructor() {
        this.#destroyRef.onDestroy(() => {
            this.#resizeObserver?.disconnect();
        });
    }

    public ngAfterContentInit(): void {
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        this.menuItemComponents.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.contextMenuComponent.setPrecise(false);
            this.popupWidth.set(this.buttonElement.nativeElement.offsetWidth);
        });
        this.#resizeObserver = new ResizeObserver(() => {
            this.popupWidth.set(this.buttonElement.nativeElement.offsetWidth);
        });
        this.#resizeObserver.observe(this.buttonElement.nativeElement);
    }
}
