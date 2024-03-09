import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from "@angular/core";
import { from, zip } from "@mirei/ts-collections";
import { v4 } from "uuid";
import { Orientation } from "../../../../models/Orientation";
import { SplitterPane } from "../../models/SplitterPane";
import { NeoSplitterResizerComponent } from "../neo-splitter-resizer/neo-splitter-resizer.component";

@Component({
    selector: "mona-neo-splitter",
    standalone: true,
    imports: [NeoSplitterResizerComponent],
    templateUrl: "./neo-splitter.component.html",
    styleUrl: "./neo-splitter.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-neo-splitter",
        "[style.grid-template-columns]": "templateColumnStyles()",
        "[style.grid-template-rows]": "templateRowStyles()"
    }
})
export class NeoSplitterComponent {
    protected readonly resizerList: Signal<Iterable<{ size: string }>> = computed(() => {
        const panes = this.paneList();
        const resizerCount = from(panes).count() - 1;
        const array = new Array(resizerCount).fill({ size: "8px" });
        return [...array, { size: "" }];
    });
    protected readonly templateColumnStyles: Signal<string | undefined> = computed(() => {
        const orientation = this.orientation();
        if (orientation === "vertical") {
            return undefined;
        }
        return this.getPaneSizeStyles();
    });
    protected readonly templateRowStyles: Signal<string | undefined> = computed(() => {
        const orientation = this.orientation();
        if (orientation === "horizontal") {
            return undefined;
        }
        return this.getPaneSizeStyles();
    });

    public orientation: WritableSignal<Orientation> = signal<Orientation>("horizontal");
    public paneList: WritableSignal<SplitterPane[]> = signal([
        {
            panelUid: v4(),
            size: signal("200px")
        },
        {
            panelUid: v4(),
            size: signal("350px")
        },
        {
            panelUid: v4(),
            size: signal("auto")
        }
    ]);

    private getPaneSizeStyles(): string {
        const paneList = this.paneList();
        const resizerList = this.resizerList();
        return zip(paneList, resizerList)
            .select(([pane, resizer]) => {
                const size = pane.size();
                return `${size} ${resizer.size}`;
            })
            .aggregate((acc, size) => `${acc} ${size}`, "")
            .trim();
    }
}
