import { NgClass, NgTemplateOutlet } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    input,
    InputSignal,
    OnDestroy,
    Output,
    QueryList,
    signal,
    ViewChild,
    ViewContainerRef,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight, faXmark, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { asapScheduler, interval, Subject, takeUntil, timer } from "rxjs";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { ScrollDirection } from "../../../../models/ScrollDirection";
import { TabCloseEvent } from "../../models/TabCloseEvent";
import { TabComponent } from "../tab/tab.component";

@Component({
    selector: "mona-tab-strip",
    templateUrl: "./tab-strip.component.html",
    styleUrls: ["./tab-strip.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ButtonDirective, FontAwesomeModule, NgClass, NgTemplateOutlet],
    host: {
        class: "mona-tab-strip"
    }
})
export class TabStripComponent implements AfterContentInit, OnDestroy, AfterViewInit {
    readonly #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #resizeObserver: ResizeObserver | null = null;
    #scroll$: Subject<void> = new Subject<void>();
    protected readonly scrollLeftIcon: IconDefinition = faChevronLeft;
    protected readonly scrollRightIcon: IconDefinition = faChevronRight;
    protected readonly tabCloseIcon: IconDefinition = faXmark;
    protected readonly scrollsVisible: WritableSignal<boolean> = signal(false);

    public closable: InputSignal<boolean> = input(false);
    public keepTabContent: InputSignal<boolean> = input(false);

    @ViewChild("initialLoadAnchor", { read: ViewContainerRef })
    private initialLoadAnchor!: ViewContainerRef;

    @ViewChild("initialLoadContainer")
    private initialLoadContainer!: ElementRef<HTMLDivElement>;

    @Output()
    public tabClose: EventEmitter<TabCloseEvent> = new EventEmitter<TabCloseEvent>();

    @ContentChildren(TabComponent)
    public tabComponents: QueryList<TabComponent> = new QueryList<TabComponent>();

    @ViewChild("tabContentContainer", { read: ViewContainerRef })
    public tabContentVcr!: ViewContainerRef;

    @ViewChild("tabListElement")
    public tabListElement!: ElementRef<HTMLUListElement>;

    public ngAfterContentInit(): void {
        this.tabComponents.forEach((t, tx) => (t.index = tx));
        this.tabComponents.changes
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((tabs: QueryList<TabComponent>) => {
                tabs.forEach((t, tx) => (t.index = tx));
                this.updateScrollVisibility();
                this.#cdr.detectChanges();
            });
    }

    public ngAfterViewInit(): void {
        this.initializeTabContents();
        this.#resizeObserver = new ResizeObserver(entries => {
            window.requestAnimationFrame(() => {
                if (!Array.isArray(entries) || !entries.length) {
                    return;
                }
                this.updateScrollVisibility();
                this.#cdr.detectChanges();
            });
        });
        this.#resizeObserver.observe(this.tabListElement.nativeElement);

        const selectedTab = this.tabComponents.find(t => t.selected());
        if (selectedTab) {
            this.loadTabContent(selectedTab);
        }
        this.#cdr.detectChanges();
    }

    public ngOnDestroy(): void {
        this.#resizeObserver?.disconnect();
    }

    public onTabClick(tab: TabComponent, tabListElement: HTMLUListElement): void {
        if (tab.selected()) {
            return;
        }
        this.tabComponents.forEach(t => t.selected.set(false));
        tab.selected.set(true);
        window.setTimeout(() => {
            const listElement = tabListElement.querySelector("li.mona-tab-active");
            if (listElement) {
                listElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
        this.loadTabContent(tab);
    }

    public onTabClose(tab: TabComponent, event: MouseEvent): void {
        event.stopPropagation();
        const tabCloseEvent = new TabCloseEvent(tab.index, tab);
        this.tabClose.emit(tabCloseEvent);
    }

    public startScrolling(element: HTMLElement, direction: ScrollDirection, type: "single" | "continuous"): void {
        const timeFunction = type === "single" ? timer : interval;
        timeFunction(60)
            .pipe(takeUntil(this.#scroll$))
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
        this.#scroll$.next();
        this.#scroll$.complete();
        this.#scroll$ = new Subject<void>();
    }

    private initializeTabContents(): void {
        this.tabComponents.forEach(t => {
            if (this.initialLoadAnchor.length > 0) {
                this.initialLoadAnchor.detach(0);
            }
            if (t.viewRef) {
                this.initialLoadAnchor.insert(t.viewRef);
            }
        });
        if (this.initialLoadAnchor.length > 0) {
            this.initialLoadAnchor.detach(0);
        }
        if (this.initialLoadContainer) {
            this.initialLoadContainer.nativeElement.remove();
        }
    }

    private loadTabContent(tab: TabComponent): void {
        if (this.tabContentVcr.length > 0) {
            if (this.keepTabContent()) {
                this.tabContentVcr.detach(0);
            } else {
                this.tabContentVcr.clear();
            }
        }
        if (tab.viewRef) {
            if (this.keepTabContent()) {
                this.tabContentVcr.insert(tab.viewRef);
            } else {
                tab.createView();
                this.tabContentVcr.insert(tab.viewRef);
            }
        }
    }

    private updateScrollVisibility(): void {
        asapScheduler.schedule(() => {
            this.scrollsVisible.set(
                this.tabListElement.nativeElement.scrollWidth > this.tabListElement.nativeElement.clientWidth
            );
        });
    }
}
