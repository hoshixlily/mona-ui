import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PopupListItem } from "../../data/PopupListItem";

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

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {}
    public ngOnInit(): void {}
}
