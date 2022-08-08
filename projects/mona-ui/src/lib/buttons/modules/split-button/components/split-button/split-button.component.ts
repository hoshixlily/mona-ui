import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PopupOffset } from "../../../../../popup/models/PopupOffset";
import { ContextMenuComponent } from "../../../../../menus/modules/context-menu/components/context-menu/context-menu.component";

@Component({
    selector: "mona-split-button",
    templateUrl: "./split-button.component.html",
    styleUrls: ["./split-button.component.scss"]
})
export class SplitButtonComponent implements OnInit, AfterViewInit {
    public popupOffset: PopupOffset = {
        horizontal: 0,
        vertical: 0.5
    };
    public popupWidth: number = 0;

    @ViewChild("contextMenuComponent")
    private readonly contextMenuComponent!: ContextMenuComponent;

    @ViewChild("mainButton")
    private readonly mainButtonElementRef!: ElementRef<HTMLButtonElement>;

    @ViewChild("wrapperElementRef")
    private readonly wrapperElementRef!: ElementRef<HTMLDivElement>;

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        this.popupWidth = this.wrapperElementRef.nativeElement.getBoundingClientRect().width - 1;
        this.popupOffset.horizontal = -this.mainButtonElementRef.nativeElement.offsetWidth - 1;
        this.contextMenuComponent.setPrecise(false);
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {}
}
