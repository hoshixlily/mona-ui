import { NgTemplateOutlet } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, TemplateRef } from "@angular/core";
import { AnimationOptions } from "../../../../animations/models/AnimationOptions";
import { AnimationService } from "../../../../animations/services/animation.service";

@Component({
    selector: "mona-popup2-container",
    standalone: true,
    imports: [NgTemplateOutlet],
    templateUrl: "./popup2-container.component.html",
    styleUrl: "./popup2-container.component.scss"
})
export class Popup2ContainerComponent implements AfterViewInit, OnDestroy {
    public animate: boolean | Omit<AnimationOptions, "element"> = false;
    public animationDuration: number = 200;
    public content: TemplateRef<any> | null = null;

    public constructor(
        private readonly animationService: AnimationService,
        private readonly elementRef: ElementRef<HTMLElement>
    ) {}

    public ngAfterViewInit(): void {
        if (this.animate === true) {
            this.animationService.slideDown(this.elementRef.nativeElement, this.animationDuration);
        } else if (this.animate) {
            this.animationService.animate({
                duration: this.animationDuration,
                ...this.animate,
                element: this.elementRef.nativeElement
            });
        }
    }

    public ngOnDestroy(): void {
        if (this.animate === true) {
            this.animationService.slideUp(this.elementRef.nativeElement, this.animationDuration);
        } else if (this.animate) {
            this.animationService.animate({
                duration: this.animationDuration,
                ...this.animate,
                element: this.elementRef.nativeElement
            });
        }
    }
}
