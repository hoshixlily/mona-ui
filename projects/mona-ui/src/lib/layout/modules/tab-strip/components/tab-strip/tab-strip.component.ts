import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild
} from "@angular/core";
import { TabComponent } from "../tab/tab.component";
import { interval, Subject, takeUntil, timer } from "rxjs";
import { ScrollDirection } from "../../data/ScrollDirection";
import { faChevronLeft, faChevronRight, faXmark, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TabCloseEvent } from "../../data/TabCloseEvent";

@Component({
    selector: "mona-tab-strip",
    templateUrl: "./tab-strip.component.html",
    styleUrls: ["./tab-strip.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabStripComponent implements OnInit, AfterContentInit, OnDestroy, AfterViewInit {
    readonly #destroy$: Subject<void> = new Subject<void>();
    #resizeObserver: ResizeObserver | null = null;
    private scroll$: Subject<void> = new Subject<void>();
    public readonly scrollLeftIcon: IconDefinition = faChevronLeft;
    public readonly scrollRightIcon: IconDefinition = faChevronRight;
    public readonly tabCloseIcon: IconDefinition = faXmark;
    public scrollsVisible: boolean = false;

    @Input()
    public closable: boolean = false;

    @Input()
    public keepTabContent: boolean = false;

    @Output()
    public tabClose: EventEmitter<TabCloseEvent> = new EventEmitter<TabCloseEvent>();

    @ContentChildren(TabComponent)
    public tabComponents: QueryList<TabComponent> = new QueryList<TabComponent>();

    @ViewChild("tabListElement")
    public tabListElement!: ElementRef<HTMLUListElement>;

    public constructor(private readonly cdr: ChangeDetectorRef) {}

    public ngAfterContentInit(): void {
        this.tabComponents.forEach((t, tx) => (t.index = tx));
        this.tabComponents.changes.pipe(takeUntil(this.#destroy$)).subscribe((tabs: QueryList<TabComponent>) => {
            tabs.forEach((t, tx) => (t.index = tx));
            this.updateScrollVisibility();
        });
    }

    public ngAfterViewInit(): void {
        this.#resizeObserver = new ResizeObserver(entries => {
            window.requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) {
                    return;
                }
                this.updateScrollVisibility();
            });
        });
        this.#resizeObserver.observe(this.tabListElement.nativeElement);
    }

    public ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
        this.#resizeObserver?.disconnect();
    }

    public ngOnInit(): void {}

    public onTabClick(tab: TabComponent, tabListElement: HTMLUListElement): void {
        this.tabComponents.forEach(t => (t.selected = false));
        tab.selected = true;
        window.setTimeout(() => {
            const listElement = tabListElement.querySelector("li.mona-tab-active");
            if (listElement) {
                listElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }

    public onTabClose(tab: TabComponent, event: MouseEvent): void {
        event.stopPropagation();
        const tabCloseEvent = new TabCloseEvent(tab.index, tab);
        this.cdr.detectChanges();
        this.tabClose.emit(tabCloseEvent);
    }

    public startScrolling(element: HTMLElement, direction: ScrollDirection, type: "single" | "continuous"): void {
        const timeFunction = type === "single" ? timer : interval;
        timeFunction(60)
            .pipe(takeUntil(this.scroll$))
            .subscribe(() => {
                let left: number = 0;
                switch (direction) {
                    case "left":
                        left = Math.max(element.scrollLeft - 100, 0);
                        element.scrollTo({ left, behavior: "smooth" });
                        break;
                    case "right":
                        left = Math.min(element.scrollLeft + 100, element.scrollWidth);
                        element.scrollTo({ left, behavior: "smooth" });
                        break;
                }
            });
    }

    public stopScrolling(): void {
        this.scroll$.next();
        this.scroll$.complete();
        this.scroll$ = new Subject<void>();
    }

    private updateScrollVisibility(): void {
        this.scrollsVisible =
            this.tabListElement.nativeElement.scrollWidth > this.tabListElement.nativeElement.clientWidth;
        this.cdr.detectChanges();
    }
}
