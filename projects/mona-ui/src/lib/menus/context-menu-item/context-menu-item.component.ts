import { Highlightable } from "@angular/cdk/a11y";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    Input,
    InputSignal,
    OnDestroy
} from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
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
    protected readonly linkIcon: IconDefinition = faChevronRight;
    public readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
    public iconSpaceVisible: InputSignal<boolean> = input(false);
    public linkSpaceVisible: InputSignal<boolean> = input(false);
    public submenuPopupRef: InputSignal<PopupRef | null> = input<PopupRef | null>(null);

    @Input()
    public menuItem!: MenuItem;

    public ngOnDestroy(): void {
        this.submenuPopupRef()?.close();
    }

    public setActiveStyles(): void {}

    public setInactiveStyles(): void {}
}
