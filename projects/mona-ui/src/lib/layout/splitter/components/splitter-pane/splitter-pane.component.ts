import { Component, input, model, TemplateRef, viewChild } from "@angular/core";
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
    public readonly template = viewChild.required(TemplateRef);
    public readonly uid: string = v4();
    public resizable = input(true);
    public size = model<string | number>("");
}
