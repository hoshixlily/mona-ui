import { Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { MenuItem } from "../models/MenuItem";
import { faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { PopupRef } from "../../popup/models/PopupRef";
import { Highlightable } from "@angular/cdk/a11y";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgIf, NgClass, NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "mona-contextmenu-item",
    templateUrl: "./context-menu-item.component.html",
    styleUrls: ["./context-menu-item.component.scss"],
    standalone: true,
    imports: [NgIf, NgClass, NgTemplateOutlet, FontAwesomeModule]
})
export class ContextMenuItemComponent implements OnInit, OnDestroy, Highlightable {
    public readonly linkIcon: IconDefinition = faChevronRight;

    @Input()
    public iconSpaceVisible: boolean = false;

    @Input()
    public linkSpaceVisible: boolean = false;

    @Input()
    public menuItem!: MenuItem;

    @Input()
    public submenuPopupRef?: PopupRef | null;

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {}

    public ngOnDestroy(): void {
        this.submenuPopupRef?.close();
    }

    public ngOnInit(): void {}

    public setActiveStyles(): void {}

    public setInactiveStyles(): void {}
}
