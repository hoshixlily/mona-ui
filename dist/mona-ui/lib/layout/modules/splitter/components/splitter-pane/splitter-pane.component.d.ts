import { ElementRef, EventEmitter, OnInit, TemplateRef } from "@angular/core";
import * as i0 from "@angular/core";
export declare class SplitterPaneComponent implements OnInit {
    readonly elementRef: ElementRef<HTMLElement>;
    readonly uid: string;
    paneSize?: string;
    isStatic: boolean;
    collapsed: boolean;
    collapsedChange: EventEmitter<boolean>;
    collapsible: boolean;
    element: HTMLDivElement;
    resizable: boolean;
    set size(size: string | number | undefined);
    sizeChange: EventEmitter<string | undefined>;
    templateRef: TemplateRef<never> | null;
    constructor(elementRef: ElementRef<HTMLElement>);
    ngOnInit(): void;
    setCollapsed(collapsed: boolean): void;
    setSize(size: string | number | undefined): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitterPaneComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SplitterPaneComponent, "mona-splitter-pane", never, { "collapsed": { "alias": "collapsed"; "required": false; }; "collapsible": { "alias": "collapsible"; "required": false; }; "element": { "alias": "element"; "required": false; }; "resizable": { "alias": "resizable"; "required": false; }; "size": { "alias": "size"; "required": false; }; }, { "collapsedChange": "collapsedChange"; "sizeChange": "sizeChange"; }, never, ["*"], false, never>;
}
