import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    Input,
    OnInit,
    QueryList,
    ViewChildren
} from "@angular/core";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { Orientation } from "../../data/Orientation";
import { SplitterResizerComponent } from "../splitter-resizer/splitter-resizer.component";
import { IndexableList } from "@mirei/ts-collections";
import { NgClass, NgFor, NgStyle, NgIf, NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "mona-splitter",
    templateUrl: "./splitter.component.html",
    styleUrls: ["./splitter.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgFor, NgStyle, NgIf, NgTemplateOutlet, SplitterResizerComponent]
})
export class SplitterComponent implements OnInit, AfterViewInit, AfterContentInit {
    public resizers: IndexableList<SplitterResizerComponent> = new IndexableList<SplitterResizerComponent>();

    @Input()
    public orientation: Orientation = "horizontal";

    @ContentChildren(SplitterPaneComponent)
    public paneList: QueryList<SplitterPaneComponent> = new QueryList<SplitterPaneComponent>();

    @ViewChildren(SplitterResizerComponent)
    public resizerList: QueryList<SplitterResizerComponent> = new QueryList<SplitterResizerComponent>();

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterContentInit(): void {
        const staticPanes = this.paneList.filter(p => p.isStatic);
        if (staticPanes.length === 0) {
            const percentage = 100 / this.paneList.length;
            this.paneList.forEach(p => {
                p.setSize(`${percentage}%`);
            });
            return;
        }
        if (staticPanes.length === this.paneList.length) {
            this.paneList.last.setSize(undefined);
            this.paneList.last.isStatic = false;
        }
        this.cdr.detectChanges();
    }

    public ngAfterViewInit(): void {
        this.resizers = new IndexableList<SplitterResizerComponent>(this.resizerList);
        this.resizerList.changes.subscribe(() => {
            this.resizers = new IndexableList<SplitterResizerComponent>(this.resizerList);
        });
        this.cdr.detectChanges();
    }

    public ngOnInit(): void {}
}
