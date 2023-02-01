import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import { MenuComponent } from "../menu/menu.component";
import { ContextMenuComponent } from "../../../context-menu/components/context-menu/context-menu.component";

@Component({
    selector: "mona-menubar",
    templateUrl: "./menubar.component.html",
    styleUrls: ["./menubar.component.scss"]
})
export class MenubarComponent implements OnInit, AfterViewInit {
    @ViewChildren(ContextMenuComponent)
    private readonly contextMenuComponents: QueryList<ContextMenuComponent> = new QueryList<ContextMenuComponent>();

    @ContentChildren(MenuComponent)
    public menuList: QueryList<MenuComponent> = new QueryList<MenuComponent>();

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.cdr.detectChanges();
        });
    }
    public ngOnInit(): void {}
}
