import { NgTemplateOutlet } from "@angular/common";
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    contentChildren,
    input,
    InputSignal,
    Signal
} from "@angular/core";
import { from, zip } from "@mirei/ts-collections";
import { Orientation } from "../../../../models/Orientation";
import { NeoSplitterPaneComponent } from "../neo-splitter-pane/neo-splitter-pane.component";
import { NeoSplitterResizerComponent } from "../neo-splitter-resizer/neo-splitter-resizer.component";

@Component({
    selector: "mona-neo-splitter",
    standalone: true,
    imports: [NeoSplitterResizerComponent, NgTemplateOutlet],
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
        if (panes.length === 0) {
            return [];
        }
        const resizerCount = from(panes).count() - 1;
        const array = new Array(resizerCount).fill({ size: "4px" });
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

    public orientation: InputSignal<Orientation> = input<Orientation>("horizontal");
    public paneList = contentChildren(NeoSplitterPaneComponent);

    private getPaneSizeStyles(): string {
        const paneList = this.paneList();
        const resizerList = this.resizerList();
        return zip(paneList, resizerList)
            .select(([pane, resizer]) => {
                const size = pane.size() || "1fr";
                const sizeString = typeof size === "number" ? `${size}px` : size;
                return `${sizeString} ${resizer.size}`;
            })
            .aggregate((acc, size) => `${acc} ${size}`, "")
            .trim();
    }
}
