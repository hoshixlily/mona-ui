import { Component, ContentChildren, Input, QueryList } from "@angular/core";
import { ButtonDirective } from "../../../button/directives/button.directive";
import { ButtonService } from "../../../../services/button.service";
import { Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "../../../../services/button.service";
export class ButtonGroupComponent {
    #disabled;
    set disabled(disabled) {
        this.#disabled = disabled;
        this.notifyDisableStateChanged();
    }
    get disabled() {
        return this.#disabled;
    }
    set selection(selection) {
        this.selectionMode = selection;
    }
    constructor(buttonService) {
        this.buttonService = buttonService;
        this.#disabled = false;
        this.componentDestroy$ = new Subject();
        this.selectionMode = "multiple";
        this.buttons = new QueryList();
    }
    ngAfterContentInit() {
        this.notifyDisableStateChanged();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.notifySelectionStateChange();
    }
    notifyDisableStateChanged() {
        this.buttons.forEach(b => (b.disabled = this.#disabled));
    }
    notifySelectionStateChange() {
        this.buttonService.buttonClick$.pipe(takeUntil(this.componentDestroy$)).subscribe(button => {
            if (this.selectionMode === "single") {
                this.buttons.forEach(b => {
                    this.buttonService.buttonSelect$.next([b, b === button ? !b.selected : false]);
                });
            }
            else {
                this.buttonService.buttonSelect$.next([button, !button.selected]);
            }
        });
        this.buttonService.buttonSelected$.pipe(takeUntil(this.componentDestroy$)).subscribe(button => {
            if (this.selectionMode === "single") {
                if (button.selected) {
                    this.buttons.forEach(b => {
                        if (b !== button) {
                            this.buttonService.buttonSelect$.next([b, false]);
                        }
                    });
                }
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupComponent, deps: [{ token: i1.ButtonService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ButtonGroupComponent, selector: "mona-button-group", inputs: { disabled: "disabled", selection: "selection" }, providers: [ButtonService], queries: [{ propertyName: "buttons", predicate: ButtonDirective }], ngImport: i0, template: "<div class=\"mona-button-group\">\n    <ng-content select=\"button[monaButton]\"></ng-content>\n</div>\n", styles: ["div.mona-button-group{display:flex}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-button-group", providers: [ButtonService], template: "<div class=\"mona-button-group\">\n    <ng-content select=\"button[monaButton]\"></ng-content>\n</div>\n", styles: ["div.mona-button-group{display:flex}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.ButtonService }]; }, propDecorators: { buttons: [{
                type: ContentChildren,
                args: [ButtonDirective]
            }], disabled: [{
                type: Input
            }], selection: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLWdyb3VwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9idXR0b25zL21vZHVsZXMvYnV0dG9uLWdyb3VwL2NvbXBvbmVudHMvYnV0dG9uLWdyb3VwL2J1dHRvbi1ncm91cC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvYnV0dG9ucy9tb2R1bGVzL2J1dHRvbi1ncm91cC9jb21wb25lbnRzL2J1dHRvbi1ncm91cC9idXR0b24tZ3JvdXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFvQixTQUFTLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBcUIsU0FBUyxFQUFRLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2Q0FBNkMsQ0FBQztBQUU5RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFDcEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7OztBQVExQyxNQUFNLE9BQU8sb0JBQW9CO0lBQzdCLFNBQVMsQ0FBa0I7SUFPM0IsSUFDVyxRQUFRLENBQUMsUUFBaUI7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7SUFDckMsQ0FBQztJQUNELElBQVcsUUFBUTtRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFDVyxTQUFTLENBQUMsU0FBd0I7UUFDekMsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7SUFDbkMsQ0FBQztJQUVELFlBQW9DLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBckJoRSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ1Ysc0JBQWlCLEdBQWtCLElBQUksT0FBTyxFQUFRLENBQUM7UUFDaEUsa0JBQWEsR0FBa0IsVUFBVSxDQUFDO1FBRzFDLFlBQU8sR0FBK0IsSUFBSSxTQUFTLEVBQW1CLENBQUM7SUFnQlosQ0FBQztJQUU3RCxrQkFBa0I7UUFDckIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVNLFdBQVc7UUFDZCxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFFTSxRQUFRO1FBQ1gsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVPLHlCQUF5QjtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sMEJBQTBCO1FBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkYsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFFBQVEsRUFBRTtnQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ25GLENBQUMsQ0FBQyxDQUFDO2FBQ047aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDckU7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDMUYsSUFBSSxJQUFJLENBQUMsYUFBYSxLQUFLLFFBQVEsRUFBRTtnQkFDakMsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFO29CQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDckIsSUFBSSxDQUFDLEtBQUssTUFBTSxFQUFFOzRCQUNkLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3lCQUNyRDtvQkFDTCxDQUFDLENBQUMsQ0FBQztpQkFDTjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDOzhHQTlEUSxvQkFBb0I7a0dBQXBCLG9CQUFvQixzR0FGbEIsQ0FBQyxhQUFhLENBQUMsa0RBT1QsZUFBZSw2QkNqQnBDLDBHQUdBOzsyRkRTYSxvQkFBb0I7a0JBTmhDLFNBQVM7K0JBQ0ksbUJBQW1CLGFBR2xCLENBQUMsYUFBYSxDQUFDO29HQVFsQixPQUFPO3NCQURkLGVBQWU7dUJBQUMsZUFBZTtnQkFJckIsUUFBUTtzQkFEbEIsS0FBSztnQkFVSyxTQUFTO3NCQURuQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUXVlcnlMaXN0LCBTZWxmIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEJ1dHRvbkRpcmVjdGl2ZSB9IGZyb20gXCIuLi8uLi8uLi9idXR0b24vZGlyZWN0aXZlcy9idXR0b24uZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25Nb2RlIH0gZnJvbSBcIi4uLy4uLy4uLy4uLy4uL21vZGVscy9TZWxlY3Rpb25Nb2RlXCI7XG5pbXBvcnQgeyBCdXR0b25TZXJ2aWNlIH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZpY2VzL2J1dHRvbi5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogXCJtb25hLWJ1dHRvbi1ncm91cFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vYnV0dG9uLWdyb3VwLmNvbXBvbmVudC5odG1sXCIsXG4gICAgc3R5bGVVcmxzOiBbXCIuL2J1dHRvbi1ncm91cC5jb21wb25lbnQuc2Nzc1wiXSxcbiAgICBwcm92aWRlcnM6IFtCdXR0b25TZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25Hcm91cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICAjZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudERlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBwcml2YXRlIHNlbGVjdGlvbk1vZGU6IFNlbGVjdGlvbk1vZGUgPSBcIm11bHRpcGxlXCI7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKEJ1dHRvbkRpcmVjdGl2ZSlcbiAgICBwcml2YXRlIGJ1dHRvbnM6IFF1ZXJ5TGlzdDxCdXR0b25EaXJlY3RpdmU+ID0gbmV3IFF1ZXJ5TGlzdDxCdXR0b25EaXJlY3RpdmU+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgZGlzYWJsZWQoZGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy4jZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgICAgdGhpcy5ub3RpZnlEaXNhYmxlU3RhdGVDaGFuZ2VkKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLiNkaXNhYmxlZDtcbiAgICB9XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgc2VsZWN0aW9uKHNlbGVjdGlvbjogU2VsZWN0aW9uTW9kZSkge1xuICAgICAgICB0aGlzLnNlbGVjdGlvbk1vZGUgPSBzZWxlY3Rpb247XG4gICAgfVxuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYnV0dG9uU2VydmljZTogQnV0dG9uU2VydmljZSkge31cblxuICAgIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubm90aWZ5RGlzYWJsZVN0YXRlQ2hhbmdlZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnREZXN0cm95JC5uZXh0KCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50RGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubm90aWZ5U2VsZWN0aW9uU3RhdGVDaGFuZ2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG5vdGlmeURpc2FibGVTdGF0ZUNoYW5nZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGIgPT4gKGIuZGlzYWJsZWQgPSB0aGlzLiNkaXNhYmxlZCkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbm90aWZ5U2VsZWN0aW9uU3RhdGVDaGFuZ2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25DbGljayQucGlwZSh0YWtlVW50aWwodGhpcy5jb21wb25lbnREZXN0cm95JCkpLnN1YnNjcmliZShidXR0b24gPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gXCJzaW5nbGVcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvblNlcnZpY2UuYnV0dG9uU2VsZWN0JC5uZXh0KFtiLCBiID09PSBidXR0b24gPyAhYi5zZWxlY3RlZCA6IGZhbHNlXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25TZWxlY3QkLm5leHQoW2J1dHRvbiwgIWJ1dHRvbi5zZWxlY3RlZF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5idXR0b25TZXJ2aWNlLmJ1dHRvblNlbGVjdGVkJC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbXBvbmVudERlc3Ryb3kkKSkuc3Vic2NyaWJlKGJ1dHRvbiA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25Nb2RlID09PSBcInNpbmdsZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJ1dHRvbi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChiID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChiICE9PSBidXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvblNlcnZpY2UuYnV0dG9uU2VsZWN0JC5uZXh0KFtiLCBmYWxzZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtb25hLWJ1dHRvbi1ncm91cFwiPlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImJ1dHRvblttb25hQnV0dG9uXVwiPjwvbmctY29udGVudD5cbjwvZGl2PlxuIl19