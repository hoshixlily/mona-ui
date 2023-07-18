import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    ElementRef,
    HostBinding,
    Input,
    OnInit,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
import { faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ScrollViewListItem } from "../../models/ScrollViewListItem";
import { PagerOverlay } from "../../models/PagerOverlay";
import { interval, Subject, takeUntil, timer } from "rxjs";
import { ScrollDirection } from "../../../../../models/ScrollDirection";

@Component({
    selector: "mona-scroll-view",
    templateUrl: "./scroll-view.component.html",
    styleUrls: ["./scroll-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollViewComponent implements OnInit {
    #data: WritableSignal<Array<ScrollViewListItem>> = signal([]);
    #height: WritableSignal<string> = signal("100%");
    #scroll$: Subject<void> = new Subject<void>();
    #width: WritableSignal<string> = signal("100%");
    public readonly leftArrow: IconDefinition = faChevronLeft;
    public readonly rightArrow: IconDefinition = faChevronRight;
    public activeIndex: WritableSignal<number> = signal(0);
    public pagerPosition: WritableSignal<string> = signal("0");

    @ContentChild(TemplateRef)
    public contentTemplate: TemplateRef<any> | null = null;

    @Input()
    public set data(data: Iterable<any>) {
        this.setData(data);
    }

    public get data(): Iterable<ScrollViewListItem> {
        return this.#data();
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
    public pagerBlur: number = 3;

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

    public ngOnInit(): void {}

    public onArrowClick(direction: "left" | "right"): void {
        let index = this.activeIndex();
        if (direction === "left") {
            index = Math.max(0, index - 1);
            this.activeIndex.set(index);
        } else {
            index = Math.min(this.#data().length - 1, index + 1);
            this.activeIndex.set(index);
        }
        const element = this.elementRef.nativeElement.querySelector("li.mona-scroll-view-active-page");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }

    public onPageClick(index: number, element: HTMLLIElement): void {
        this.activeIndex.set(index);
        element.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
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

    private setData(data: Iterable<any>): void {
        this.#data.set(
            Array.from(data).map((i, ix) => {
                return {
                    data: i,
                    position: computed(() => `${(ix - this.activeIndex()) * 100}%`)
                };
            })
        );
    }
}
