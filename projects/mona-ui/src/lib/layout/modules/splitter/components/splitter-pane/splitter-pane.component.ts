import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";

@Component({
    selector: "mona-splitter-pane",
    templateUrl: "./splitter-pane.component.html",
    styleUrls: ["./splitter-pane.component.scss"]
})
export class SplitterPaneComponent implements OnInit {
    public readonly uid: string = crypto.randomUUID();
    public paneSize?: string;
    public isStatic = false;

    @Input()
    public collapsed: boolean = false;

    @Input()
    public collapsible: boolean = false;

    @Input()
    public element!: HTMLDivElement;

    @Input()
    public set size(size: string | number | undefined) {
        this.paneSize = size == null ? undefined : typeof size === "string" ? size : `${size}px`;
        this.isStatic = true;
    }

    @Output()
    public sizeChange: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

    @ViewChild(TemplateRef)
    public templateRef: TemplateRef<never> | null = null;

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {}
    public ngOnInit(): void {}

    public setSize(size: string | number | undefined): void {
        this.paneSize = size == null ? size : typeof size === "string" ? size : `${size}px`;
        this.sizeChange.emit(this.paneSize);
    }
}
