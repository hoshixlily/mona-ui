import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    HostBinding,
    Input,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    WritableSignal
} from "@angular/core";
import { faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ScrollViewListItem } from "../../models/ScrollViewListItem";

@Component({
    selector: "mona-scroll-view",
    templateUrl: "./scroll-view.component.html",
    styleUrls: ["./scroll-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollViewComponent implements OnInit {
    #data: WritableSignal<Array<ScrollViewListItem>> = signal([]);
    #height: WritableSignal<string> = signal("100%");
    #width: WritableSignal<string> = signal("100%");
    public readonly leftArrow: IconDefinition = faChevronLeft;
    public readonly rightArrow: IconDefinition = faChevronRight;
    public activeIndex: WritableSignal<number> = signal(0);

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

    @Input({ required: true })
    @HostBinding("style.width")
    public set width(value: string | number) {
        this.#width.set(typeof value === "number" ? `${value}px` : value);
    }

    public get width(): string {
        return this.#width();
    }

    public constructor() {}

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
