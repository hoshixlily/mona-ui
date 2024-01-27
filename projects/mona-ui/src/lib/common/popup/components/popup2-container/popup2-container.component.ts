import { NgTemplateOutlet } from "@angular/common";
import { Component, TemplateRef } from "@angular/core";

@Component({
    selector: "mona-popup2-container",
    standalone: true,
    imports: [NgTemplateOutlet],
    templateUrl: "./popup2-container.component.html",
    styleUrl: "./popup2-container.component.scss"
})
export class Popup2ContainerComponent {
    public content: TemplateRef<any> | null = null;
    public constructor() {}
}
