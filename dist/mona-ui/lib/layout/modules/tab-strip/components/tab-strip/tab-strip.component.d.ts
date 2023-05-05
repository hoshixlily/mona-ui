import { AfterContentInit, AfterViewInit, ChangeDetectorRef, EventEmitter, OnDestroy, OnInit, QueryList } from "@angular/core";
import { TabComponent } from "../tab/tab.component";
import { ScrollDirection } from "../../data/ScrollDirection";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TabCloseEvent } from "../../data/TabCloseEvent";
import * as i0 from "@angular/core";
export declare class TabStripComponent implements OnInit, AfterContentInit, OnDestroy, AfterViewInit {
    private readonly cdr;
    private readonly componentDestroy$;
    private scroll$;
    readonly scrollLeftIcon: IconDefinition;
    readonly scrollRightIcon: IconDefinition;
    readonly tabCloseIcon: IconDefinition;
    closable: boolean;
    keepTabContent: boolean;
    tabClose: EventEmitter<TabCloseEvent>;
    tabComponents: QueryList<TabComponent>;
    constructor(cdr: ChangeDetectorRef);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    onTabClick(tab: TabComponent, tabListElement: HTMLUListElement): void;
    onTabClose(tab: TabComponent, event: MouseEvent): void;
    startScrolling(element: HTMLElement, direction: ScrollDirection, type: "single" | "continuous"): void;
    stopScrolling(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TabStripComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TabStripComponent, "mona-tab-strip", never, { "closable": { "alias": "closable"; "required": false; }; "keepTabContent": { "alias": "keepTabContent"; "required": false; }; }, { "tabClose": "tabClose"; }, ["tabComponents"], never, false, never>;
}
