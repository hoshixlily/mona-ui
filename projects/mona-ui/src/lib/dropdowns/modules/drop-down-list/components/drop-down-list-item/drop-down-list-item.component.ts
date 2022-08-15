import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { DropDownListDataItem } from "../../models/DropDownListDataItem";
import { Highlightable } from "@angular/cdk/a11y";

@Component({
    selector: "mona-drop-down-list-item",
    templateUrl: "./drop-down-list-item.component.html",
    styleUrls: ["./drop-down-list-item.component.scss"]
})
export class DropDownListItemComponent implements OnInit, Highlightable {
    @Input()
    public dataItem!: DropDownListDataItem;

    @Input()
    public itemTemplate?: TemplateRef<void>;

    public constructor() {}
    public ngOnInit(): void {}
    public setActiveStyles(): void {}
    public setInactiveStyles(): void {}
}
