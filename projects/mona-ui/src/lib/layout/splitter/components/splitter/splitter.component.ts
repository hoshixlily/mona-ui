import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, contentChildren, input, Signal } from "@angular/core";
import { from, zip } from "@mirei/ts-collections";
import { Orientation } from "../../../../models/Orientation";
import { SplitterPaneComponent } from "../splitter-pane/splitter-pane.component";
import { SplitterResizerComponent } from "../splitter-resizer/splitter-resizer.component";

@Component({
    selector: "mona-splitter",
    standalone: true,
    imports: [SplitterResizerComponent, NgTemplateOutlet],
    templateUrl: "./splitter.component.html",
    styleUrl: "./splitter.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-splitter",
        "[style.grid-template-columns]": "templateColumnStyles()",
        "[style.grid-template-rows]": "templateRowStyles()"
    }
})
export class SplitterComponent {
    protected readonly autoSizedPane: Signal<SplitterPaneComponent | null> = computed(() => {
        const panes = from(this.paneList());
        if (!panes.any()) {
            return null;
        }
        return panes.firstOrDefault(pane => pane.size() === "") ?? panes.last();
    });
    protected readonly resizerList: Signal<Iterable<{ size: string }>> = computed(() => {
        const panes = this.paneList();
        if (panes.length === 0) {
            return [];
        }
        const resizerCount = from(panes).count() - 1;
        const array = new Array(resizerCount).fill({ size: "4px" });
        return [...array, { size: "" }];
    });
    protected readonly templateColumnStyles = computed(() => {
        const orientation = this.orientation();
        if (orientation === "vertical") {
            return undefined;
        }
        return this.getPaneSizeStyles();
    });
    protected readonly templateRowStyles = computed(() => {
        const orientation = this.orientation();
        if (orientation === "horizontal") {
            return undefined;
        }
        return this.getPaneSizeStyles();
    });

    public orientation = input<Orientation>("horizontal");
    public paneList = contentChildren(SplitterPaneComponent);

    private getPaneSizeStyles(): string {
        const paneList = this.paneList();
        const resizerList = this.resizerList();
        return zip(paneList, resizerList)
            .select(([pane, resizer]) => {
                const size = pane.uid === this.autoSizedPane()?.uid ? "1fr" : pane.size() || "1fr";
                const sizeString = typeof size === "number" ? `${size}px` : size;
                return `${sizeString} ${resizer.size}`;
            })
            .aggregate((acc, size) => `${acc} ${size}`, "")
            .trim();
    }
}
