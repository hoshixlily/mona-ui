import { Component, ContentChild, ElementRef, Input, TemplateRef, ViewChild } from "@angular/core";
import { fromEvent, Subject, take, takeUntil, timer } from "rxjs";
import { SliderTickValueTemplateDirective } from "../../directives/slider-tick-value-template.directive";
import { CommonModule } from "@angular/common";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class AbstractSliderComponent {
    constructor(elementRef, renderer, cdr, zone) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.cdr = cdr;
        this.zone = zone;
        this.componentDestroy$ = new Subject();
        this.documentMouseMoveListener = null;
        this.previousUserSelect = "";
        this.activeHandlerType = null;
        this.dragging = false;
        this.handlerOnePosition = 0;
        this.handlerTwoPosition = 0;
        this.handlerValues = [0, 0];
        this.initialized = false;
        this.ticks = [];
        this.trackData = { position: 0, size: 0 };
        this.labelPosition = "after";
        this.labelStep = 1;
        this.max = 10;
        this.min = 0;
        this.orientation = "horizontal";
        this.showTicks = true;
        this.step = 1;
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.setSliderValue(this.handlerValues[0], "primary");
            if (this.ranged) {
                this.setSliderValue(this.handlerValues[1], "secondary");
            }
            this.calculateTrackData();
            this.cdr.detectChanges();
        });
        timer(1000)
            .pipe(take(1))
            .subscribe(() => (this.initialized = true));
    }
    ngOnChanges(changes) {
        const valueChange = changes["value"];
        if (valueChange && !valueChange?.isFirstChange()) {
            let value = this.ranged
                ? valueChange.currentValue
                : valueChange.currentValue;
            if (value != null) {
                if (this.ranged) {
                    value = value;
                    this.setSliderValue(value[0], "primary");
                    this.setSliderValue(value[1], "secondary");
                }
                else {
                    value = value;
                    this.setSliderValue(value, "primary");
                }
            }
        }
    }
    ngOnDestroy() {
        this.documentMouseMoveListener?.();
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.prepareTicks();
        if (this.value == null) {
            return;
        }
    }
    onHandlerKeyDown(event, handlerType) {
        const valueIndex = handlerType === "primary" ? 0 : 1;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            this.setSliderValue(Math.max(this.minValue, this.handlerValues[valueIndex] - this.step), handlerType);
            this.emitValues();
        }
        else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            this.setSliderValue(Math.min(this.maxValue, this.handlerValues[valueIndex] + this.step), handlerType);
            this.emitValues();
        }
        else if (event.key === "Home") {
            this.setSliderValue(this.minValue, handlerType);
            this.emitValues();
        }
        else if (event.key === "End") {
            this.setSliderValue(this.maxValue, handlerType);
            this.emitValues();
        }
    }
    onHandlerMouseDown(handlerType) {
        if (this.dragging) {
            return;
        }
        this.activeHandlerType = handlerType;
        this.dragging = true;
        this.previousUserSelect = document.documentElement.style.userSelect;
        document.documentElement.style.userSelect = "none";
        this.setEventListeners();
    }
    onTickClick(event, tickElement) {
        const handlerData = this.getClosestHandlerDataToMouse(event);
        const positionData = this.getHandlerPositionData(tickElement, handlerData.element);
        const value = this.ticks[positionData.tickIndex].value;
        this.setSliderValue(value, handlerData.type);
        this.cdr.detectChanges();
        this.emitValues();
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        if (obj != null) {
            this.ensureCorrectValueType(obj);
            if (typeof obj === "number") {
                this.handlerValues = [
                    Math.max(this.minValue, Math.min(this.maxValue, obj)),
                    Math.max(this.minValue, Math.min(this.maxValue, obj))
                ];
                this.setSliderValue(this.handlerValues[0], "primary");
            }
            else {
                this.handlerValues = [
                    Math.max(this.minValue, Math.min(this.maxValue, obj[0])),
                    Math.max(this.minValue, Math.min(this.maxValue, obj[1]))
                ];
                this.setSliderValue(this.handlerValues[0], "primary");
                this.setSliderValue(this.handlerValues[1], "secondary");
            }
        }
    }
    calculateTrackData() {
        if (this.orientation === "horizontal") {
            if (this.ranged) {
                const rectOne = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const rectTwo = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const width = (Math.abs(rectOne.left - rectTwo.left) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                const leftmostRect = rectOne.left < rectTwo.left ? rectOne : rectTwo;
                this.trackData = {
                    position: leftmostRect.left - this.sliderTrackElementRef.nativeElement.getBoundingClientRect().left,
                    size: width
                };
            }
            else {
                this.trackData = {
                    position: 0,
                    size: this.handlerOnePosition <= 0 ? 0 : this.handlerOnePosition
                };
            }
        }
        else {
            if (this.ranged) {
                const rectOne = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const rectTwo = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const height = (Math.abs(rectOne.bottom - rectTwo.bottom) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                const bottommostRect = rectOne.bottom > rectTwo.bottom ? rectOne : rectTwo;
                this.trackData = {
                    position: this.sliderTrackElementRef.nativeElement.getBoundingClientRect().bottom - bottommostRect.bottom,
                    size: height
                };
            }
            else {
                this.trackData = {
                    position: 0,
                    size: this.handlerOnePosition <= 0 ? 0 : this.handlerOnePosition
                };
            }
        }
    }
    ensureCorrectValueType(value) {
        if (value == null) {
            return;
        }
        if (this.ranged && typeof value === "number") {
            throw new Error("Ranged slider requires an array of values");
        }
        else if (!this.ranged && typeof value !== "number") {
            throw new Error("Non-ranged slider requires a single value");
        }
    }
    findClosestTickElement(event) {
        const elements = Array.from(this.elementRef.nativeElement.querySelectorAll(".mona-slider-tick > span"));
        let maxDistance = Number.MAX_VALUE;
        let index = 0;
        for (const [ex, element] of elements.entries()) {
            const rect = element.getBoundingClientRect();
            const distance = Math.sqrt(Math.pow(rect.left - event.clientX, 2) + Math.pow(rect.top - event.clientY, 2));
            if (distance < maxDistance) {
                maxDistance = distance;
                index = ex;
            }
        }
        return elements[index];
    }
    getClosestHandlerDataToMouse(event) {
        if (!this.ranged) {
            return {
                type: "primary",
                element: this.sliderPrimaryHandlerElementRef.nativeElement
            };
        }
        const primaryHandlerRect = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
        const secondaryHandlerRect = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
        const primaryDistance = Math.sqrt(Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2));
        const secondaryDistance = Math.sqrt(Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
            Math.pow(secondaryHandlerRect.top - event.clientY, 2));
        return primaryDistance < secondaryDistance
            ? {
                element: this.sliderPrimaryHandlerElementRef.nativeElement,
                type: "primary"
            }
            : {
                element: this.sliderSecondaryHandlerElementRef.nativeElement,
                type: "secondary"
            };
    }
    getHandlerPositionData(tickElement, sliderHandlerElement) {
        const rect = tickElement.getBoundingClientRect();
        const containerRect = this.sliderTrackElementRef.nativeElement.getBoundingClientRect();
        const handlerRect = sliderHandlerElement.getBoundingClientRect();
        const parentElement = tickElement.parentNode;
        const tickElements = this.orientation === "horizontal"
            ? Array.from(parentElement?.children ?? [])
            : Array.from(parentElement?.children ?? []).reverse();
        const tickElementIndex = tickElements.indexOf(tickElement);
        const tickIndex = Math.ceil(tickElementIndex / 2);
        let position;
        if (this.orientation === "horizontal") {
            if (tickElementIndex % 2 !== 0) {
                position = ((rect.right - containerRect.left - handlerRect.width / 2) * 100.0) / containerRect.width;
            }
            else {
                const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
                if (siblingRect) {
                    position =
                        ((siblingRect.right - containerRect.left - (2 * handlerRect.width) / 2) * 100.0) /
                            containerRect.width;
                }
                else {
                    position = (((-1 * handlerRect.width) / 2) * 100.0) / containerRect.width;
                }
            }
            return { position, tickIndex };
        }
        else {
            if (tickElementIndex % 2 !== 0) {
                position = ((rect.bottom - containerRect.top - handlerRect.height / 2) * 100.0) / containerRect.height;
            }
            else {
                const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
                if (siblingRect) {
                    position =
                        ((siblingRect.bottom - containerRect.top - (2 * handlerRect.height) / 2) * 100.0) /
                            containerRect.height;
                }
                else {
                    position = (((-1 * handlerRect.height) / 2) * 100.0) / containerRect.height;
                }
            }
            return { position, tickIndex };
        }
    }
    prepareTicks() {
        let index = 0;
        let value = this.min;
        while (value < this.max) {
            this.ticks.push({ index, value });
            value += this.step;
            index++;
        }
        this.ticks.push({ index, value: Math.min(value + this.step, this.max) });
    }
    setEventListeners() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(document, "mousemove", (event) => {
                if (!this.dragging) {
                    return;
                }
                const tickElement = this.findClosestTickElement(event);
                const positionData = this.getHandlerPositionData(tickElement.parentElement, this.activeHandlerType === "primary"
                    ? this.sliderPrimaryHandlerElementRef.nativeElement
                    : this.sliderSecondaryHandlerElementRef.nativeElement);
                if (this.activeHandlerType === "primary" && positionData.position !== this.handlerOnePosition) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        if (this.handlerValues[0] !== value) {
                            this.setSliderValue(value, "primary");
                            this.emitValues();
                        }
                    });
                }
                else if (this.activeHandlerType === "secondary" &&
                    positionData.position !== this.handlerTwoPosition) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        if (this.handlerValues[1] !== value) {
                            this.setSliderValue(value, "secondary");
                            this.emitValues();
                        }
                    });
                }
            });
            const sub = fromEvent(document, "mouseup")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe(() => {
                if (!this.dragging) {
                    return;
                }
                this.zone.run(() => {
                    this.dragging = false;
                    if (this.previousUserSelect) {
                        document.documentElement.style.userSelect = this.previousUserSelect;
                    }
                    else {
                        document.documentElement.style.removeProperty("user-select");
                    }
                    this.documentMouseMoveListener?.();
                    sub.unsubscribe();
                });
            });
        });
    }
    setSliderValue(value, handlerType = "primary") {
        const sliderValue = Math.max(this.minValue, Math.min(this.maxValue, value));
        if (this.orientation === "horizontal") {
            if (handlerType === "primary") {
                this.handlerOnePosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                this.handlerValues[0] = sliderValue;
            }
            else {
                this.handlerTwoPosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                this.handlerValues[1] = sliderValue;
            }
        }
        else {
            if (handlerType === "primary") {
                this.handlerOnePosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect().height / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                this.handlerValues[0] = sliderValue;
            }
            else {
                this.handlerTwoPosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect().height / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                this.handlerValues[1] = sliderValue;
            }
        }
        window.setTimeout(() => {
            this.calculateTrackData();
        });
    }
    get maxValue() {
        return this.ticks[this.ticks.length - 1].value;
    }
    get minValue() {
        return this.ticks[0].value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractSliderComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractSliderComponent, isStandalone: true, selector: "ng-component", inputs: { labelPosition: "labelPosition", labelStep: "labelStep", max: "max", min: "min", orientation: "orientation", showTicks: "showTicks", step: "step" }, queries: [{ propertyName: "tickValueTemplate", first: true, predicate: SliderTickValueTemplateDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "sliderPrimaryHandlerElementRef", first: true, predicate: ["sliderPrimaryHandlerElement"], descendants: true, read: ElementRef }, { propertyName: "sliderSecondaryHandlerElementRef", first: true, predicate: ["sliderSecondaryHandlerElement"], descendants: true, read: ElementRef }, { propertyName: "sliderTrackElementRef", first: true, predicate: ["sliderTrackElement"], descendants: true, read: ElementRef }, { propertyName: "tickListElementRef", first: true, predicate: ["tickListElement"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n", dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractSliderComponent, decorators: [{
            type: Component,
            args: [{ standalone: true, imports: [CommonModule], template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { labelPosition: [{
                type: Input
            }], labelStep: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], orientation: [{
                type: Input
            }], showTicks: [{
                type: Input
            }], sliderPrimaryHandlerElementRef: [{
                type: ViewChild,
                args: ["sliderPrimaryHandlerElement", { read: ElementRef }]
            }], sliderSecondaryHandlerElementRef: [{
                type: ViewChild,
                args: ["sliderSecondaryHandlerElement", { read: ElementRef }]
            }], sliderTrackElementRef: [{
                type: ViewChild,
                args: ["sliderTrackElement", { read: ElementRef }]
            }], step: [{
                type: Input
            }], tickListElementRef: [{
                type: ViewChild,
                args: ["tickListElement", { read: ElementRef }]
            }], tickValueTemplate: [{
                type: ContentChild,
                args: [SliderTickValueTemplateDirective, { read: TemplateRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3Qtc2xpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9pbnB1dHMvbW9kdWxlcy9zbGlkZXIvY29tcG9uZW50cy9hYnN0cmFjdC1zbGlkZXIvYWJzdHJhY3Qtc2xpZGVyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9pbnB1dHMvbW9kdWxlcy9zbGlkZXIvY29tcG9uZW50cy9hYnN0cmFjdC1zbGlkZXIvYWJzdHJhY3Qtc2xpZGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFHSCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFFVixLQUFLLEVBT0wsV0FBVyxFQUNYLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLE1BQU0sQ0FBQztBQVNsRSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSx1REFBdUQsQ0FBQztBQUN6RyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQVEvQyxNQUFNLE9BQWdCLHVCQUF1QjtJQXdEekMsWUFDdUIsVUFBbUMsRUFDbkMsUUFBbUIsRUFDbkIsR0FBc0IsRUFDdEIsSUFBWTtRQUhaLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ25DLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBUTtRQXpEbEIsc0JBQWlCLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDMUQsOEJBQXlCLEdBQWtCLElBQUksQ0FBQztRQUNoRCx1QkFBa0IsR0FBVyxF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NkJBQTZCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUl0RCxnQ0FBZ0M7c0JBRHZDLFNBQVM7dUJBQUMsK0JBQStCLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUl6RCxxQkFBcUI7c0JBRDNCLFNBQVM7dUJBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUk5QyxJQUFJO3NCQURWLEtBQUs7Z0JBSUUsa0JBQWtCO3NCQUR6QixTQUFTO3VCQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtnQkFJM0MsaUJBQWlCO3NCQUR2QixZQUFZO3VCQUFDLGdDQUFnQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIElucHV0LFxuICAgIE5nWm9uZSxcbiAgICBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBSZW5kZXJlcjIsXG4gICAgU2ltcGxlQ2hhbmdlcyxcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGRcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IGZyb21FdmVudCwgU3ViamVjdCwgdGFrZSwgdGFrZVVudGlsLCB0aW1lciB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBTbGlkZXJIYW5kbGVyVHlwZSB9IGZyb20gXCIuLi8uLi9tb2RlbHMvU2xpZGVySGFuZGxlclR5cGVcIjtcbmltcG9ydCB7IFNsaWRlckhhbmRsZXJEYXRhIH0gZnJvbSBcIi4uLy4uL21vZGVscy9TbGlkZXJIYW5kbGVyRGF0YVwiO1xuaW1wb3J0IHsgU2xpZGVySGFuZGxlclBvc2l0aW9uRGF0YSB9IGZyb20gXCIuLi8uLi9tb2RlbHMvU2xpZGVySGFuZGxlclBvc2l0aW9uRGF0YVwiO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL3V0aWxzL0FjdGlvblwiO1xuaW1wb3J0IHsgU2xpZGVyVGljayB9IGZyb20gXCIuLi8uLi9tb2RlbHMvU2xpZGVyVGlja1wiO1xuaW1wb3J0IHsgU2xpZGVyVHJhY2tEYXRhIH0gZnJvbSBcIi4uLy4uL21vZGVscy9TbGlkZXJUcmFja0RhdGFcIjtcbmltcG9ydCB7IFNsaWRlckxhYmVsUG9zaXRpb24gfSBmcm9tIFwiLi4vLi4vbW9kZWxzL1NsaWRlckxhYmVsUG9zaXRpb25cIjtcbmltcG9ydCB7IE9yaWVudGF0aW9uIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL21vZGVscy9PcmllbnRhdGlvblwiO1xuaW1wb3J0IHsgU2xpZGVyVGlja1ZhbHVlVGVtcGxhdGVEaXJlY3RpdmUgfSBmcm9tIFwiLi4vLi4vZGlyZWN0aXZlcy9zbGlkZXItdGljay12YWx1ZS10ZW1wbGF0ZS5kaXJlY3RpdmVcIjtcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yIH0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHRlbXBsYXRlVXJsOiBcIi4vYWJzdHJhY3Qtc2xpZGVyLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXVxufSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFNsaWRlckNvbXBvbmVudFxuICAgIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3JcbntcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudERlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcbiAgICBwcml2YXRlIGRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXI6IEFjdGlvbiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgcHJldmlvdXNVc2VyU2VsZWN0OiBzdHJpbmcgPSBcIlwiO1xuICAgIHB1YmxpYyBhY3RpdmVIYW5kbGVyVHlwZTogU2xpZGVySGFuZGxlclR5cGUgfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgZHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwdWJsaWMgaGFuZGxlck9uZVBvc2l0aW9uOiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBoYW5kbGVyVHdvUG9zaXRpb246IG51bWJlciA9IDA7XG4gICAgcHVibGljIGhhbmRsZXJWYWx1ZXM6IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF07XG4gICAgcHVibGljIGluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHVibGljIHRpY2tzOiBTbGlkZXJUaWNrW10gPSBbXTtcbiAgICBwdWJsaWMgdHJhY2tEYXRhOiBTbGlkZXJUcmFja0RhdGEgPSB7IHBvc2l0aW9uOiAwLCBzaXplOiAwIH07XG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHByb3BhZ2F0ZUNoYW5nZTogQWN0aW9uPGFueT4gfCBudWxsO1xuICAgIHB1YmxpYyBhYnN0cmFjdCByYW5nZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBsYWJlbFBvc2l0aW9uOiBTbGlkZXJMYWJlbFBvc2l0aW9uID0gXCJhZnRlclwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbGFiZWxTdGVwOiBudW1iZXIgPSAxO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWF4OiBudW1iZXIgPSAxMDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1pbjogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG9yaWVudGF0aW9uOiBPcmllbnRhdGlvbiA9IFwiaG9yaXpvbnRhbFwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgc2hvd1RpY2tzOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBWaWV3Q2hpbGQoXCJzbGlkZXJQcmltYXJ5SGFuZGxlckVsZW1lbnRcIiwgeyByZWFkOiBFbGVtZW50UmVmIH0pXG4gICAgcHJpdmF0ZSBzbGlkZXJQcmltYXJ5SGFuZGxlckVsZW1lbnRSZWYhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcblxuICAgIEBWaWV3Q2hpbGQoXCJzbGlkZXJTZWNvbmRhcnlIYW5kbGVyRWxlbWVudFwiLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcbiAgICBwcml2YXRlIHNsaWRlclNlY29uZGFyeUhhbmRsZXJFbGVtZW50UmVmITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgICBAVmlld0NoaWxkKFwic2xpZGVyVHJhY2tFbGVtZW50XCIsIHsgcmVhZDogRWxlbWVudFJlZiB9KVxuICAgIHB1YmxpYyBzbGlkZXJUcmFja0VsZW1lbnRSZWYhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHN0ZXA6IG51bWJlciA9IDE7XG5cbiAgICBAVmlld0NoaWxkKFwidGlja0xpc3RFbGVtZW50XCIsIHsgcmVhZDogRWxlbWVudFJlZiB9KVxuICAgIHByaXZhdGUgdGlja0xpc3RFbGVtZW50UmVmITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XG5cbiAgICBAQ29udGVudENoaWxkKFNsaWRlclRpY2tWYWx1ZVRlbXBsYXRlRGlyZWN0aXZlLCB7IHJlYWQ6IFRlbXBsYXRlUmVmIH0pXG4gICAgcHVibGljIHRpY2tWYWx1ZVRlbXBsYXRlPzogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHB1YmxpYyBhYnN0cmFjdCB2YWx1ZTogdW5rbm93biB8IG51bGw7XG4gICAgcHVibGljIGFic3RyYWN0IHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PjtcblxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSB6b25lOiBOZ1pvbmVcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFNsaWRlclZhbHVlKHRoaXMuaGFuZGxlclZhbHVlc1swXSwgXCJwcmltYXJ5XCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTbGlkZXJWYWx1ZSh0aGlzLmhhbmRsZXJWYWx1ZXNbMV0sIFwic2Vjb25kYXJ5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmFja0RhdGEoKTtcbiAgICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRpbWVyKDEwMDApXG4gICAgICAgICAgICAucGlwZSh0YWtlKDEpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiAodGhpcy5pbml0aWFsaXplZCA9IHRydWUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgICAgICBjb25zdCB2YWx1ZUNoYW5nZSA9IGNoYW5nZXNbXCJ2YWx1ZVwiXTtcbiAgICAgICAgaWYgKHZhbHVlQ2hhbmdlICYmICF2YWx1ZUNoYW5nZT8uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB0aGlzLnJhbmdlZFxuICAgICAgICAgICAgICAgID8gKHZhbHVlQ2hhbmdlLmN1cnJlbnRWYWx1ZSBhcyBbbnVtYmVyLCBudW1iZXJdKVxuICAgICAgICAgICAgICAgIDogKHZhbHVlQ2hhbmdlLmN1cnJlbnRWYWx1ZSBhcyBudW1iZXIpO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSBhcyBbbnVtYmVyLCBudW1iZXJdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNsaWRlclZhbHVlKHZhbHVlWzBdLCBcInByaW1hcnlcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U2xpZGVyVmFsdWUodmFsdWVbMV0sIFwic2Vjb25kYXJ5XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgYXMgbnVtYmVyO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNsaWRlclZhbHVlKHZhbHVlLCBcInByaW1hcnlcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXI/LigpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudERlc3Ryb3kkLm5leHQoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wcmVwYXJlVGlja3MoKTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uSGFuZGxlcktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGhhbmRsZXJUeXBlOiBTbGlkZXJIYW5kbGVyVHlwZSk6IHZvaWQge1xuICAgICAgICBjb25zdCB2YWx1ZUluZGV4ID0gaGFuZGxlclR5cGUgPT09IFwicHJpbWFyeVwiID8gMCA6IDE7XG4gICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dMZWZ0XCIgfHwgZXZlbnQua2V5ID09PSBcIkFycm93RG93blwiKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNsaWRlclZhbHVlKE1hdGgubWF4KHRoaXMubWluVmFsdWUsIHRoaXMuaGFuZGxlclZhbHVlc1t2YWx1ZUluZGV4XSAtIHRoaXMuc3RlcCksIGhhbmRsZXJUeXBlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdFZhbHVlcygpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJBcnJvd1JpZ2h0XCIgfHwgZXZlbnQua2V5ID09PSBcIkFycm93VXBcIikge1xuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZXJWYWx1ZShNYXRoLm1pbih0aGlzLm1heFZhbHVlLCB0aGlzLmhhbmRsZXJWYWx1ZXNbdmFsdWVJbmRleF0gKyB0aGlzLnN0ZXApLCBoYW5kbGVyVHlwZSk7XG4gICAgICAgICAgICB0aGlzLmVtaXRWYWx1ZXMoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiSG9tZVwiKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNsaWRlclZhbHVlKHRoaXMubWluVmFsdWUsIGhhbmRsZXJUeXBlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdFZhbHVlcygpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJFbmRcIikge1xuICAgICAgICAgICAgdGhpcy5zZXRTbGlkZXJWYWx1ZSh0aGlzLm1heFZhbHVlLCBoYW5kbGVyVHlwZSk7XG4gICAgICAgICAgICB0aGlzLmVtaXRWYWx1ZXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvbkhhbmRsZXJNb3VzZURvd24oaGFuZGxlclR5cGU6IFNsaWRlckhhbmRsZXJUeXBlKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGVyVHlwZSA9IGhhbmRsZXJUeXBlO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wcmV2aW91c1VzZXJTZWxlY3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUudXNlclNlbGVjdDtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSBcIm5vbmVcIjtcbiAgICAgICAgdGhpcy5zZXRFdmVudExpc3RlbmVycygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblRpY2tDbGljayhldmVudDogTW91c2VFdmVudCwgdGlja0VsZW1lbnQ6IEhUTUxTcGFuRWxlbWVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBoYW5kbGVyRGF0YSA9IHRoaXMuZ2V0Q2xvc2VzdEhhbmRsZXJEYXRhVG9Nb3VzZShldmVudCk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uRGF0YSA9IHRoaXMuZ2V0SGFuZGxlclBvc2l0aW9uRGF0YSh0aWNrRWxlbWVudCwgaGFuZGxlckRhdGEuZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy50aWNrc1twb3NpdGlvbkRhdGEudGlja0luZGV4XS52YWx1ZTtcbiAgICAgICAgdGhpcy5zZXRTbGlkZXJWYWx1ZSh2YWx1ZSwgaGFuZGxlckRhdGEudHlwZSk7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgdGhpcy5lbWl0VmFsdWVzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAgICAgIHZvaWQgMDtcbiAgICB9XG5cbiAgICBwdWJsaWMgd3JpdGVWYWx1ZShvYmo6IG51bWJlciB8IFtudW1iZXIsIG51bWJlcl0pOiB2b2lkIHtcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVuc3VyZUNvcnJlY3RWYWx1ZVR5cGUob2JqKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVyVmFsdWVzID0gW1xuICAgICAgICAgICAgICAgICAgICBNYXRoLm1heCh0aGlzLm1pblZhbHVlLCBNYXRoLm1pbih0aGlzLm1heFZhbHVlLCBvYmopKSxcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgodGhpcy5taW5WYWx1ZSwgTWF0aC5taW4odGhpcy5tYXhWYWx1ZSwgb2JqKSlcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2xpZGVyVmFsdWUodGhpcy5oYW5kbGVyVmFsdWVzWzBdLCBcInByaW1hcnlcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlclZhbHVlcyA9IFtcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgodGhpcy5taW5WYWx1ZSwgTWF0aC5taW4odGhpcy5tYXhWYWx1ZSwgb2JqWzBdKSksXG4gICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KHRoaXMubWluVmFsdWUsIE1hdGgubWluKHRoaXMubWF4VmFsdWUsIG9ialsxXSkpXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNsaWRlclZhbHVlKHRoaXMuaGFuZGxlclZhbHVlc1swXSwgXCJwcmltYXJ5XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2xpZGVyVmFsdWUodGhpcy5oYW5kbGVyVmFsdWVzWzFdLCBcInNlY29uZGFyeVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlVHJhY2tEYXRhKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJhbmdlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3RPbmUgPSB0aGlzLnNsaWRlclByaW1hcnlIYW5kbGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY3RUd28gPSB0aGlzLnNsaWRlclNlY29uZGFyeUhhbmRsZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2lkdGggPVxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5hYnMocmVjdE9uZS5sZWZ0IC0gcmVjdFR3by5sZWZ0KSAqIDEwMC4wKSAvXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyVHJhY2tFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdG1vc3RSZWN0ID0gcmVjdE9uZS5sZWZ0IDwgcmVjdFR3by5sZWZ0ID8gcmVjdE9uZSA6IHJlY3RUd287XG4gICAgICAgICAgICAgICAgdGhpcy50cmFja0RhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsZWZ0bW9zdFJlY3QubGVmdCAtIHRoaXMuc2xpZGVyVHJhY2tFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogd2lkdGhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IDAsXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IHRoaXMuaGFuZGxlck9uZVBvc2l0aW9uIDw9IDAgPyAwIDogdGhpcy5oYW5kbGVyT25lUG9zaXRpb25cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdE9uZSA9IHRoaXMuc2xpZGVyUHJpbWFyeUhhbmRsZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjdFR3byA9IHRoaXMuc2xpZGVyU2Vjb25kYXJ5SGFuZGxlckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPVxuICAgICAgICAgICAgICAgICAgICAoTWF0aC5hYnMocmVjdE9uZS5ib3R0b20gLSByZWN0VHdvLmJvdHRvbSkgKiAxMDAuMCkgL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclRyYWNrRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCBib3R0b21tb3N0UmVjdCA9IHJlY3RPbmUuYm90dG9tID4gcmVjdFR3by5ib3R0b20gPyByZWN0T25lIDogcmVjdFR3bztcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclRyYWNrRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSAtIGJvdHRvbW1vc3RSZWN0LmJvdHRvbSxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogaGVpZ2h0XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFja0RhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAwLFxuICAgICAgICAgICAgICAgICAgICBzaXplOiB0aGlzLmhhbmRsZXJPbmVQb3NpdGlvbiA8PSAwID8gMCA6IHRoaXMuaGFuZGxlck9uZVBvc2l0aW9uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBlbnN1cmVDb3JyZWN0VmFsdWVUeXBlKHZhbHVlOiBudW1iZXIgfCBbbnVtYmVyLCBudW1iZXJdIHwgbnVsbCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJhbmdlZCAmJiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlJhbmdlZCBzbGlkZXIgcmVxdWlyZXMgYW4gYXJyYXkgb2YgdmFsdWVzXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnJhbmdlZCAmJiB0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vbi1yYW5nZWQgc2xpZGVyIHJlcXVpcmVzIGEgc2luZ2xlIHZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kQ2xvc2VzdFRpY2tFbGVtZW50KGV2ZW50OiBNb3VzZUV2ZW50KTogSFRNTFNwYW5FbGVtZW50IHtcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tb25hLXNsaWRlci10aWNrID4gc3BhblwiKVxuICAgICAgICApIGFzIEhUTUxTcGFuRWxlbWVudFtdO1xuICAgICAgICBsZXQgbWF4RGlzdGFuY2UgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IFtleCwgZWxlbWVudF0gb2YgZWxlbWVudHMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHJlY3QubGVmdCAtIGV2ZW50LmNsaWVudFgsIDIpICsgTWF0aC5wb3cocmVjdC50b3AgLSBldmVudC5jbGllbnRZLCAyKSk7XG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPCBtYXhEaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgIG1heERpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudHNbaW5kZXhdO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2xvc2VzdEhhbmRsZXJEYXRhVG9Nb3VzZShldmVudDogTW91c2VFdmVudCk6IFNsaWRlckhhbmRsZXJEYXRhIHtcbiAgICAgICAgaWYgKCF0aGlzLnJhbmdlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInByaW1hcnlcIixcbiAgICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLnNsaWRlclByaW1hcnlIYW5kbGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByaW1hcnlIYW5kbGVyUmVjdCA9IHRoaXMuc2xpZGVyUHJpbWFyeUhhbmRsZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHNlY29uZGFyeUhhbmRsZXJSZWN0ID0gdGhpcy5zbGlkZXJTZWNvbmRhcnlIYW5kbGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBwcmltYXJ5RGlzdGFuY2UgPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICBNYXRoLnBvdyhwcmltYXJ5SGFuZGxlclJlY3QubGVmdCAtIGV2ZW50LmNsaWVudFgsIDIpICsgTWF0aC5wb3cocHJpbWFyeUhhbmRsZXJSZWN0LnRvcCAtIGV2ZW50LmNsaWVudFksIDIpXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IHNlY29uZGFyeURpc3RhbmNlID0gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgTWF0aC5wb3coc2Vjb25kYXJ5SGFuZGxlclJlY3QubGVmdCAtIGV2ZW50LmNsaWVudFgsIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhzZWNvbmRhcnlIYW5kbGVyUmVjdC50b3AgLSBldmVudC5jbGllbnRZLCAyKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gcHJpbWFyeURpc3RhbmNlIDwgc2Vjb25kYXJ5RGlzdGFuY2VcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgZWxlbWVudDogdGhpcy5zbGlkZXJQcmltYXJ5SGFuZGxlckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwicHJpbWFyeVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgZWxlbWVudDogdGhpcy5zbGlkZXJTZWNvbmRhcnlIYW5kbGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgdHlwZTogXCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0SGFuZGxlclBvc2l0aW9uRGF0YShcbiAgICAgICAgdGlja0VsZW1lbnQ6IEhUTUxTcGFuRWxlbWVudCxcbiAgICAgICAgc2xpZGVySGFuZGxlckVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50XG4gICAgKTogU2xpZGVySGFuZGxlclBvc2l0aW9uRGF0YSB7XG4gICAgICAgIGNvbnN0IHJlY3QgPSB0aWNrRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyUmVjdCA9IHRoaXMuc2xpZGVyVHJhY2tFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJSZWN0ID0gc2xpZGVySGFuZGxlckVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aWNrRWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICBjb25zdCB0aWNrRWxlbWVudHMgPVxuICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgICA/IEFycmF5LmZyb20ocGFyZW50RWxlbWVudD8uY2hpbGRyZW4gPz8gW10pXG4gICAgICAgICAgICAgICAgOiBBcnJheS5mcm9tKHBhcmVudEVsZW1lbnQ/LmNoaWxkcmVuID8/IFtdKS5yZXZlcnNlKCk7XG4gICAgICAgIGNvbnN0IHRpY2tFbGVtZW50SW5kZXggPSB0aWNrRWxlbWVudHMuaW5kZXhPZih0aWNrRWxlbWVudCk7XG4gICAgICAgIGNvbnN0IHRpY2tJbmRleCA9IE1hdGguY2VpbCh0aWNrRWxlbWVudEluZGV4IC8gMik7XG4gICAgICAgIGxldCBwb3NpdGlvbjogbnVtYmVyO1xuICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgICAgICAgIGlmICh0aWNrRWxlbWVudEluZGV4ICUgMiAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gKChyZWN0LnJpZ2h0IC0gY29udGFpbmVyUmVjdC5sZWZ0IC0gaGFuZGxlclJlY3Qud2lkdGggLyAyKSAqIDEwMC4wKSAvIGNvbnRhaW5lclJlY3Qud2lkdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpYmxpbmdSZWN0ID0gdGlja0VsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZz8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHNpYmxpbmdSZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgICAgICgoc2libGluZ1JlY3QucmlnaHQgLSBjb250YWluZXJSZWN0LmxlZnQgLSAoMiAqIGhhbmRsZXJSZWN0LndpZHRoKSAvIDIpICogMTAwLjApIC9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclJlY3Qud2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24gPSAoKCgtMSAqIGhhbmRsZXJSZWN0LndpZHRoKSAvIDIpICogMTAwLjApIC8gY29udGFpbmVyUmVjdC53aWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBwb3NpdGlvbiwgdGlja0luZGV4IH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGlja0VsZW1lbnRJbmRleCAlIDIgIT09IDApIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICgocmVjdC5ib3R0b20gLSBjb250YWluZXJSZWN0LnRvcCAtIGhhbmRsZXJSZWN0LmhlaWdodCAvIDIpICogMTAwLjApIC8gY29udGFpbmVyUmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNpYmxpbmdSZWN0ID0gdGlja0VsZW1lbnQucHJldmlvdXNFbGVtZW50U2libGluZz8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHNpYmxpbmdSZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgICAgICgoc2libGluZ1JlY3QuYm90dG9tIC0gY29udGFpbmVyUmVjdC50b3AgLSAoMiAqIGhhbmRsZXJSZWN0LmhlaWdodCkgLyAyKSAqIDEwMC4wKSAvXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXJSZWN0LmhlaWdodDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9ICgoKC0xICogaGFuZGxlclJlY3QuaGVpZ2h0KSAvIDIpICogMTAwLjApIC8gY29udGFpbmVyUmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgcG9zaXRpb24sIHRpY2tJbmRleCB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwcmVwYXJlVGlja3MoKTogdm9pZCB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCB2YWx1ZSA9IHRoaXMubWluO1xuICAgICAgICB3aGlsZSAodmFsdWUgPCB0aGlzLm1heCkge1xuICAgICAgICAgICAgdGhpcy50aWNrcy5wdXNoKHsgaW5kZXgsIHZhbHVlIH0pO1xuICAgICAgICAgICAgdmFsdWUgKz0gdGhpcy5zdGVwO1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRpY2tzLnB1c2goeyBpbmRleCwgdmFsdWU6IE1hdGgubWluKHZhbHVlICsgdGhpcy5zdGVwLCB0aGlzLm1heCkgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRFdmVudExpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRNb3VzZU1vdmVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50LCBcIm1vdXNlbW92ZVwiLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0aWNrRWxlbWVudCA9IHRoaXMuZmluZENsb3Nlc3RUaWNrRWxlbWVudChldmVudCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25EYXRhID0gdGhpcy5nZXRIYW5kbGVyUG9zaXRpb25EYXRhKFxuICAgICAgICAgICAgICAgICAgICB0aWNrRWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxTcGFuRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGVyVHlwZSA9PT0gXCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5zbGlkZXJQcmltYXJ5SGFuZGxlckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnNsaWRlclNlY29uZGFyeUhhbmRsZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUhhbmRsZXJUeXBlID09PSBcInByaW1hcnlcIiAmJiBwb3NpdGlvbkRhdGEucG9zaXRpb24gIT09IHRoaXMuaGFuZGxlck9uZVBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnRpY2tzW3Bvc2l0aW9uRGF0YS50aWNrSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlclZhbHVlc1swXSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNsaWRlclZhbHVlKHZhbHVlLCBcInByaW1hcnlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0VmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlclR5cGUgPT09IFwic2Vjb25kYXJ5XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25EYXRhLnBvc2l0aW9uICE9PSB0aGlzLmhhbmRsZXJUd29Qb3NpdGlvblxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy50aWNrc1twb3NpdGlvbkRhdGEudGlja0luZGV4XS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhbmRsZXJWYWx1ZXNbMV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTbGlkZXJWYWx1ZSh2YWx1ZSwgXCJzZWNvbmRhcnlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0VmFsdWVzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3Qgc3ViID0gZnJvbUV2ZW50KGRvY3VtZW50LCBcIm1vdXNldXBcIilcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucHJldmlvdXNVc2VyU2VsZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnVzZXJTZWxlY3QgPSB0aGlzLnByZXZpb3VzVXNlclNlbGVjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KFwidXNlci1zZWxlY3RcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRvY3VtZW50TW91c2VNb3ZlTGlzdGVuZXI/LigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNsaWRlclZhbHVlKHZhbHVlOiBudW1iZXIsIGhhbmRsZXJUeXBlOiBTbGlkZXJIYW5kbGVyVHlwZSA9IFwicHJpbWFyeVwiKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNsaWRlclZhbHVlID0gTWF0aC5tYXgodGhpcy5taW5WYWx1ZSwgTWF0aC5taW4odGhpcy5tYXhWYWx1ZSwgdmFsdWUpKTtcbiAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgICAgICBpZiAoaGFuZGxlclR5cGUgPT09IFwicHJpbWFyeVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVyT25lUG9zaXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAoKHNsaWRlclZhbHVlIC0gdGhpcy5taW5WYWx1ZSkgKiAxMDAuMCkgLyAodGhpcy5tYXhWYWx1ZSAtIHRoaXMubWluVmFsdWUpIC1cbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzLnNsaWRlclByaW1hcnlIYW5kbGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC8gMikgKiAxMDAuMCkgL1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJUcmFja0VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJWYWx1ZXNbMF0gPSBzbGlkZXJWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVyVHdvUG9zaXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAoKHNsaWRlclZhbHVlIC0gdGhpcy5taW5WYWx1ZSkgKiAxMDAuMCkgLyAodGhpcy5tYXhWYWx1ZSAtIHRoaXMubWluVmFsdWUpIC1cbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzLnNsaWRlclNlY29uZGFyeUhhbmRsZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLyAyKSAqIDEwMC4wKSAvXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclRyYWNrRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlclZhbHVlc1sxXSA9IHNsaWRlclZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGhhbmRsZXJUeXBlID09PSBcInByaW1hcnlcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlck9uZVBvc2l0aW9uID1cbiAgICAgICAgICAgICAgICAgICAgKChzbGlkZXJWYWx1ZSAtIHRoaXMubWluVmFsdWUpICogMTAwLjApIC8gKHRoaXMubWF4VmFsdWUgLSB0aGlzLm1pblZhbHVlKSAtXG4gICAgICAgICAgICAgICAgICAgICgodGhpcy5zbGlkZXJQcmltYXJ5SGFuZGxlckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLyAyKSAqIDEwMC4wKSAvXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNsaWRlclRyYWNrRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJWYWx1ZXNbMF0gPSBzbGlkZXJWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVyVHdvUG9zaXRpb24gPVxuICAgICAgICAgICAgICAgICAgICAoKHNsaWRlclZhbHVlIC0gdGhpcy5taW5WYWx1ZSkgKiAxMDAuMCkgLyAodGhpcy5tYXhWYWx1ZSAtIHRoaXMubWluVmFsdWUpIC1cbiAgICAgICAgICAgICAgICAgICAgKCh0aGlzLnNsaWRlclNlY29uZGFyeUhhbmRsZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMikgKiAxMDAuMCkgL1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJUcmFja0VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVyVmFsdWVzWzFdID0gc2xpZGVyVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVUcmFja0RhdGEoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldCBtYXhWYWx1ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy50aWNrc1t0aGlzLnRpY2tzLmxlbmd0aCAtIDFdLnZhbHVlO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXQgbWluVmFsdWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGlja3NbMF0udmFsdWU7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IGVtaXRWYWx1ZXMoKTogdm9pZDtcbn1cbiIsIjxkaXYgY2xhc3M9XCJtb25hLXNsaWRlclwiIFtuZ0NsYXNzXT1cInsnbW9uYS1uby1hbmltYXRpb24nOiAhaW5pdGlhbGl6ZWQsICdtb25hLXNsaWRlci1yYW5nZWQnOiByYW5nZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbW9uYS1zbGlkZXItaG9yaXpvbnRhbCc6IG9yaWVudGF0aW9uPT09J2hvcml6b250YWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ21vbmEtc2xpZGVyLXZlcnRpY2FsJzogb3JpZW50YXRpb249PT0ndmVydGljYWwnfVwiXG4gICAgIChmb2N1cyk9XCJzbGlkZXJQcmltYXJ5SGFuZGxlckVsZW1lbnQuZm9jdXMoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtb25hLXNsaWRlci10cmFja1wiICNzbGlkZXJUcmFja0VsZW1lbnQ+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb25hLXNsaWRlci1oaWdobGlnaHRcIiBbbmdDbGFzc109XCJ7J21vbmEtZHJhZ2dpbmcnOiBkcmFnZ2luZ31cIlxuICAgICAgICAgICAgIFtzdHlsZS53aWR0aC4lXT1cIm9yaWVudGF0aW9uPT09J2hvcml6b250YWwnID8gdHJhY2tEYXRhLnNpemUgOiB1bmRlZmluZWRcIlxuICAgICAgICAgICAgIFtzdHlsZS5oZWlnaHQuJV09XCJvcmllbnRhdGlvbj09PSd2ZXJ0aWNhbCcgPyB0cmFja0RhdGEuc2l6ZSA6IHVuZGVmaW5lZFwiXG4gICAgICAgICAgICAgW3N0eWxlLmxlZnQucHhdPVwib3JpZW50YXRpb249PT0naG9yaXpvbnRhbCcgPyB0cmFja0RhdGEucG9zaXRpb24gOiB1bmRlZmluZWRcIlxuICAgICAgICAgICAgIFtzdHlsZS5ib3R0b20ucHhdPVwib3JpZW50YXRpb249PT0ndmVydGljYWwnID8gdHJhY2tEYXRhLnBvc2l0aW9uIDogdW5kZWZpbmVkXCI+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJtb25hLXNsaWRlci10aWNrLWxpc3RcIiAjdGlja0xpc3RFbGVtZW50PlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCB0aWNrIG9mIHRpY2tzOyBsZXQgdHggPSBpbmRleDtcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibW9uYS1zbGlkZXItdGlja1wiIFtuZ0NsYXNzXT1cInsnbW9uYS1zbGlkZXItdGljay12aXNpYmxlJzogc2hvd1RpY2tzfVwiICN0aWNrU3BhbkVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICpuZ0lmPVwidHggIT09IDBcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCJ7J21vbmEtZHJhZ2dpbmcnOiBkcmFnZ2luZ31cIlxuICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvblRpY2tDbGljaygkZXZlbnQsIHRpY2tTcGFuRWxlbWVudClcIj48L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1vbmEtc2xpZGVyLXRpY2tcIiBbbmdDbGFzc109XCJ7J21vbmEtc2xpZGVyLXRpY2stdmlzaWJsZSc6IHNob3dUaWNrc31cIiAjdGlja1NwYW5FbGVtZW50XG4gICAgICAgICAgICAgICAgICAqbmdJZj1cInR4ICE9PSB0aWNrcy5sZW5ndGggLSAxXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gW25nQ2xhc3NdPVwieydtb25hLWRyYWdnaW5nJzogZHJhZ2dpbmd9XCJcbiAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25UaWNrQ2xpY2soJGV2ZW50LCB0aWNrU3BhbkVsZW1lbnQpXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibW9uYS1zbGlkZXItdGljay1sYWJlbC1saXN0XCIgW25nQ2xhc3NdPVwieydtb25hLXBvc2l0aW9uLWJlZm9yZSc6IGxhYmVsUG9zaXRpb249PT0nYmVmb3JlJywgJ21vbmEtcG9zaXRpb24tYWZ0ZXInOiBsYWJlbFBvc2l0aW9uPT09J2FmdGVyJ31cIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgdGljayBvZiB0aWNrczsgbGV0IHR4ID0gaW5kZXg7XCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1vbmEtc2xpZGVyLXRpY2stbGFiZWxcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiF0aWNrVmFsdWVUZW1wbGF0ZSAmJiB0eCAlIGxhYmVsU3RlcCA9PT0gMFwiPnt7dGljay52YWx1ZX19PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwidGlja1ZhbHVlVGVtcGxhdGUgJiYgdHggJSBsYWJlbFN0ZXAgPT09IDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0aWNrVmFsdWVUZW1wbGF0ZTsgY29udGV4dDogeyRpbXBsaWNpdDogdGljay52YWx1ZX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtc2xpZGVyLWhhbmRsZXIgbW9uYS1zbGlkZXItaGFuZGxlci1maXJzdFwiXG4gICAgICAgICBbbmdDbGFzc109XCJ7J21vbmEtZHJhZ2dpbmcnOiBkcmFnZ2luZ31cIlxuICAgICAgICAgW3N0eWxlLmxlZnQuJV09XCJvcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnID8gaGFuZGxlck9uZVBvc2l0aW9uIDogdW5kZWZpbmVkXCJcbiAgICAgICAgIFtzdHlsZS5ib3R0b20uJV09XCJvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/IGhhbmRsZXJPbmVQb3NpdGlvbiA6IHVuZGVmaW5lZFwiXG4gICAgICAgICBbc3R5bGUucG9pbnRlci1ldmVudHNdPVwiZHJhZ2dpbmcgJiYgYWN0aXZlSGFuZGxlclR5cGU9PT0nc2Vjb25kYXJ5JyA/ICdub25lJyA6IHVuZGVmaW5lZFwiXG4gICAgICAgICBbYXR0ci50YWJpbmRleF09XCIwXCJcbiAgICAgICAgIChrZXlkb3duKT1cIm9uSGFuZGxlcktleURvd24oJGV2ZW50LCAncHJpbWFyeScpXCJcbiAgICAgICAgIChtb3VzZWRvd24pPVwib25IYW5kbGVyTW91c2VEb3duKCdwcmltYXJ5JylcIiAjc2xpZGVyUHJpbWFyeUhhbmRsZXJFbGVtZW50PjwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtc2xpZGVyLWhhbmRsZXIgbW9uYS1zbGlkZXItaGFuZGxlci1zZWNvbmRcIlxuICAgICAgICAgW25nQ2xhc3NdPVwieydtb25hLWRyYWdnaW5nJzogZHJhZ2dpbmd9XCJcbiAgICAgICAgIFtzdHlsZS5sZWZ0LiVdPVwib3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJyA/IGhhbmRsZXJUd29Qb3NpdGlvbiA6IHVuZGVmaW5lZFwiXG4gICAgICAgICBbc3R5bGUuYm90dG9tLiVdPVwib3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgPyBoYW5kbGVyVHdvUG9zaXRpb24gOiB1bmRlZmluZWRcIlxuICAgICAgICAgW3N0eWxlLnBvaW50ZXItZXZlbnRzXT1cImRyYWdnaW5nICYmIGFjdGl2ZUhhbmRsZXJUeXBlPT09J3ByaW1hcnknID8gJ25vbmUnIDogdW5kZWZpbmVkXCJcbiAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cIjBcIlxuICAgICAgICAgKGtleWRvd24pPVwib25IYW5kbGVyS2V5RG93bigkZXZlbnQsICdzZWNvbmRhcnknKVwiXG4gICAgICAgICAobW91c2Vkb3duKT1cIm9uSGFuZGxlck1vdXNlRG93bignc2Vjb25kYXJ5JylcIiAjc2xpZGVyU2Vjb25kYXJ5SGFuZGxlckVsZW1lbnQgKm5nSWY9XCJyYW5nZWRcIj48L2Rpdj5cbjwvZGl2PlxuIl19