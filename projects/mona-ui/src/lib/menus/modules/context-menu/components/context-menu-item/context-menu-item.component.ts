import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "../../models/MenuItem";
import { faStar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupRef } from "../../../../../popup/models/PopupRef";

@Component({
    selector: "mona-contextmenu-item",
    templateUrl: "./context-menu-item.component.html",
    styleUrls: ["./context-menu-item.component.scss"]
})
export class ContextMenuItemComponent implements OnInit, OnDestroy {
    public readonly starIcon: IconDefinition = faStar;

    @Input()
    public menuItem!: MenuItem;

    @Input()
    public submenuPopupRef?: PopupRef | null;

    public constructor() {}
    public ngOnDestroy(): void {
        this.submenuPopupRef?.close();
    }
    public ngOnInit(): void {}
}
