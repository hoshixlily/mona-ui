import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    EventEmitter,
    input,
    InputSignal,
    model,
    ModelSignal,
    Output,
    signal,
    TemplateRef,
    viewChild,
    WritableSignal
} from "@angular/core";
import { v4 } from "uuid";

@Component({
    selector: "mona-splitter-pane",
    templateUrl: "./splitter-pane.component.html",
    styleUrls: ["./splitter-pane.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SplitterPaneComponent {
    public readonly paneSize: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
    public readonly templateRef = viewChild.required(TemplateRef);
    public readonly uid: string = v4();
    public isStatic: WritableSignal<boolean> = signal(false);

    public collapsed: ModelSignal<boolean> = model(false);
    public collapsible: InputSignal<boolean> = input(false);
    public resizable: InputSignal<boolean> = input(true);
    public size: InputSignal<string | number | undefined> = input<string | number | undefined>(undefined);

    @Output()
    public sizeChange: EventEmitter<string | undefined> = new EventEmitter<string | undefined>();

    public constructor(public readonly elementRef: ElementRef<HTMLElement>) {
        effect(
            () => {
                const size = this.size();
                if (size == null) {
                    this.paneSize.set(undefined);
                } else {
                    this.paneSize.set(typeof size === "string" ? size : `${size}px`);
                    this.isStatic.set(true);
                }
            },
            { allowSignalWrites: true }
        );
    }

    public setCollapsed(collapsed: boolean): void {
        this.collapsed.set(collapsed);
    }

    public setSize(size: string | number | undefined): void {
        this.paneSize.set(size == null ? size : typeof size === "string" ? size : `${size}px`);
        this.sizeChange.emit(this.paneSize());
    }
}
