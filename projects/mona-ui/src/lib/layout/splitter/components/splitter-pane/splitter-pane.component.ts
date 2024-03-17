import { Component, input, InputSignal, model, ModelSignal, Signal, TemplateRef, viewChild } from "@angular/core";
import { v4 } from "uuid";

@Component({
    selector: "mona-splitter-pane",
    standalone: true,
    imports: [],
    template: `
        <ng-template>
            <ng-content></ng-content>
        </ng-template>
    `,
    styles: ""
})
export class SplitterPaneComponent {
    public readonly template: Signal<TemplateRef<any>> = viewChild.required(TemplateRef);
    public readonly uid: string = v4();
    public resizable: InputSignal<boolean> = input<boolean>(true);
    public size: ModelSignal<string | number> = model<string | number>("");
}
