import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PopupOffset } from "../../../../../popup/models/PopupOffset";

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

    @ViewChild("mainButton")
    private readonly mainButtonElementRef!: ElementRef<HTMLButtonElement>;

    @ViewChild("wrapperElementRef")
    private readonly wrapperElementRef!: ElementRef<HTMLDivElement>;

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        this.popupWidth = this.wrapperElementRef.nativeElement.getBoundingClientRect().width;
        this.popupOffset.horizontal = -this.mainButtonElementRef.nativeElement.offsetWidth - 1;
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {}
}
