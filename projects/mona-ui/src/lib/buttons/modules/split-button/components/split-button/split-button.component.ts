import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    QueryList,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { PopupOffset } from "../../../../../popup/models/PopupOffset";
import { ContextMenuComponent } from "../../../../../menus/modules/context-menu/components/context-menu/context-menu.component";
import { MenuItemComponent } from "../../../../../menus/modules/shared-menu/components/menu-item/menu-item.component";
import { MenuItem } from "../../../../../menus/modules/context-menu/models/MenuItem";
import { Subject, takeUntil } from "rxjs";
import { SplitButtonTextTemplateDirective } from "../../directives/split-button-text-template.directive";
import { faChevronDown, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-split-button",
    templateUrl: "./split-button.component.html",
    styleUrls: ["./split-button.component.scss"]
})
export class SplitButtonComponent implements AfterViewInit, AfterContentInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    public readonly menuIcon: IconDefinition = faChevronDown;
    public menuItems: MenuItem[] = [];
    public popupOffset: PopupOffset = {
        horizontal: 0,
        vertical: 0.5
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
    public textTemplate: TemplateRef<void> | null = null;

    @ViewChild("wrapperElementRef")
    private readonly wrapperElementRef!: ElementRef<HTMLDivElement>;

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterContentInit(): void {
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        this.menuItemComponents.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        });
    }

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.popupWidth = this.wrapperElementRef.nativeElement.getBoundingClientRect().width - 1;
            this.popupOffset.horizontal = -this.mainButtonElementRef.nativeElement.offsetWidth - 1;
            this.contextMenuComponent.setPrecise(false);
            this.cdr.detectChanges();
        });
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
}
