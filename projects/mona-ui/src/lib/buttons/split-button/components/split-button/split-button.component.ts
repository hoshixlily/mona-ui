import { NgIf, NgTemplateOutlet } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ContextMenuComponent } from "../../../../menus/context-menu/context-menu.component";
import { MenuItemComponent } from "../../../../menus/menu-item/menu-item.component";
import { MenuItem } from "../../../../menus/models/MenuItem";
import { PopupOffset } from "../../../../popup/models/PopupOffset";
import { ButtonDirective } from "../../../button/button.directive";
import { SplitButtonTextTemplateDirective } from "../../directives/split-button-text-template.directive";

@Component({
    selector: "mona-split-button",
    templateUrl: "./split-button.component.html",
    styleUrls: ["./split-button.component.scss"],
    standalone: true,
    imports: [ButtonDirective, NgIf, NgTemplateOutlet, FontAwesomeModule, ContextMenuComponent]
})
export class SplitButtonComponent implements AfterViewInit, AfterContentInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    public readonly menuIcon: IconDefinition = faChevronDown;
    public menuItems: MenuItem[] = [];
    public popupOffset: PopupOffset = {
        horizontal: -1,
        vertical: 0
    };
    public popupWidth: number = 0;

    @Output()
    public buttonClick: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("contextMenuComponent")
    private readonly contextMenuComponent!: ContextMenuComponent;

    @Input()
    public disabled: boolean = false;

    @ViewChild("mainButton")
    private readonly mainButtonElementRef!: ElementRef<HTMLButtonElement>;

    @ContentChildren(MenuItemComponent)
    public menuItemComponents: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @Input()
    public text: string = "";

    @ContentChild(SplitButtonTextTemplateDirective, { read: TemplateRef })
    public textTemplate: TemplateRef<any> | null = null;

    @ViewChild("wrapperElementRef")
    private readonly wrapperElementRef!: ElementRef<HTMLDivElement>;

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterContentInit(): void {
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        this.menuItemComponents.changes.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
            this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.popupWidth = this.wrapperElementRef.nativeElement.getBoundingClientRect().width - 1;
            this.popupOffset.horizontal = -this.mainButtonElementRef.nativeElement.getBoundingClientRect().width - 1;
            this.contextMenuComponent.setPrecise(false);
            this.cdr.detectChanges();
        });
    }
}
