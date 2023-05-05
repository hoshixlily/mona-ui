import { Directive, EventEmitter, Host, HostBinding, Input, Optional, Output } from "@angular/core";
import { fromEvent, Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "../../../services/button.service";
export class ButtonDirective {
    #selected;
    set selected(selected) {
        this.#selected = selected;
        this.buttonService?.buttonSelected$.next(this);
    }
    get selected() {
        return this.#selected;
    }
    constructor(buttonService, elementRef) {
        this.buttonService = buttonService;
        this.elementRef = elementRef;
        this.#selected = false;
        this.destroy$ = new Subject();
        this.disabled = false;
        this.flat = false;
        this.primary = false;
        this.selectedChange = new EventEmitter();
        this.toggleable = false;
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngOnInit() {
        if (this.toggleable) {
            fromEvent(this.elementRef.nativeElement, "click")
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                if (this.buttonService) {
                    this.buttonService.buttonClick$.next(this);
                }
                else {
                    this.selected = !this.selected;
                    this.selectedChange.emit(this.selected);
                }
            });
        }
        this.buttonService?.buttonSelect$.pipe(takeUntil(this.destroy$)).subscribe(result => {
            const [button, selected] = result;
            if (button === this) {
                this.#selected = selected;
                this.selectedChange.emit(selected);
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonDirective, deps: [{ token: i1.ButtonService, host: true, optional: true }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ButtonDirective, selector: "[monaButton]", inputs: { disabled: "disabled", flat: "flat", primary: "primary", selected: "selected", toggleable: "toggleable" }, outputs: { selectedChange: "selectedChange" }, host: { properties: { "class.mona-disabled": "this.disabled", "class.mona-flat": "this.flat", "class.mona-primary": "this.primary", "class.mona-selected": "this.selected" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaButton]"
                }]
        }], ctorParameters: function () { return [{ type: i1.ButtonService, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i0.ElementRef }]; }, propDecorators: { disabled: [{
                type: HostBinding,
                args: ["class.mona-disabled"]
            }, {
                type: Input
            }], flat: [{
                type: HostBinding,
                args: ["class.mona-flat"]
            }, {
                type: Input
            }], primary: [{
                type: HostBinding,
                args: ["class.mona-primary"]
            }, {
                type: Input
            }], selected: [{
                type: HostBinding,
                args: ["class.mona-selected"]
            }, {
                type: Input
            }], selectedChange: [{
                type: Output
            }], toggleable: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9idXR0b25zL21vZHVsZXMvYnV0dG9uL2RpcmVjdGl2ZXMvYnV0dG9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0gsU0FBUyxFQUVULFlBQVksRUFDWixJQUFJLEVBQ0osV0FBVyxFQUNYLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7O0FBTXJELE1BQU0sT0FBTyxlQUFlO0lBQ3hCLFNBQVMsQ0FBa0I7SUFlM0IsSUFFVyxRQUFRLENBQUMsUUFBaUI7UUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxJQUFXLFFBQVE7UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQVFELFlBQ3lDLGFBQTRCLEVBQ2pELFVBQXlDO1FBRHBCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQ2pELGVBQVUsR0FBVixVQUFVLENBQStCO1FBbEM3RCxjQUFTLEdBQVksS0FBSyxDQUFDO1FBQ1YsYUFBUSxHQUFrQixJQUFJLE9BQU8sRUFBUSxDQUFDO1FBSXhELGFBQVEsR0FBWSxLQUFLLENBQUM7UUFJMUIsU0FBSSxHQUFZLEtBQUssQ0FBQztRQUl0QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBY3pCLG1CQUFjLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFHcEUsZUFBVSxHQUFZLEtBQUssQ0FBQztJQUtoQyxDQUFDO0lBRUcsV0FBVztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQixTQUFTLENBQWEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO2lCQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDOUIsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDOUM7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDM0M7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNWO1FBQ0QsSUFBSSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDaEYsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDbEMsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO2dCQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDdEM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7OEdBL0RRLGVBQWU7a0dBQWYsZUFBZTs7MkZBQWYsZUFBZTtrQkFIM0IsU0FBUzttQkFBQztvQkFDUCxRQUFRLEVBQUUsY0FBYztpQkFDM0I7OzBCQW1DUSxJQUFJOzswQkFBSSxRQUFRO3FFQTVCZCxRQUFRO3NCQUZkLFdBQVc7dUJBQUMscUJBQXFCOztzQkFDakMsS0FBSztnQkFLQyxJQUFJO3NCQUZWLFdBQVc7dUJBQUMsaUJBQWlCOztzQkFDN0IsS0FBSztnQkFLQyxPQUFPO3NCQUZiLFdBQVc7dUJBQUMsb0JBQW9COztzQkFDaEMsS0FBSztnQkFLSyxRQUFRO3NCQUZsQixXQUFXO3VCQUFDLHFCQUFxQjs7c0JBQ2pDLEtBQUs7Z0JBV0MsY0FBYztzQkFEcEIsTUFBTTtnQkFJQSxVQUFVO3NCQURoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBEaXJlY3RpdmUsXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgSG9zdCxcbiAgICBIb3N0QmluZGluZyxcbiAgICBJbnB1dCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgT25Jbml0LFxuICAgIE9wdGlvbmFsLFxuICAgIE91dHB1dFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHsgQnV0dG9uU2VydmljZSB9IGZyb20gXCIuLi8uLi8uLi9zZXJ2aWNlcy9idXR0b24uc2VydmljZVwiO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJbbW9uYUJ1dHRvbl1cIlxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25EaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gICAgI3NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95JDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgICBASG9zdEJpbmRpbmcoXCJjbGFzcy5tb25hLWRpc2FibGVkXCIpXG4gICAgQElucHV0KClcbiAgICBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBIb3N0QmluZGluZyhcImNsYXNzLm1vbmEtZmxhdFwiKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIGZsYXQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBIb3N0QmluZGluZyhcImNsYXNzLm1vbmEtcHJpbWFyeVwiKVxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHByaW1hcnk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBIb3N0QmluZGluZyhcImNsYXNzLm1vbmEtc2VsZWN0ZWRcIilcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWQoc2VsZWN0ZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy4jc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgICAgdGhpcy5idXR0b25TZXJ2aWNlPy5idXR0b25TZWxlY3RlZCQubmV4dCh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy4jc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGVkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyB0b2dnbGVhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSByZWFkb25seSBidXR0b25TZXJ2aWNlOiBCdXR0b25TZXJ2aWNlLFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MQnV0dG9uRWxlbWVudD5cbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgICAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50b2dnbGVhYmxlKSB7XG4gICAgICAgICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIFwiY2xpY2tcIilcbiAgICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1dHRvblNlcnZpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9uU2VydmljZS5idXR0b25DbGljayQubmV4dCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSAhdGhpcy5zZWxlY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRDaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnV0dG9uU2VydmljZT8uYnV0dG9uU2VsZWN0JC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBbYnV0dG9uLCBzZWxlY3RlZF0gPSByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoYnV0dG9uID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4jc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=