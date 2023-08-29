import { AfterViewInit, Component, ContentChild, Input, OnInit } from "@angular/core";
import { Action } from "../../../../utils/Action";
import { CircularProgressBarLabelTemplateDirective } from "../../directives/circular-progress-bar-label-template.directive";
import { NgStyle, NgClass, NgIf, NgTemplateOutlet } from "@angular/common";

@Component({
    selector: "mona-circular-progress-bar",
    templateUrl: "./circular-progress-bar.component.html",
    styleUrls: ["./circular-progress-bar.component.scss"],
    standalone: true,
    imports: [NgStyle, NgClass, NgIf, NgTemplateOutlet]
})
export class CircularProgressBarComponent implements OnInit, AfterViewInit {
    public circumference: number = 0;

    @Input()
    public color: string | Action<number, string> = "var(--mona-primary)";

    @Input()
    public disabled: boolean = false;

    @Input()
    public indeterminate: boolean = false;

    @ContentChild(CircularProgressBarLabelTemplateDirective)
    public labelTemplateDirective: CircularProgressBarLabelTemplateDirective | null = null;

    @Input()
    public max: number = 100;

    @Input()
    public min: number = 0;

    @Input()
    public progress: number = 0;

    @Input()
    public size: number = 100;

    @Input()
    public thickness: number = 5;

    @Input()
    public set value(value: number) {
        this.updateProgress(value);
    }

    public constructor() {}

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.updateProgress(this.progress);
        });
    }

    public ngOnInit(): void {
        this.circumference = 2 * Math.PI * (this.size / 2 - this.thickness);
    }

    private updateProgress(value: number): void {
        this.progress = ((value - this.min) / (this.max - this.min)) * 100;
    }

    public get sizePx(): string {
        return `${this.size}px`;
    }

    public get strokeColor(): string {
        return typeof this.color === "string" ? this.color : this.color(this.progress);
    }

    public get strokeDashOffset(): number {
        const dashOffset = this.circumference * (1 - this.progress / 100);
        return this.indeterminate ? this.circumference / 1.42 : dashOffset;
    }
}
