import { AfterViewInit, Component, ContentChildren, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { Orientation } from "../../data/Orientation";
import { SplitterResizerComponent } from "../splitter-resizer/splitter-resizer.component";
import { IndexableList } from "@mirei/ts-collections";

@Component({
    selector: "mona-splitter",
    templateUrl: "./splitter.component.html",
    styleUrls: ["./splitter.component.scss"]
})
export class SplitterComponent implements OnInit, AfterViewInit {
    public resizers: IndexableList<SplitterResizerComponent> = new IndexableList<SplitterResizerComponent>();

    @Input()
    public orientation: Orientation = "horizontal";

    @ContentChildren(SplitterPaneComponent)
    public paneList: QueryList<SplitterPaneComponent> = new QueryList<SplitterPaneComponent>();

    @ViewChildren(SplitterResizerComponent)
    public resizerList: QueryList<SplitterResizerComponent> = new QueryList<SplitterResizerComponent>();

    public constructor() {}

    public ngAfterViewInit(): void {
        this.resizers = new IndexableList<SplitterResizerComponent>(this.resizerList);
        this.resizerList.changes.subscribe(() => {
            this.resizers = new IndexableList<SplitterResizerComponent>(this.resizerList);
        });
    }

    public ngOnInit(): void {}
}
