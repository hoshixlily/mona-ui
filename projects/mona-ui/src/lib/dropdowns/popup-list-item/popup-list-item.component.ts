import { Component, ElementRef, Input, OnInit, TemplateRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopupListItem } from "../models/PopupListItem";

@Component({
    selector: "mona-popup-list-item",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./popup-list-item.component.html",
    styleUrls: ["./popup-list-item.component.scss"]
})
export class PopupListItemComponent implements OnInit {
    @Input()
    public item: PopupListItem | null = null;

    @Input()
    public itemTemplate?: TemplateRef<any>;

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {}
    public ngOnInit(): void {}
}
