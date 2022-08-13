import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { DropDownListDataItem } from "../../models/DropDownListDataItem";

@Component({
    selector: "mona-drop-down-list-item",
    templateUrl: "./drop-down-list-item.component.html",
    styleUrls: ["./drop-down-list-item.component.scss"]
})
export class DropDownListItemComponent implements OnInit {
    @Input()
    public dataItem: DropDownListDataItem | null = null;

    @Input()
    public itemTemplate?: TemplateRef<void>;

    public constructor() {}
    public ngOnInit(): void {}
}
