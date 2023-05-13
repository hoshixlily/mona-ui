import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { v4 } from "uuid";

@Component({
    selector: "mona-splitter-pane",
    templateUrl: "./splitter-pane.component.html",
    styleUrls: ["./splitter-pane.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplitterPaneComponent implements OnInit {
    public readonly uid: string = v4();
    public paneSize: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
    public isStatic = false;

    @Input()
    public collapsed: boolean = false;

    @Output()
    public collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    public collapsible: boolean = false;

    @Input()
    public element!: HTMLDivElement;

    @Input()
    public resizable: boolean = true;

    @Input()
    public set size(size: string | number | undefined) {
        this.paneSize.set(size == null ? undefined : typeof size === "string" ? size : `${size}px`);
        this.isStatic = true;
    }

    @Output()
    public sizeChange: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

    @ViewChild(TemplateRef)
    public templateRef: TemplateRef<never> | null = null;

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {}

    public ngOnInit(): void {}

    public setCollapsed(collapsed: boolean): void {
        this.collapsed = collapsed;
        this.collapsedChange.emit(collapsed);
    }

    public setSize(size: string | number | undefined): void {
        this.paneSize.set(size == null ? size : typeof size === "string" ? size : `${size}px`);
        this.sizeChange.emit(this.paneSize());
    }
}
