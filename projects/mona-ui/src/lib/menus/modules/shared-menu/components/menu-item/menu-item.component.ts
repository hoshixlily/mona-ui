import {
    AfterContentInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef
} from "@angular/core";
import { MenuItem } from "../../../context-menu/models/MenuItem";
import { Subject, takeUntil } from "rxjs";
import { MenuItemTextTemplateDirective } from "../../directives/menu-item-text-template.directive";

@Component({
    selector: "mona-menu-item",
    template: "",
    styleUrls: []
})
export class MenuItemComponent implements OnInit, AfterContentInit, OnDestroy {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private menuItem: MenuItem = {
        disabled: false,
        divider: false,
        subMenuItems: [],
        text: "",
        visible: true
    };

    @Input()
    public set disabled(disabled: boolean) {
        this.menuItem.disabled = disabled;
    }

    @Input()
    public set divider(divider: boolean) {
        this.menuItem.divider = divider;
    }

    @Output()
    public menuClick: EventEmitter<void> = new EventEmitter<void>();

    @ContentChildren(MenuItemComponent)
    public submenuItems: QueryList<MenuItemComponent> = new QueryList<MenuItemComponent>();

    @Input()
    public set text(text: string) {
        this.menuItem.text = text;
    }

    @ContentChildren(MenuItemTextTemplateDirective, { read: TemplateRef, descendants: false })
    public textTemplate: QueryList<TemplateRef<void>> = new QueryList<TemplateRef<void>>();

    @Input()
    public set visible(visible: boolean) {
        this.menuItem.visible = visible;
    }

    public constructor() {}

    public getMenuItem(): MenuItem {
        this.menuItem.menuClick = (): void => this.menuClick.emit();
        this.menuItem.subMenuItems = this.submenuItems.map(si => si.getMenuItem());
        this.menuItem.textTemplate = this.textTemplate.get(0);
        return this.menuItem;
    }

    public ngAfterContentInit(): void {
        this.submenuItems.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.menuItem.subMenuItems = this.submenuItems.map(si => si.getMenuItem());
        });
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.unsubscribe();
    }

    public ngOnInit(): void {}
}
