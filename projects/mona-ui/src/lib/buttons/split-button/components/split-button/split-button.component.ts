import { NgTemplateOutlet } from "@angular/common";
import {
    Component,
    computed,
    contentChild,
    contentChildren,
    effect,
    ElementRef,
    inject,
    input,
    InputSignal,
    output,
    OutputEmitterRef,
    Signal,
    TemplateRef,
    untracked,
    viewChild
} from "@angular/core";
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
    imports: [ButtonDirective, NgTemplateOutlet, FontAwesomeModule, ContextMenuComponent],
    host: {
        "[class.mona-split-button]": "true",
        "[class.mona-disabled]": "disabled()",
        "[attr.tabindex]": "tabindex()"
    }
})
export class SplitButtonComponent {
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    protected readonly buttonClick: OutputEmitterRef<MouseEvent> = output();
    protected readonly contextMenuComponent: Signal<ContextMenuComponent> = viewChild.required("contextMenuComponent");
    protected readonly mainButtonElementRef = viewChild.required<ElementRef>("mainButton");
    protected readonly menuIcon: IconDefinition = faChevronDown;
    protected readonly menuItemComponents: Signal<readonly MenuItemComponent[]> = contentChildren(MenuItemComponent);
    protected readonly menuItems: Signal<readonly MenuItem[]> = computed(() =>
        this.menuItemComponents().map(m => m.getMenuItem())
    );
    protected readonly textTemplate = contentChild(SplitButtonTextTemplateDirective, { read: TemplateRef });

    public disabled: InputSignal<boolean> = input(false);
    public popupOffset: PopupOffset = {
        horizontal: -1,
        vertical: 0
    };
    public popupWidth: number = 0;
    public tabindex: InputSignal<number | string> = input<number | string>(0);
    public text: InputSignal<string> = input("");

    public constructor() {
        effect(() => {
            const contextMenuComponent = this.contextMenuComponent();
            untracked(() => {
                if (contextMenuComponent) {
                    contextMenuComponent.setPrecise(false);
                }
            });
        });
        effect(() => {
            const mainButtonElement = this.mainButtonElementRef().nativeElement;
            untracked(() => {
                if (mainButtonElement) {
                    this.popupWidth = this.#hostElementRef.nativeElement.getBoundingClientRect().width - 1;
                    this.popupOffset.horizontal = -mainButtonElement.getBoundingClientRect().width;
                }
            });
        });
    }
}
