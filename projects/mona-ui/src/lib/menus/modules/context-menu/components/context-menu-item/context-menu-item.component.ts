import { Component, Input, OnInit } from "@angular/core";
import { MenuItem } from "../../models/MenuItem";
import { faStar, IconDefinition } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "mona-contextmenu-item",
    templateUrl: "./context-menu-item.component.html",
    styleUrls: ["./context-menu-item.component.scss"]
})
export class ContextMenuItemComponent implements OnInit {
    public readonly starIcon: IconDefinition = faStar;

    @Input()
    public menuItem!: MenuItem;

    public constructor() {}
    public ngOnInit(): void {}
}
