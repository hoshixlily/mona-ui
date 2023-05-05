import { ChangeDetectionStrategy, Component, Input, ViewChild } from "@angular/core";
import { DateTime } from "luxon";
import { Enumerable } from "@mirei/ts-collections";
import { AbstractDateInputComponent } from "../../../../components/abstract-date-input/abstract-date-input.component";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class TimeSelectorComponent extends AbstractDateInputComponent {
    constructor(cdr, elementRef) {
        super(cdr);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.hour = null;
        this.hours = [];
        this.meridiem = "AM";
        this.minute = null;
        this.minutes = [];
        this.second = null;
        this.seconds = [];
        this.format = "HH:mm";
        this.hourFormat = "24";
        this.showSeconds = false;
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            const lists = this.elementRef.nativeElement.querySelectorAll("ol");
            for (const list of lists) {
                this.scrollList(list);
            }
        }, 0);
    }
    ngOnInit() {
        super.ngOnInit();
        this.hours = this.hourFormat === "24" ? Enumerable.range(0, 24).toArray() : Enumerable.range(1, 12).toArray();
        this.minutes = Enumerable.range(0, 60).toArray();
        this.seconds = Enumerable.range(0, 60).toArray();
        if (this.value) {
            this.navigatedDate = this.value;
            this.meridiem = this.navigatedDate.getHours() >= 12 ? "PM" : "AM";
            this.updateHour();
            this.updateMinute();
            this.updateSecond();
        }
    }
    onHourChange(value) {
        this.hour = value;
        if (!this.navigatedDate) {
            const now = this.minute != null ? DateTime.now().set({ minute: this.minute }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        if (this.hour < 0) {
            this.hour = 23;
        }
        let newHour;
        if (this.hourFormat === "24") {
            newHour = this.hour % 24;
        }
        else {
            newHour = this.hour % 12;
            if (this.meridiem === "PM") {
                newHour += 12;
            }
        }
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ hour: newHour }).toJSDate();
        if (this.hourFormat === "12") {
            this.hour = newHour % 12 || 12;
        }
        this.setCurrentDate(this.navigatedDate);
        this.scrollList(this.hoursListElement.nativeElement, newHour);
    }
    onMeridiemClick(meridiem) {
        if (this.readonly && this.meridiem === meridiem) {
            return;
        }
        const date = DateTime.now().toJSDate();
        this.meridiem = meridiem;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate ?? date)
            .set({ hour: (this.navigatedDate ?? date).getHours() + (meridiem === "AM" ? -12 : 12) })
            .toJSDate();
        this.updateHour();
        this.updateMinute();
        this.updateSecond();
        this.setCurrentDate(this.navigatedDate);
    }
    onMinuteChange(value) {
        this.minute = value;
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const minute = +this.minute > 59 ? 0 : +this.minute < 0 ? 59 : +this.minute;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute }).toJSDate();
        this.minute = minute;
        this.setCurrentDate(this.navigatedDate);
        this.scrollList(this.minutesListElement.nativeElement, minute);
    }
    onSecondChange(value) {
        this.second = value;
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const second = +this.second > 59 ? 0 : +this.second < 0 ? 59 : +this.second;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ second }).toJSDate();
        this.second = second;
        this.scrollList(this.secondsListElement.nativeElement, second);
        this.setCurrentDate(this.navigatedDate);
    }
    scrollList(list, value) {
        if (value == null) {
            window.setTimeout(() => {
                const selectedElement = list.querySelector(".mona-selected");
                if (selectedElement) {
                    selectedElement.scrollIntoView({ behavior: "auto", block: "center" });
                }
            }, 0);
        }
        else {
            const element = list.querySelector(`[data-value="${value}"]`);
            if (element) {
                element.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }
    updateHour() {
        if (this.navigatedDate) {
            this.hour =
                this.hourFormat === "12" ? this.navigatedDate.getHours() % 12 || 12 : this.navigatedDate.getHours();
        }
    }
    updateMinute() {
        if (this.navigatedDate) {
            this.minute = this.navigatedDate.getMinutes();
        }
    }
    updateSecond() {
        if (this.navigatedDate) {
            this.second = this.navigatedDate.getSeconds();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TimeSelectorComponent, selector: "mona-time-selector", inputs: { format: "format", hourFormat: "hourFormat", showSeconds: "showSeconds" }, viewQueries: [{ propertyName: "hoursListElement", first: true, predicate: ["hoursListElement"], descendants: true }, { propertyName: "minutesListElement", first: true, predicate: ["minutesListElement"], descendants: true }, { propertyName: "secondsListElement", first: true, predicate: ["secondsListElement"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-time-selector\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <ol #hoursListElement>\n        <li *ngFor=\"let h of hours\" [ngClass]=\"{'mona-selected':h===hour}\" (click)=\"onHourChange(h)\" [attr.data-value]=\"h\">{{h | number:'2.0'}}</li>\n    </ol>\n    <ol #minutesListElement>\n        <li *ngFor=\"let m of minutes\" [ngClass]=\"{'mona-selected':m===minute}\" (click)=\"onMinuteChange(m)\"  [attr.data-value]=\"m\">{{m | number:'2.0'}}</li>\n    </ol>\n    <ol #secondsListElement *ngIf=\"showSeconds\">\n        <li *ngFor=\"let s of seconds\" [ngClass]=\"{'mona-selected':s===second}\" (click)=\"onSecondChange(s)\" [attr.data-value]=\"s\">{{s | number:'2.0'}}</li>\n    </ol>\n    <ol *ngIf=\"hourFormat==='12'\">\n        <li [ngClass]=\"{'mona-selected': meridiem==='AM'}\" (click)=\"onMeridiemClick('AM')\">AM</li>\n        <li [ngClass]=\"{'mona-selected': meridiem==='PM'}\" (click)=\"onMeridiemClick('PM')\">PM</li>\n    </ol>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-time-selector{display:flex;width:100%;height:250px;overflow:hidden}div.mona-time-selector ol{flex:1;display:flex;list-style:none;flex-direction:column;overflow:hidden auto}div.mona-time-selector ol li{display:flex;align-items:center;justify-content:center;padding:8px 0;font-weight:700}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: i1.DecimalPipe, name: "number" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-time-selector", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-time-selector\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <ol #hoursListElement>\n        <li *ngFor=\"let h of hours\" [ngClass]=\"{'mona-selected':h===hour}\" (click)=\"onHourChange(h)\" [attr.data-value]=\"h\">{{h | number:'2.0'}}</li>\n    </ol>\n    <ol #minutesListElement>\n        <li *ngFor=\"let m of minutes\" [ngClass]=\"{'mona-selected':m===minute}\" (click)=\"onMinuteChange(m)\"  [attr.data-value]=\"m\">{{m | number:'2.0'}}</li>\n    </ol>\n    <ol #secondsListElement *ngIf=\"showSeconds\">\n        <li *ngFor=\"let s of seconds\" [ngClass]=\"{'mona-selected':s===second}\" (click)=\"onSecondChange(s)\" [attr.data-value]=\"s\">{{s | number:'2.0'}}</li>\n    </ol>\n    <ol *ngIf=\"hourFormat==='12'\">\n        <li [ngClass]=\"{'mona-selected': meridiem==='AM'}\" (click)=\"onMeridiemClick('AM')\">AM</li>\n        <li [ngClass]=\"{'mona-selected': meridiem==='PM'}\" (click)=\"onMeridiemClick('PM')\">PM</li>\n    </ol>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-time-selector{display:flex;width:100%;height:250px;overflow:hidden}div.mona-time-selector ol{flex:1;display:flex;list-style:none;flex-direction:column;overflow:hidden auto}div.mona-time-selector ol li{display:flex;align-items:center;justify-content:center;padding:8px 0;font-weight:700}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { format: [{
                type: Input
            }], hourFormat: [{
                type: Input
            }], hoursListElement: [{
                type: ViewChild,
                args: ["hoursListElement"]
            }], minutesListElement: [{
                type: ViewChild,
                args: ["minutesListElement"]
            }], secondsListElement: [{
                type: ViewChild,
                args: ["secondsListElement"]
            }], showSeconds: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1zZWxlY3Rvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvZGF0ZS1pbnB1dHMvbW9kdWxlcy90aW1lLXNlbGVjdG9yL2NvbXBvbmVudHMvdGltZS1zZWxlY3Rvci90aW1lLXNlbGVjdG9yLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9kYXRlLWlucHV0cy9tb2R1bGVzL3RpbWUtc2VsZWN0b3IvY29tcG9uZW50cy90aW1lLXNlbGVjdG9yL3RpbWUtc2VsZWN0b3IuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBRVQsS0FBSyxFQUdMLFNBQVMsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQ2pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSwwRUFBMEUsQ0FBQzs7O0FBUXRILE1BQU0sT0FBTyxxQkFBc0IsU0FBUSwwQkFBMEI7SUEyQmpFLFlBQStDLEdBQXNCLEVBQW1CLFVBQXNCO1FBQzFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQURnQyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUFtQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBMUJ2RyxTQUFJLEdBQWtCLElBQUksQ0FBQztRQUMzQixVQUFLLEdBQWEsRUFBRSxDQUFDO1FBQ3JCLGFBQVEsR0FBZ0IsSUFBSSxDQUFDO1FBQzdCLFdBQU0sR0FBa0IsSUFBSSxDQUFDO1FBQzdCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFDdkIsV0FBTSxHQUFrQixJQUFJLENBQUM7UUFD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O3NCQUR0QixTQUFTO3VCQUFDLGtCQUFrQjtnQkFJdEIsa0JBQWtCO3NCQUR4QixTQUFTO3VCQUFDLG9CQUFvQjtnQkFJeEIsa0JBQWtCO3NCQUR4QixTQUFTO3VCQUFDLG9CQUFvQjtnQkFJeEIsV0FBVztzQkFEakIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgRWxlbWVudFJlZixcbiAgICBJbnB1dCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIFZpZXdDaGlsZFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgRGF0ZVRpbWUgfSBmcm9tIFwibHV4b25cIjtcbmltcG9ydCB7IEVudW1lcmFibGUgfSBmcm9tIFwiQG1pcmVpL3RzLWNvbGxlY3Rpb25zXCI7XG5pbXBvcnQgeyBBYnN0cmFjdERhdGVJbnB1dENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi8uLi8uLi9jb21wb25lbnRzL2Fic3RyYWN0LWRhdGUtaW5wdXQvYWJzdHJhY3QtZGF0ZS1pbnB1dC5jb21wb25lbnRcIjtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwibW9uYS10aW1lLXNlbGVjdG9yXCIsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi90aW1lLXNlbGVjdG9yLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL3RpbWUtc2VsZWN0b3IuY29tcG9uZW50LnNjc3NcIl0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgVGltZVNlbGVjdG9yQ29tcG9uZW50IGV4dGVuZHMgQWJzdHJhY3REYXRlSW5wdXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcHVibGljIGhvdXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICAgIHB1YmxpYyBob3VyczogbnVtYmVyW10gPSBbXTtcbiAgICBwdWJsaWMgbWVyaWRpZW06IFwiQU1cIiB8IFwiUE1cIiA9IFwiQU1cIjtcbiAgICBwdWJsaWMgbWludXRlOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgbWludXRlczogbnVtYmVyW10gPSBbXTtcbiAgICBwdWJsaWMgc2Vjb25kOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgc2Vjb25kczogbnVtYmVyW10gPSBbXTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIG92ZXJyaWRlIGZvcm1hdDogc3RyaW5nID0gXCJISDptbVwiO1xuXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgaG91ckZvcm1hdDogXCIxMlwiIHwgXCIyNFwiID0gXCIyNFwiO1xuXG4gICAgQFZpZXdDaGlsZChcImhvdXJzTGlzdEVsZW1lbnRcIilcbiAgICBwdWJsaWMgaG91cnNMaXN0RWxlbWVudCE6IEVsZW1lbnRSZWY8SFRNTE9MaXN0RWxlbWVudD47XG5cbiAgICBAVmlld0NoaWxkKFwibWludXRlc0xpc3RFbGVtZW50XCIpXG4gICAgcHVibGljIG1pbnV0ZXNMaXN0RWxlbWVudCE6IEVsZW1lbnRSZWY8SFRNTE9MaXN0RWxlbWVudD47XG5cbiAgICBAVmlld0NoaWxkKFwic2Vjb25kc0xpc3RFbGVtZW50XCIpXG4gICAgcHVibGljIHNlY29uZHNMaXN0RWxlbWVudCE6IEVsZW1lbnRSZWY8SFRNTE9MaXN0RWxlbWVudD47XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzaG93U2Vjb25kczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBvdmVycmlkZSByZWFkb25seSBjZHI6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgc3VwZXIoY2RyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0cyA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJvbFwiKSBhcyBIVE1MT0xpc3RFbGVtZW50W107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxpc3Qgb2YgbGlzdHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbExpc3QobGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBvdmVycmlkZSBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICAgICAgdGhpcy5ob3VycyA9IHRoaXMuaG91ckZvcm1hdCA9PT0gXCIyNFwiID8gRW51bWVyYWJsZS5yYW5nZSgwLCAyNCkudG9BcnJheSgpIDogRW51bWVyYWJsZS5yYW5nZSgxLCAxMikudG9BcnJheSgpO1xuICAgICAgICB0aGlzLm1pbnV0ZXMgPSBFbnVtZXJhYmxlLnJhbmdlKDAsIDYwKS50b0FycmF5KCk7XG4gICAgICAgIHRoaXMuc2Vjb25kcyA9IEVudW1lcmFibGUucmFuZ2UoMCwgNjApLnRvQXJyYXkoKTtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGVkRGF0ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB0aGlzLm1lcmlkaWVtID0gdGhpcy5uYXZpZ2F0ZWREYXRlLmdldEhvdXJzKCkgPj0gMTIgPyBcIlBNXCIgOiBcIkFNXCI7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUhvdXIoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWludXRlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlY29uZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uSG91ckNoYW5nZSh2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaG91ciA9IHZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMubmF2aWdhdGVkRGF0ZSkge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gdGhpcy5taW51dGUgIT0gbnVsbCA/IERhdGVUaW1lLm5vdygpLnNldCh7IG1pbnV0ZTogdGhpcy5taW51dGUgfSkgOiBEYXRlVGltZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGVkRGF0ZSA9IG5vdy50b0pTRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhvdXIgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLmhvdXIgPSAyMztcbiAgICAgICAgfVxuICAgICAgICBsZXQgbmV3SG91cjogbnVtYmVyO1xuICAgICAgICBpZiAodGhpcy5ob3VyRm9ybWF0ID09PSBcIjI0XCIpIHtcbiAgICAgICAgICAgIG5ld0hvdXIgPSB0aGlzLmhvdXIgJSAyNDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0hvdXIgPSB0aGlzLmhvdXIgJSAxMjtcbiAgICAgICAgICAgIGlmICh0aGlzLm1lcmlkaWVtID09PSBcIlBNXCIpIHtcbiAgICAgICAgICAgICAgICBuZXdIb3VyICs9IDEyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubmF2aWdhdGVkRGF0ZSA9IERhdGVUaW1lLmZyb21KU0RhdGUodGhpcy5uYXZpZ2F0ZWREYXRlKS5zZXQoeyBob3VyOiBuZXdIb3VyIH0pLnRvSlNEYXRlKCk7XG4gICAgICAgIGlmICh0aGlzLmhvdXJGb3JtYXQgPT09IFwiMTJcIikge1xuICAgICAgICAgICAgdGhpcy5ob3VyID0gbmV3SG91ciAlIDEyIHx8IDEyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudERhdGUodGhpcy5uYXZpZ2F0ZWREYXRlKTtcbiAgICAgICAgdGhpcy5zY3JvbGxMaXN0KHRoaXMuaG91cnNMaXN0RWxlbWVudC5uYXRpdmVFbGVtZW50LCBuZXdIb3VyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25NZXJpZGllbUNsaWNrKG1lcmlkaWVtOiBcIkFNXCIgfCBcIlBNXCIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZG9ubHkgJiYgdGhpcy5tZXJpZGllbSA9PT0gbWVyaWRpZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRlID0gRGF0ZVRpbWUubm93KCkudG9KU0RhdGUoKTtcbiAgICAgICAgdGhpcy5tZXJpZGllbSA9IG1lcmlkaWVtO1xuICAgICAgICB0aGlzLm5hdmlnYXRlZERhdGUgPSBEYXRlVGltZS5mcm9tSlNEYXRlKHRoaXMubmF2aWdhdGVkRGF0ZSA/PyBkYXRlKVxuICAgICAgICAgICAgLnNldCh7IGhvdXI6ICh0aGlzLm5hdmlnYXRlZERhdGUgPz8gZGF0ZSkuZ2V0SG91cnMoKSArIChtZXJpZGllbSA9PT0gXCJBTVwiID8gLTEyIDogMTIpIH0pXG4gICAgICAgICAgICAudG9KU0RhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVIb3VyKCk7XG4gICAgICAgIHRoaXMudXBkYXRlTWludXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU2Vjb25kKCk7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudERhdGUodGhpcy5uYXZpZ2F0ZWREYXRlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25NaW51dGVDaGFuZ2UodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLm1pbnV0ZSA9IHZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMubmF2aWdhdGVkRGF0ZSkge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gdGhpcy5ob3VyICE9IG51bGwgPyBEYXRlVGltZS5ub3coKS5zZXQoeyBob3VyOiB0aGlzLmhvdXIgfSkgOiBEYXRlVGltZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGVkRGF0ZSA9IG5vdy50b0pTRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1pbnV0ZSA9ICt0aGlzLm1pbnV0ZSA+IDU5ID8gMCA6ICt0aGlzLm1pbnV0ZSA8IDAgPyA1OSA6ICt0aGlzLm1pbnV0ZTtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZWREYXRlID0gRGF0ZVRpbWUuZnJvbUpTRGF0ZSh0aGlzLm5hdmlnYXRlZERhdGUpLnNldCh7IG1pbnV0ZSB9KS50b0pTRGF0ZSgpO1xuICAgICAgICB0aGlzLm1pbnV0ZSA9IG1pbnV0ZTtcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RGF0ZSh0aGlzLm5hdmlnYXRlZERhdGUpO1xuICAgICAgICB0aGlzLnNjcm9sbExpc3QodGhpcy5taW51dGVzTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgbWludXRlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25TZWNvbmRDaGFuZ2UodmFsdWU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnNlY29uZCA9IHZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMubmF2aWdhdGVkRGF0ZSkge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gdGhpcy5ob3VyICE9IG51bGwgPyBEYXRlVGltZS5ub3coKS5zZXQoeyBob3VyOiB0aGlzLmhvdXIgfSkgOiBEYXRlVGltZS5ub3coKTtcbiAgICAgICAgICAgIHRoaXMubmF2aWdhdGVkRGF0ZSA9IG5vdy50b0pTRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlY29uZCA9ICt0aGlzLnNlY29uZCA+IDU5ID8gMCA6ICt0aGlzLnNlY29uZCA8IDAgPyA1OSA6ICt0aGlzLnNlY29uZDtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZWREYXRlID0gRGF0ZVRpbWUuZnJvbUpTRGF0ZSh0aGlzLm5hdmlnYXRlZERhdGUpLnNldCh7IHNlY29uZCB9KS50b0pTRGF0ZSgpO1xuICAgICAgICB0aGlzLnNlY29uZCA9IHNlY29uZDtcbiAgICAgICAgdGhpcy5zY3JvbGxMaXN0KHRoaXMuc2Vjb25kc0xpc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHNlY29uZCk7XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudERhdGUodGhpcy5uYXZpZ2F0ZWREYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNjcm9sbExpc3QobGlzdDogSFRNTE9MaXN0RWxlbWVudCwgdmFsdWU/OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3RlZEVsZW1lbnQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3IoXCIubW9uYS1zZWxlY3RlZFwiKSBhcyBIVE1MT0xpc3RFbGVtZW50O1xuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRFbGVtZW50LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwiYXV0b1wiLCBibG9jazogXCJjZW50ZXJcIiB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXZhbHVlPVwiJHt2YWx1ZX1cIl1gKSBhcyBIVE1MT0xpc3RFbGVtZW50O1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwiYXV0b1wiLCBibG9jazogXCJjZW50ZXJcIiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlSG91cigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmF2aWdhdGVkRGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5ob3VyID1cbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJGb3JtYXQgPT09IFwiMTJcIiA/IHRoaXMubmF2aWdhdGVkRGF0ZS5nZXRIb3VycygpICUgMTIgfHwgMTIgOiB0aGlzLm5hdmlnYXRlZERhdGUuZ2V0SG91cnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTWludXRlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5uYXZpZ2F0ZWREYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm1pbnV0ZSA9IHRoaXMubmF2aWdhdGVkRGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNlY29uZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubmF2aWdhdGVkRGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5zZWNvbmQgPSB0aGlzLm5hdmlnYXRlZERhdGUuZ2V0U2Vjb25kcygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIm1vbmEtdGltZS1zZWxlY3RvclwiIFtuZ0NsYXNzXT1cInsnbW9uYS1kaXNhYmxlZCc6IGRpc2FibGVkfVwiICNwb3B1cEFuY2hvcj5cbiAgICA8b2wgI2hvdXJzTGlzdEVsZW1lbnQ+XG4gICAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaCBvZiBob3Vyc1wiIFtuZ0NsYXNzXT1cInsnbW9uYS1zZWxlY3RlZCc6aD09PWhvdXJ9XCIgKGNsaWNrKT1cIm9uSG91ckNoYW5nZShoKVwiIFthdHRyLmRhdGEtdmFsdWVdPVwiaFwiPnt7aCB8IG51bWJlcjonMi4wJ319PC9saT5cbiAgICA8L29sPlxuICAgIDxvbCAjbWludXRlc0xpc3RFbGVtZW50PlxuICAgICAgICA8bGkgKm5nRm9yPVwibGV0IG0gb2YgbWludXRlc1wiIFtuZ0NsYXNzXT1cInsnbW9uYS1zZWxlY3RlZCc6bT09PW1pbnV0ZX1cIiAoY2xpY2spPVwib25NaW51dGVDaGFuZ2UobSlcIiAgW2F0dHIuZGF0YS12YWx1ZV09XCJtXCI+e3ttIHwgbnVtYmVyOicyLjAnfX08L2xpPlxuICAgIDwvb2w+XG4gICAgPG9sICNzZWNvbmRzTGlzdEVsZW1lbnQgKm5nSWY9XCJzaG93U2Vjb25kc1wiPlxuICAgICAgICA8bGkgKm5nRm9yPVwibGV0IHMgb2Ygc2Vjb25kc1wiIFtuZ0NsYXNzXT1cInsnbW9uYS1zZWxlY3RlZCc6cz09PXNlY29uZH1cIiAoY2xpY2spPVwib25TZWNvbmRDaGFuZ2UocylcIiBbYXR0ci5kYXRhLXZhbHVlXT1cInNcIj57e3MgfCBudW1iZXI6JzIuMCd9fTwvbGk+XG4gICAgPC9vbD5cbiAgICA8b2wgKm5nSWY9XCJob3VyRm9ybWF0PT09JzEyJ1wiPlxuICAgICAgICA8bGkgW25nQ2xhc3NdPVwieydtb25hLXNlbGVjdGVkJzogbWVyaWRpZW09PT0nQU0nfVwiIChjbGljayk9XCJvbk1lcmlkaWVtQ2xpY2soJ0FNJylcIj5BTTwvbGk+XG4gICAgICAgIDxsaSBbbmdDbGFzc109XCJ7J21vbmEtc2VsZWN0ZWQnOiBtZXJpZGllbT09PSdQTSd9XCIgKGNsaWNrKT1cIm9uTWVyaWRpZW1DbGljaygnUE0nKVwiPlBNPC9saT5cbiAgICA8L29sPlxuPC9kaXY+XG4iXX0=