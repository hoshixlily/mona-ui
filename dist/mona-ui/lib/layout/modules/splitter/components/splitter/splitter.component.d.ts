import { AfterContentInit, AfterViewInit, ChangeDetectorRef, OnInit, QueryList } from "@angular/core";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { Orientation } from "../../data/Orientation";
import { SplitterResizerComponent } from "../splitter-resizer/splitter-resizer.component";
import { IndexableList } from "@mirei/ts-collections";
import * as i0 from "@angular/core";
export declare class SplitterComponent implements OnInit, AfterViewInit, AfterContentInit {
    private readonly cdr;
    resizers: IndexableList<SplitterResizerComponent>;
    orientation: Orientation;
    paneList: QueryList<SplitterPaneComponent>;
    resizerList: QueryList<SplitterResizerComponent>;
    constructor(cdr: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SplitterComponent, "mona-splitter", never, { "orientation": { "alias": "orientation"; "required": false; }; }, {}, ["paneList"], never, false, never>;
}
