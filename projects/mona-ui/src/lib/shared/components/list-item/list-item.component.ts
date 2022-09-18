import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { ListItem } from "../../data/ListItem";
import { Highlightable } from "@angular/cdk/a11y";

@Component({
    selector: "mona-list-item",
    templateUrl: "./list-item.component.html",
    styleUrls: ["./list-item.component.scss"]
})
export class ListItemComponent implements OnInit, Highlightable {
    @Input()
    public item!: ListItem;

    @Input()
    public itemTemplate?: TemplateRef<void>;

    public constructor() {}

    public ngOnInit(): void {}

    public setActiveStyles(): void {}

    public setInactiveStyles(): void {}
}
