import { Component, Input, OnInit } from "@angular/core";
import { MenuItem } from "../../models/MenuItem";

@Component({
    selector: "mona-contextmenu-item",
    templateUrl: "./context-menu-item.component.html",
    styleUrls: ["./context-menu-item.component.scss"]
})
export class ContextMenuItemComponent implements OnInit {
    @Input()
    public menuItem!: MenuItem;

    public constructor() {}
    public ngOnInit(): void {
        console.log(this.menuItem);
    }
}
