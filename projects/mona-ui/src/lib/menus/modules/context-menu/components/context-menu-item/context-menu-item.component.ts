import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { faStar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Highlightable } from "@angular/cdk/a11y";
import { ContextMenuItem } from "../../models/ContextMenuItem";

@Component({
    selector: "mona-contextmenu-item",
    templateUrl: "./context-menu-item.component.html",
    styleUrls: ["./context-menu-item.component.scss"]
})
export class ContextMenuItemComponent implements OnInit, OnDestroy, Highlightable {
    public readonly starIcon: IconDefinition = faStar;

    @Input()
    public iconSpaceVisible: boolean = false;

    @Input()
    public linkSpaceVisible: boolean = false;

    @Input()
    public menuItem!: ContextMenuItem;

    @Input()
    public submenuPopupRef?: PopupRef | null;

    public constructor(public readonly elementRef: ElementRef) {}
    public ngOnDestroy(): void {
        this.submenuPopupRef?.close();
    }
    public ngOnInit(): void {}

    public setActiveStyles(): void {
        if (this.menuItem && !this.menuItem.disabled) {
            this.menuItem.focused = true;
        }
    }

    public setInactiveStyles(): void {
        if (this.menuItem) {
            this.menuItem.focused = false;
        }
    }
}
