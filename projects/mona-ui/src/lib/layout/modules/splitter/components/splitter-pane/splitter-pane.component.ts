import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";

@Component({
    selector: "mona-splitter-pane",
    templateUrl: "./splitter-pane.component.html",
    styleUrls: ["./splitter-pane.component.scss"]
})
export class SplitterPaneComponent implements OnInit {
    public readonly uid: string = crypto.randomUUID();
    public lastSize?: string;
    public paneSize?: string;
    public isStatic = false;

    @Input()
    public collapsed: boolean = false;

    @Input()
    public collapsible: boolean = true;

    @Input()
    public element!: HTMLDivElement;

    @Input()
    public set size(size: string | number) {
        this.paneSize = typeof size === "string" ? size : `${size}px`;
        this.isStatic = true;
    }

    @ViewChild(TemplateRef)
    public templateRef: TemplateRef<never> | null = null;

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {}
    public ngOnInit(): void {}

    public setLastSize(size: string | number | undefined): void {
        this.lastSize = size == null ? size : typeof size === "string" ? size : `${size}px`;
    }

    public setSize(size: string | number | undefined): void {
        this.paneSize = size == null ? size : typeof size === "string" ? size : `${size}px`;
        // this.sizeChange.emit(size);
    }
}
