import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    HostBinding,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ScrollViewListItem } from "../../models/ScrollViewListItem";
import { PagerOverlay } from "../../models/PagerOverlay";
import { asyncScheduler, filter, fromEvent, interval, Subject, takeUntil, timer } from "rxjs";
import { ScrollDirection } from "../../../../../models/ScrollDirection";
import { animate, style, transition, trigger } from "@angular/animations";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "mona-scroll-view",
    templateUrl: "./scroll-view.component.html",
    styleUrls: ["./scroll-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger("slideInOut", [
            transition(":enter", [
                style({ transform: "translateX({{start}}100%)" }),
                animate("0.3s ease-out", style({ transform: "translateX(0)" }))
            ]),
            transition(":leave", [
                style({ transform: "translateX(0)" }),
                animate("0.3s ease-out", style({ transform: "translateX({{end}}100%)" }))
            ])
        ])
    ]
})
export class ScrollViewComponent implements OnInit, OnDestroy, AfterViewInit {
    #destroyRef: DestroyRef = inject(DestroyRef);
    #height: WritableSignal<string> = signal("100%");
    #resizeObserver: ResizeObserver | null = null;
    #scroll$: Subject<void> = new Subject<void>();
    #width: WritableSignal<string> = signal("100%");
    public readonly leftArrow: IconDefinition = faChevronLeft;
    public readonly rightArrow: IconDefinition = faChevronRight;
    public activeIndex: WritableSignal<number> = signal(0);
    public allData: WritableSignal<Array<ScrollViewListItem>> = signal([]);
    public itemCount: Signal<number> = signal(0);
    public lastDirection: ScrollDirection | "none" = "none";
    public pagerArrowVisible: WritableSignal<boolean> = signal(false);
    public pagerPosition: WritableSignal<string> = signal("0");

    @ContentChild(TemplateRef)
    public contentTemplate: TemplateRef<any> | null = null;

    @Input()
    public arrows: boolean = false;

    @Input()
    public set data(data: Iterable<any>) {
        this.setData(data);
    }

    @Input({ required: true })
    @HostBinding("style.height")
    public set height(value: string | number) {
        this.#height.set(typeof value === "number" ? `${value}px` : value);
    }

    public get height(): string {
        return this.#height();
    }

    @Input()
    public set index(index: number) {
        this.activeIndex.set(index);
    }

    @Input()
    public infinite: boolean = false;

    @Input()
    public pageable: boolean = false;

    @Input()
    public pagerBlur: number = 3;

    @ViewChild("pagerListElement")
    public pagerListElementRef?: ElementRef<HTMLUListElement>;

    @Input()
    public pagerOverlay: PagerOverlay = "dark";

    @Input({ required: true })
    @HostBinding("style.width")
    public set width(value: string | number) {
        this.#width.set(typeof value === "number" ? `${value}px` : value);
    }

    public get width(): string {
        return this.#width();
    }

    public constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

    public ngAfterViewInit(): void {
        this.setPagerListResizeObserver();
        this.setSubscriptions();
        this.scrollActivePageIntoView();
    }

    public ngOnDestroy(): void {
        if (this.#resizeObserver) {
            this.#resizeObserver.disconnect();
        }
    }

    public ngOnInit(): void {
        this.itemCount = computed(() => this.allData().length);
    }

    public onArrowClick(direction: "left" | "right"): void {
        let index = this.activeIndex();
        this.lastDirection = direction;

        /**
         * Scheduled because when the direction changed from left to right or right to left,
         * the animation behaviour was erratic.
         * Same for {@link onPageClick} method.
         */
        asyncScheduler.schedule(() => {
            if (!this.infinite) {
                if (direction === "left") {
                    index = Math.max(0, index - 1);
                    this.activeIndex.set(index);
                } else {
                    index = Math.min(this.allData().length - 1, index + 1);
                    this.activeIndex.set(index);
                }
            } else {
                if (direction === "left") {
                    index = index - 1;
                    if (index < 0) {
                        index = this.allData().length - 1;
                    }
                    this.activeIndex.set(index);
                } else {
                    index = index + 1;
                    if (index >= this.allData().length) {
                        index = 0;
                    }
                    this.activeIndex.set(index);
                }
            }
            this.scrollActivePageIntoView();
        });
    }

    public onPageClick(index: number, element: HTMLLIElement): void {
        this.lastDirection = index < this.activeIndex() ? "left" : "right";
        asyncScheduler.schedule(() => {
            this.activeIndex.set(index);
            element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        });
    }

    public onPagerScroll(element: HTMLUListElement, direction: ScrollDirection, type: "single" | "continuous"): void {
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

    public onPagerScrollEnd(): void {
        this.#scroll$.next();
        this.#scroll$.complete();
        this.#scroll$ = new Subject<void>();
    }

    private scrollActivePageIntoView(): void {
        asyncScheduler.schedule(() => {
            const element = this.elementRef.nativeElement.querySelector("li.mona-scroll-view-active-page");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        });
    }

    private setData(data: Iterable<any>): void {
        this.allData.set(Array.from(data).map<ScrollViewListItem>((i, ix) => ({ data: i })));
    }

    private setPagerListResizeObserver(): void {
        asyncScheduler.schedule(() => {
            if (this.pagerListElementRef) {
                const element = this.pagerListElementRef.nativeElement;
                this.pagerArrowVisible.set(element.scrollWidth > element.clientWidth);
                this.#resizeObserver = new ResizeObserver(() => {
                    const scrollWidth = element.scrollWidth;
                    const clientWidth = element.clientWidth;
                    this.pagerArrowVisible.set(scrollWidth > clientWidth);
                });
            }
        });
    }

    private setSubscriptions(): void {
        fromEvent<KeyboardEvent>(this.elementRef.nativeElement, "keydown")
            .pipe(
                filter(event => event.key === "ArrowLeft" || event.key === "ArrowRight"),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe(event => {
                /**
                 * July 20, 2023 Thursday 3:54 AM
                 * This strange code is to fix a strange behaviour of the scroll view animation.
                 * When the user clicks on the arrow, the animation is smooth, but when the user
                 * presses the arrow key, the animation is not smooth. I don't know why.
                 * This only happens when the direction is changed from left to right or vice versa.
                 * Subsequent presses of the same arrow key are smooth.
                 * Instead of calling onArrowClick, I call the click event of the arrow element,
                 * which strangely fixes the animation.
                 * TODO: Investigate this issue and find a better solution.
                 */
                if (event.key === "ArrowLeft") {
                    const element = this.elementRef.nativeElement.querySelector(
                        "div.mona-scroll-view-arrow-left"
                    ) as HTMLDivElement;
                    if (element) {
                        element.click();
                    }
                } else {
                    const element = this.elementRef.nativeElement.querySelector(
                        "div.mona-scroll-view-arrow-right"
                    ) as HTMLDivElement;
                    if (element) {
                        element.click();
                    }
                }
            });
    }
}
