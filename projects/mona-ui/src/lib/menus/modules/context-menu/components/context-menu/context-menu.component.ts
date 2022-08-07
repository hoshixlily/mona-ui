import { Component, Input, NgZone, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import { ContextMenuService } from "../../services/context-menu.service";
import { ContextMenuContentComponent } from "../context-menu-content/context-menu-content.component";
import { MenuItem } from "../../models/MenuItem";
import { ContextMenuInjectorData } from "../../models/ContextMenuInjectorData";
import { PopupRef } from "../../../../../popup/models/PopupRef";
import { Subject } from "rxjs";

@Component({
    selector: "mona-contextmenu",
    templateUrl: "./context-menu.component.html",
    styleUrls: ["./context-menu.component.scss"]
})
export class ContextMenuComponent implements OnInit, OnDestroy {
    private contextMenuRef: PopupRef | null = null;
    private precise: boolean = true;
    private submenuCloseNotifier: Subject<void> = new Subject();
    private targetListener: () => void = () => void 0;

    public menuItems: MenuItem[] = [
        { text: "Item 1" },
        { text: "Item 2", subMenuItems: [{ text: "Subitem 21" }, { text: "Subitem 22" }] },
        {
            text: "Item 3",
            subMenuItems: [
                { text: "Subitem 31" },
                { text: "Subitem 32" },
                {
                    text: "Subitem 33",
                    subMenuItems: [
                        { text: "Subitem 331" },
                        { text: "Subitem 332" },
                        {
                            text: "Subitem 333",
                            subMenuItems: [
                                { text: "Subitem 3331" },
                                {
                                    text: "Subitem 3332",
                                    subMenuItems: [{ text: "Subitem 33321" }, { text: "Subitem 33322" }]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    @Input()
    public target!: FlexibleConnectedPositionStrategyOrigin;

    @Input()
    public trigger: string = "contextmenu";

    public constructor(
        private readonly contextMenuService: ContextMenuService,
        private readonly renderer: Renderer2,
        private zone: NgZone
    ) {}

    public ngOnDestroy(): void {
        this.targetListener?.();
        this.submenuCloseNotifier.next();
        this.submenuCloseNotifier.complete();
    }

    public ngOnInit(): void {
        this.setEventListeners();
    }

    public setPrecise(precise: boolean): void {
        this.precise = precise;
    }

    private create(event: PointerEvent): void {
        this.contextMenuRef = this.contextMenuService.open({
            anchor: this.precise ? { x: event.x, y: event.y } : this.target,
            content: ContextMenuContentComponent,
            data: { menuItems: this.menuItems, parentClose: this.submenuCloseNotifier } as ContextMenuInjectorData,
            popupClass: ["mona-contextmenu-content"]
        });
    }

    private setEventListeners(): void {
        this.zone.runOutsideAngular(() => {
            this.targetListener = this.renderer.listen(this.target, this.trigger, (event: PointerEvent) => {
                event.stopPropagation();
                event.preventDefault();
                this.zone.run(() => {
                    this.create(event);
                });
            });
        });
        if (this.contextMenuRef) {
            this.contextMenuRef.closed.subscribe(() => {
                this.submenuCloseNotifier.next();
                this.targetListener();
            });
        }
    }
}
