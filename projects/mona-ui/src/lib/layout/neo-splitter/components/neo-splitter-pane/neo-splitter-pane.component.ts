import { Component, model, ModelSignal, Signal, TemplateRef, viewChild } from "@angular/core";
import { v4 } from "uuid";

@Component({
    selector: "mona-neo-splitter-pane",
    standalone: true,
    imports: [],
    template: `
        <ng-template>
            <ng-content></ng-content>
        </ng-template>
    `,
    styles: ""
})
export class NeoSplitterPaneComponent {
    public readonly template: Signal<TemplateRef<any>> = viewChild.required(TemplateRef);
    public readonly uid: string = v4();
    public size: ModelSignal<string | number> = model<string | number>("1fr");
}
