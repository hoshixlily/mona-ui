import { animate, style, transition, trigger } from "@angular/animations";
import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChild,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
    OnDestroy,
    Signal,
    signal,
    TemplateRef,
    viewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { asyncScheduler, filter, fromEvent, interval, Subject, takeUntil, timer } from "rxjs";
import { ScrollDirection } from "../../../../models/ScrollDirection";
import { PagerOverlay } from "../../models/PagerOverlay";
import { ScrollViewListItem } from "../../models/ScrollViewListItem";

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
    ],
    standalone: true,
    imports: [NgTemplateOutlet, NgClass, FontAwesomeModule, NgStyle],
    host: {
        class: "mona-scroll-view",
        "[attr.tabindex]": "0",
        "[style.height]": "height()",
        "[style.width]": "width()"
    }
})
export class ScrollViewComponent implements OnDestroy, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    #resizeObserver: ResizeObserver | null = null;
    #scroll$: Subject<void> = new Subject<void>();

    protected readonly contentTemplate = contentChild(TemplateRef);
    protected readonly itemCount = computed(() => this.data().length);
    protected readonly leftArrow = faChevronLeft;
    protected readonly pagerArrowVisible = signal(false);
    protected readonly pagerListElementRef: Signal<ElementRef<HTMLUListElement> | undefined> =
        viewChild("pageListElement");
    protected readonly pagerPosition = signal("0");
    protected readonly rightArrow = faChevronRight;
    protected lastDirection: ScrollDirection | "none" = "none";

    public arrows = input(false);
    public data = input([], {
        transform: (value: Iterable<any>) => Array.from(value).map<ScrollViewListItem>((i, ix) => ({ data: i }))
    });
    public height = input.required({
        transform: (value: number | string) => (typeof value === "number" ? `${value}px` : value)
    });
    public index = model(0);
    public infinite = input(false);
    public pageable = input(false);
    public pagerBlur = input(3);
    public pagerOverlay = input<PagerOverlay>("dark");
    public width = input.required({
        transform: (value: number | string) => (typeof value === "number" ? `${value}px` : value)
    });

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

    public onArrowClick(direction: "left" | "right"): void {
        let index = this.index();
        this.lastDirection = direction;

        /**
         * Scheduled because when the direction changed from left to right or right to left,
         * the animation behaviour was erratic.
         * Same for {@link onPageClick} method.
         */
        asyncScheduler.schedule(() => {
            if (!this.infinite()) {
                if (direction === "left") {
                    index = Math.max(0, index - 1);
                    this.index.set(index);
                } else {
                    index = Math.min(this.data().length - 1, index + 1);
                    this.index.set(index);
                }
            } else if (direction === "left") {
                index = index - 1;
                if (index < 0) {
                    index = this.data().length - 1;
                }
                this.index.set(index);
            } else {
                index = index + 1;
                if (index >= this.data().length) {
                    index = 0;
                }
                this.index.set(index);
            }
            this.scrollActivePageIntoView();
        });
    }

    public onPageClick(index: number, element: HTMLLIElement): void {
        this.lastDirection = index < this.index() ? "left" : "right";
        asyncScheduler.schedule(() => {
            this.index.set(index);
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
            const element = this.#hostElementRef.nativeElement.querySelector("li.mona-scroll-view-active-page");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }
        });
    }

    private setPagerListResizeObserver(): void {
        asyncScheduler.schedule(() => {
            const pagerListElementRef = this.pagerListElementRef();
            if (pagerListElementRef) {
                const element = pagerListElementRef.nativeElement;
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
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
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
                    const element = this.#hostElementRef.nativeElement.querySelector(
                        "div.mona-scroll-view-arrow-left"
                    ) as HTMLDivElement;
                    if (element) {
                        element.click();
                    }
                } else {
                    const element = this.#hostElementRef.nativeElement.querySelector(
                        "div.mona-scroll-view-arrow-right"
                    ) as HTMLDivElement;
                    if (element) {
                        element.click();
                    }
                }
            });
    }
}
