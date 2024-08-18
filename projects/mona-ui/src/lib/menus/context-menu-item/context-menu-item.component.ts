import { Highlightable } from "@angular/cdk/a11y";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { PopupRef } from "../../popup/models/PopupRef";
import { MenuItem } from "../models/MenuItem";

@Component({
    selector: "mona-contextmenu-item",
    templateUrl: "./context-menu-item.component.html",
    styleUrls: ["./context-menu-item.component.scss"],
    standalone: true,
    imports: [NgClass, NgTemplateOutlet, FontAwesomeModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuItemComponent implements OnDestroy, Highlightable {
    protected readonly linkIcon = faChevronRight;
    public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
    public iconSpaceVisible = input(false);
    public linkSpaceVisible = input(false);
    public menuItem = input.required<MenuItem>();
    public submenuPopupRef = input<PopupRef | null>(null);

    public ngOnDestroy(): void {
        this.submenuPopupRef()?.close();
    }

    public setActiveStyles(): void {}

    public setInactiveStyles(): void {}
}
