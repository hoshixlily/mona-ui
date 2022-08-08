import {
    AfterContentInit,
    Component,
    ContentChildren,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList
} from "@angular/core";
import { MenuItem } from "../../../context-menu/models/MenuItem";
import { Subject, takeUntil } from "rxjs";

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
        text: ""
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

    public constructor() {}

    public getMenuItem(): MenuItem {
        this.menuItem.menuClick = (): void => this.menuClick.emit();
        this.menuItem.subMenuItems = this.submenuItems.map(si => si.getMenuItem());
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
