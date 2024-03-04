import { NgClass, NgStyle, NgTemplateOutlet } from "@angular/common";
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    computed,
    ContentChildren,
    inject,
    input,
    InputSignal,
    QueryList,
    signal,
    Signal,
    viewChildren,
    WritableSignal
} from "@angular/core";
import { Orientation } from "../../../../models/Orientation";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { SplitterResizerComponent } from "../splitter-resizer/splitter-resizer.component";

@Component({
    selector: "mona-splitter",
    templateUrl: "./splitter.component.html",
    styleUrls: ["./splitter.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass, NgStyle, NgTemplateOutlet, SplitterResizerComponent],
    host: {
        class: "mona-splitter",
        "[class.mona-splitter-horizontal]": "orientation() === 'horizontal'",
        "[class.mona-splitter-vertical]": "orientation() === 'vertical'"
    }
})
export class SplitterComponent implements AfterContentInit {
    readonly #cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly paneList: WritableSignal<SplitterPaneComponent[]> = signal<SplitterPaneComponent[]>([]);
    protected readonly resizerCount: Signal<number> = computed(() => this.resizerList().length);
    protected readonly resizerList = viewChildren(SplitterResizerComponent);
    public orientation: InputSignal<Orientation> = input<Orientation>("horizontal");

    @ContentChildren(SplitterPaneComponent)
    public paneComponents: QueryList<SplitterPaneComponent> = new QueryList<SplitterPaneComponent>();

    public ngAfterContentInit(): void {
        this.paneList.set(this.paneComponents.toArray());
        this.paneComponents.changes.subscribe(() => {
            this.paneList.set(this.paneComponents.toArray());
        });

        const staticPanes = this.paneList().filter(p => p.isStatic());
        if (staticPanes.length === 0) {
            const percentage = 100 / this.paneList.length;
            this.paneList().forEach(p => {
                p.setSize(`${percentage}%`);
            });
            return;
        }
        if (staticPanes.length === this.paneList.length) {
            const lastPane = this.paneList()[this.paneList.length - 1];
            lastPane.setSize(undefined);
            lastPane.isStatic.set(false);
        }
        this.#cdr.detectChanges();
    }
}
