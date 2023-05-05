import { Component, ContentChild, Input } from "@angular/core";
import { CircularProgressBarLabelTemplateDirective } from "../../directives/circular-progress-bar-label-template.directive";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class CircularProgressBarComponent {
    set value(value) {
        this.updateProgress(value);
    }
    constructor() {
        this.circumference = 0;
        this.color = "var(--mona-primary)";
        this.disabled = false;
        this.indeterminate = false;
        this.labelTemplateDirective = null;
        this.max = 100;
        this.min = 0;
        this.progress = 0;
        this.size = 100;
        this.thickness = 5;
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.updateProgress(this.progress);
        });
    }
    ngOnInit() {
        this.circumference = 2 * Math.PI * (this.size / 2 - this.thickness);
    }
    updateProgress(value) {
        this.progress = ((value - this.min) / (this.max - this.min)) * 100;
    }
    get sizePx() {
        return `${this.size}px`;
    }
    get strokeColor() {
        return typeof this.color === "string" ? this.color : this.color(this.progress);
    }
    get strokeDashOffset() {
        const dashOffset = this.circumference * (1 - this.progress / 100);
        return this.indeterminate ? this.circumference / 1.42 : dashOffset;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: CircularProgressBarComponent, selector: "mona-circular-progress-bar", inputs: { color: "color", disabled: "disabled", indeterminate: "indeterminate", max: "max", min: "min", progress: "progress", size: "size", thickness: "thickness", value: "value" }, queries: [{ propertyName: "labelTemplateDirective", first: true, predicate: CircularProgressBarLabelTemplateDirective, descendants: true }], ngImport: i0, template: "<div class=\"mona-circular-progress-bar\" [ngStyle]=\"{'width': sizePx, 'height': sizePx}\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <svg>\n        <circle [attr.cx]=\"size/2\" [attr.cy]=\"size/2\" [attr.r]=\"size/2 - thickness\" [attr.stroke]=\"strokeColor\"\n                [attr.stroke-dasharray]=\"circumference\" [attr.stroke-dashoffset]=\"strokeDashOffset\"\n                [attr.stroke-width]=\"thickness\" fill=\"transparent\" [ngClass]=\"{'mona-circular-progress-bar-indeterminate': indeterminate}\" />\n    </svg>\n    <div class=\"mona-circular-progress-bar-label\" *ngIf=\"!indeterminate\">\n        <ng-container *ngIf=\"!labelTemplateDirective\">{{progress}}%</ng-container>\n        <ng-container [ngTemplateOutlet]=\"labelTemplateDirective.templateRef\" [ngTemplateOutletContext]=\"{$implicit: progress}\"\n                      *ngIf=\"!!labelTemplateDirective\"></ng-container>\n    </div>\n</div>\n", styles: ["div.mona-circular-progress-bar{display:flex;align-items:center;justify-content:center;position:relative}svg{width:100%;height:100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}circle{transform-origin:center;transform:rotate(-90deg);transition:stroke-dashoffset .35s linear,stroke .35s linear}.mona-circular-progress-bar-indeterminate{animation:rotate 2s linear infinite}@keyframes rotate{0%{transform:rotate(0)}50%{transform:rotate(180deg)}to{transform:rotate(360deg)}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-circular-progress-bar", template: "<div class=\"mona-circular-progress-bar\" [ngStyle]=\"{'width': sizePx, 'height': sizePx}\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <svg>\n        <circle [attr.cx]=\"size/2\" [attr.cy]=\"size/2\" [attr.r]=\"size/2 - thickness\" [attr.stroke]=\"strokeColor\"\n                [attr.stroke-dasharray]=\"circumference\" [attr.stroke-dashoffset]=\"strokeDashOffset\"\n                [attr.stroke-width]=\"thickness\" fill=\"transparent\" [ngClass]=\"{'mona-circular-progress-bar-indeterminate': indeterminate}\" />\n    </svg>\n    <div class=\"mona-circular-progress-bar-label\" *ngIf=\"!indeterminate\">\n        <ng-container *ngIf=\"!labelTemplateDirective\">{{progress}}%</ng-container>\n        <ng-container [ngTemplateOutlet]=\"labelTemplateDirective.templateRef\" [ngTemplateOutletContext]=\"{$implicit: progress}\"\n                      *ngIf=\"!!labelTemplateDirective\"></ng-container>\n    </div>\n</div>\n", styles: ["div.mona-circular-progress-bar{display:flex;align-items:center;justify-content:center;position:relative}svg{width:100%;height:100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}circle{transform-origin:center;transform:rotate(-90deg);transition:stroke-dashoffset .35s linear,stroke .35s linear}.mona-circular-progress-bar-indeterminate{animation:rotate 2s linear infinite}@keyframes rotate{0%{transform:rotate(0)}50%{transform:rotate(180deg)}to{transform:rotate(360deg)}}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { color: [{
                type: Input
            }], disabled: [{
                type: Input
            }], indeterminate: [{
                type: Input
            }], labelTemplateDirective: [{
                type: ContentChild,
                args: [CircularProgressBarLabelTemplateDirective]
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], progress: [{
                type: Input
            }], size: [{
                type: Input
            }], thickness: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY3VsYXItcHJvZ3Jlc3MtYmFyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9wcm9ncmVzcy1iYXJzL21vZHVsZXMvY2lyY3VsYXItcHJvZ3Jlc3MtYmFyL2NvbXBvbmVudHMvY2lyY3VsYXItcHJvZ3Jlc3MtYmFyL2NpcmN1bGFyLXByb2dyZXNzLWJhci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvcHJvZ3Jlc3MtYmFycy9tb2R1bGVzL2NpcmN1bGFyLXByb2dyZXNzLWJhci9jb21wb25lbnRzL2NpcmN1bGFyLXByb2dyZXNzLWJhci9jaXJjdWxhci1wcm9ncmVzcy1iYXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFpQixTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUV0RixPQUFPLEVBQUUseUNBQXlDLEVBQUUsTUFBTSxpRUFBaUUsQ0FBQzs7O0FBTzVILE1BQU0sT0FBTyw0QkFBNEI7SUE4QnJDLElBQ1csS0FBSyxDQUFDLEtBQWE7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQ7UUFsQ08sa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFHMUIsVUFBSyxHQUFvQyxxQkFBcUIsQ0FBQztRQUcvRCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBRzFCLGtCQUFhLEdBQVksS0FBSyxDQUFDO1FBRy9CLDJCQUFzQixHQUFxRCxJQUFJLENBQUM7UUFHaEYsUUFBRyxHQUFXLEdBQUcsQ0FBQztRQUdsQixRQUFHLEdBQVcsQ0FBQyxDQUFDO1FBR2hCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFHckIsU0FBSSxHQUFXLEdBQUcsQ0FBQztRQUduQixjQUFTLEdBQVcsQ0FBQyxDQUFDO0lBT1AsQ0FBQztJQUVoQixlQUFlO1FBQ2xCLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ25CLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLFFBQVE7UUFDWCxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFTyxjQUFjLENBQUMsS0FBYTtRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdkUsQ0FBQztJQUVELElBQVcsTUFBTTtRQUNiLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQVcsV0FBVztRQUNsQixPQUFPLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCxJQUFXLGdCQUFnQjtRQUN2QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDbEUsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO0lBQ3ZFLENBQUM7OEdBOURRLDRCQUE0QjtrR0FBNUIsNEJBQTRCLDRTQVl2Qix5Q0FBeUMsZ0RDckIzRCxnNkJBWUE7OzJGREhhLDRCQUE0QjtrQkFMeEMsU0FBUzsrQkFDSSw0QkFBNEI7MEVBUS9CLEtBQUs7c0JBRFgsS0FBSztnQkFJQyxRQUFRO3NCQURkLEtBQUs7Z0JBSUMsYUFBYTtzQkFEbkIsS0FBSztnQkFJQyxzQkFBc0I7c0JBRDVCLFlBQVk7dUJBQUMseUNBQXlDO2dCQUloRCxHQUFHO3NCQURULEtBQUs7Z0JBSUMsR0FBRztzQkFEVCxLQUFLO2dCQUlDLFFBQVE7c0JBRGQsS0FBSztnQkFJQyxJQUFJO3NCQURWLEtBQUs7Z0JBSUMsU0FBUztzQkFEZixLQUFLO2dCQUlLLEtBQUs7c0JBRGYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0IH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi8uLi8uLi91dGlscy9BY3Rpb25cIjtcbmltcG9ydCB7IENpcmN1bGFyUHJvZ3Jlc3NCYXJMYWJlbFRlbXBsYXRlRGlyZWN0aXZlIH0gZnJvbSBcIi4uLy4uL2RpcmVjdGl2ZXMvY2lyY3VsYXItcHJvZ3Jlc3MtYmFyLWxhYmVsLXRlbXBsYXRlLmRpcmVjdGl2ZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLWNpcmN1bGFyLXByb2dyZXNzLWJhclwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vY2lyY3VsYXItcHJvZ3Jlc3MtYmFyLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2NpcmN1bGFyLXByb2dyZXNzLWJhci5jb21wb25lbnQuc2Nzc1wiXVxufSlcbmV4cG9ydCBjbGFzcyBDaXJjdWxhclByb2dyZXNzQmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgICBwdWJsaWMgY2lyY3VtZmVyZW5jZTogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGNvbG9yOiBzdHJpbmcgfCBBY3Rpb248bnVtYmVyLCBzdHJpbmc+ID0gXCJ2YXIoLS1tb25hLXByaW1hcnkpXCI7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaW5kZXRlcm1pbmF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQENvbnRlbnRDaGlsZChDaXJjdWxhclByb2dyZXNzQmFyTGFiZWxUZW1wbGF0ZURpcmVjdGl2ZSlcbiAgICBwdWJsaWMgbGFiZWxUZW1wbGF0ZURpcmVjdGl2ZTogQ2lyY3VsYXJQcm9ncmVzc0JhckxhYmVsVGVtcGxhdGVEaXJlY3RpdmUgfCBudWxsID0gbnVsbDtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG1heDogbnVtYmVyID0gMTAwO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgbWluOiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzaXplOiBudW1iZXIgPSAxMDA7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0aGlja25lc3M6IG51bWJlciA9IDU7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IG51bWJlcikge1xuICAgICAgICB0aGlzLnVwZGF0ZVByb2dyZXNzKHZhbHVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9ncmVzcyh0aGlzLnByb2dyZXNzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNpcmN1bWZlcmVuY2UgPSAyICogTWF0aC5QSSAqICh0aGlzLnNpemUgLyAyIC0gdGhpcy50aGlja25lc3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUHJvZ3Jlc3ModmFsdWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnByb2dyZXNzID0gKCh2YWx1ZSAtIHRoaXMubWluKSAvICh0aGlzLm1heCAtIHRoaXMubWluKSkgKiAxMDA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzaXplUHgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuc2l6ZX1weGA7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzdHJva2VDb2xvcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHRoaXMuY29sb3IgPT09IFwic3RyaW5nXCIgPyB0aGlzLmNvbG9yIDogdGhpcy5jb2xvcih0aGlzLnByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHN0cm9rZURhc2hPZmZzZXQoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZGFzaE9mZnNldCA9IHRoaXMuY2lyY3VtZmVyZW5jZSAqICgxIC0gdGhpcy5wcm9ncmVzcyAvIDEwMCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV0ZXJtaW5hdGUgPyB0aGlzLmNpcmN1bWZlcmVuY2UgLyAxLjQyIDogZGFzaE9mZnNldDtcbiAgICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibW9uYS1jaXJjdWxhci1wcm9ncmVzcy1iYXJcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzogc2l6ZVB4LCAnaGVpZ2h0Jzogc2l6ZVB4fVwiIFtuZ0NsYXNzXT1cInsnbW9uYS1kaXNhYmxlZCc6IGRpc2FibGVkfVwiPlxuICAgIDxzdmc+XG4gICAgICAgIDxjaXJjbGUgW2F0dHIuY3hdPVwic2l6ZS8yXCIgW2F0dHIuY3ldPVwic2l6ZS8yXCIgW2F0dHIucl09XCJzaXplLzIgLSB0aGlja25lc3NcIiBbYXR0ci5zdHJva2VdPVwic3Ryb2tlQ29sb3JcIlxuICAgICAgICAgICAgICAgIFthdHRyLnN0cm9rZS1kYXNoYXJyYXldPVwiY2lyY3VtZmVyZW5jZVwiIFthdHRyLnN0cm9rZS1kYXNob2Zmc2V0XT1cInN0cm9rZURhc2hPZmZzZXRcIlxuICAgICAgICAgICAgICAgIFthdHRyLnN0cm9rZS13aWR0aF09XCJ0aGlja25lc3NcIiBmaWxsPVwidHJhbnNwYXJlbnRcIiBbbmdDbGFzc109XCJ7J21vbmEtY2lyY3VsYXItcHJvZ3Jlc3MtYmFyLWluZGV0ZXJtaW5hdGUnOiBpbmRldGVybWluYXRlfVwiIC8+XG4gICAgPC9zdmc+XG4gICAgPGRpdiBjbGFzcz1cIm1vbmEtY2lyY3VsYXItcHJvZ3Jlc3MtYmFyLWxhYmVsXCIgKm5nSWY9XCIhaW5kZXRlcm1pbmF0ZVwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIWxhYmVsVGVtcGxhdGVEaXJlY3RpdmVcIj57e3Byb2dyZXNzfX0lPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwibGFiZWxUZW1wbGF0ZURpcmVjdGl2ZS50ZW1wbGF0ZVJlZlwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBwcm9ncmVzc31cIlxuICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiISFsYWJlbFRlbXBsYXRlRGlyZWN0aXZlXCI+PC9uZy1jb250YWluZXI+XG4gICAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==