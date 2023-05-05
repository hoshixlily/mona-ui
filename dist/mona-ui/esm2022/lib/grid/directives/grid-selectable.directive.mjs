import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "../components/grid/grid.component";
import * as i2 from "../services/grid.service";
export class GridSelectableDirective {
    #destroy$;
    set selectedKeys(selectedKeys) {
        this.gridService.selectedKeys.clear();
        this.gridService.selectedKeys.addAll(selectedKeys);
    }
    set selectionKey(selectionKey) {
        this.gridService.selectionKeyField = selectionKey;
    }
    constructor(grid, gridService) {
        this.grid = grid;
        this.gridService = gridService;
        this.#destroy$ = new Subject();
        this.selectedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.gridService.loadSelectedKeys(this.gridService.selectedKeys);
        }
    }
    ngOnDestroy() {
        this.#destroy$.next();
        this.#destroy$.complete();
    }
    ngOnInit() {
        this.gridService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.gridService.setSelectableOptions(this.options);
        }
        else if (this.options === "") {
            this.gridService.setSelectableOptions({ enabled: true });
        }
        this.gridService.loadSelectedKeys(this.gridService.selectedKeys);
        this.setSubscriptions();
    }
    setSubscriptions() {
        this.gridService.selectedRowsChange$.pipe(takeUntil(this.#destroy$)).subscribe(selectedRows => {
            const selectedKeys = selectedRows.map(r => this.gridService.selectionKeyField ? r.data[this.gridService.selectionKeyField] : r.data);
            this.gridService.selectedKeys.clear();
            this.gridService.selectedKeys.addAll(selectedKeys);
            this.gridService.selectedKeysChange.next(selectedKeys);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridSelectableDirective, deps: [{ token: i1.GridComponent }, { token: i2.GridService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: GridSelectableDirective, selector: "mona-grid[monaGridSelectable]", inputs: { selectedKeys: "selectedKeys", selectionKey: "selectionKey", options: ["monaGridSelectable", "options"] }, outputs: { selectedKeysChange: "selectedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridSelectableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-grid[monaGridSelectable]"
                }]
        }], ctorParameters: function () { return [{ type: i1.GridComponent }, { type: i2.GridService }]; }, propDecorators: { selectedKeys: [{
                type: Input
            }], selectedKeysChange: [{
                type: Output
            }], selectionKey: [{
                type: Input
            }], options: [{
                type: Input,
                args: ["monaGridSelectable"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1zZWxlY3RhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL21vbmEtdWkvc3JjL2xpYi9ncmlkL2RpcmVjdGl2ZXMvZ3JpZC1zZWxlY3RhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQWdDLE1BQU0sRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFJcEgsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7QUFLMUMsTUFBTSxPQUFPLHVCQUF1QjtJQUN2QixTQUFTLENBQXNDO0lBQ3hELElBQ1csWUFBWSxDQUFDLFlBQStCO1FBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBS0QsSUFDVyxZQUFZLENBQUMsWUFBb0I7UUFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsR0FBRyxZQUFZLENBQUM7SUFDdEQsQ0FBQztJQUtELFlBQW9DLElBQW1CLEVBQW1CLFdBQXdCO1FBQTlELFNBQUksR0FBSixJQUFJLENBQWU7UUFBbUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFsQnpGLGNBQVMsR0FBa0IsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQVFqRCx1QkFBa0IsR0FBNEIsSUFBSSxZQUFZLEVBQWEsQ0FBQztJQVVrQixDQUFDO0lBRS9GLFdBQVcsQ0FBQyxPQUFzQjtRQUNyQyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDaEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3BFO0lBQ0wsQ0FBQztJQUVNLFdBQVc7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVNLFFBQVE7UUFDWCxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztRQUM5RCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2RDthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzVEO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFTyxnQkFBZ0I7UUFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUMxRixNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUMzRixDQUFDO1lBQ0YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs4R0FwRFEsdUJBQXVCO2tHQUF2Qix1QkFBdUI7OzJGQUF2Qix1QkFBdUI7a0JBSG5DLFNBQVM7bUJBQUM7b0JBQ1AsUUFBUSxFQUFFLCtCQUErQjtpQkFDNUM7OEhBSWMsWUFBWTtzQkFEdEIsS0FBSztnQkFPQyxrQkFBa0I7c0JBRHhCLE1BQU07Z0JBSUksWUFBWTtzQkFEdEIsS0FBSztnQkFNQyxPQUFPO3NCQURiLEtBQUs7dUJBQUMsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgU2VsZWN0YWJsZU9wdGlvbnMgfSBmcm9tIFwiLi4vbW9kZWxzL1NlbGVjdGFibGVPcHRpb25zXCI7XG5pbXBvcnQgeyBHcmlkQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvZ3JpZC9ncmlkLmNvbXBvbmVudFwiO1xuaW1wb3J0IHsgR3JpZFNlcnZpY2UgfSBmcm9tIFwiLi4vc2VydmljZXMvZ3JpZC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCJtb25hLWdyaWRbbW9uYUdyaWRTZWxlY3RhYmxlXVwiXG59KVxuZXhwb3J0IGNsYXNzIEdyaWRTZWxlY3RhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gICAgcmVhZG9ubHkgI2Rlc3Ryb3kkOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgICBASW5wdXQoKVxuICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWRLZXlzKHNlbGVjdGVkS2V5czogSXRlcmFibGU8dW5rbm93bj4pIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5zZWxlY3RlZEtleXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5zZWxlY3RlZEtleXMuYWRkQWxsKHNlbGVjdGVkS2V5cyk7XG4gICAgfVxuXG4gICAgQE91dHB1dCgpXG4gICAgcHVibGljIHNlbGVjdGVkS2V5c0NoYW5nZTogRXZlbnRFbWl0dGVyPHVua25vd25bXT4gPSBuZXcgRXZlbnRFbWl0dGVyPHVua25vd25bXT4oKTtcblxuICAgIEBJbnB1dCgpXG4gICAgcHVibGljIHNldCBzZWxlY3Rpb25LZXkoc2VsZWN0aW9uS2V5OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5zZWxlY3Rpb25LZXlGaWVsZCA9IHNlbGVjdGlvbktleTtcbiAgICB9XG5cbiAgICBASW5wdXQoXCJtb25hR3JpZFNlbGVjdGFibGVcIilcbiAgICBwdWJsaWMgb3B0aW9ucz86IFNlbGVjdGFibGVPcHRpb25zIHwgXCJcIjtcblxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGdyaWQ6IEdyaWRDb21wb25lbnQsIHByaXZhdGUgcmVhZG9ubHkgZ3JpZFNlcnZpY2U6IEdyaWRTZXJ2aWNlKSB7fVxuXG4gICAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNoYW5nZXMgJiYgY2hhbmdlc1tcInNlbGVjdGVkS2V5c1wiXSAmJiAhY2hhbmdlc1tcInNlbGVjdGVkS2V5c1wiXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubG9hZFNlbGVjdGVkS2V5cyh0aGlzLmdyaWRTZXJ2aWNlLnNlbGVjdGVkS2V5cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuI2Rlc3Ryb3kkLm5leHQoKTtcbiAgICAgICAgdGhpcy4jZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2Uuc2VsZWN0ZWRLZXlzQ2hhbmdlID0gdGhpcy5zZWxlY3RlZEtleXNDaGFuZ2U7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFNlcnZpY2Uuc2V0U2VsZWN0YWJsZU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFNlcnZpY2Uuc2V0U2VsZWN0YWJsZU9wdGlvbnMoeyBlbmFibGVkOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JpZFNlcnZpY2UubG9hZFNlbGVjdGVkS2V5cyh0aGlzLmdyaWRTZXJ2aWNlLnNlbGVjdGVkS2V5cyk7XG4gICAgICAgIHRoaXMuc2V0U3Vic2NyaXB0aW9ucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0U3Vic2NyaXB0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ncmlkU2VydmljZS5zZWxlY3RlZFJvd3NDaGFuZ2UkLnBpcGUodGFrZVVudGlsKHRoaXMuI2Rlc3Ryb3kkKSkuc3Vic2NyaWJlKHNlbGVjdGVkUm93cyA9PiB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEtleXMgPSBzZWxlY3RlZFJvd3MubWFwKHIgPT5cbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRTZXJ2aWNlLnNlbGVjdGlvbktleUZpZWxkID8gci5kYXRhW3RoaXMuZ3JpZFNlcnZpY2Uuc2VsZWN0aW9uS2V5RmllbGRdIDogci5kYXRhXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5ncmlkU2VydmljZS5zZWxlY3RlZEtleXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMuZ3JpZFNlcnZpY2Uuc2VsZWN0ZWRLZXlzLmFkZEFsbChzZWxlY3RlZEtleXMpO1xuICAgICAgICAgICAgdGhpcy5ncmlkU2VydmljZS5zZWxlY3RlZEtleXNDaGFuZ2UubmV4dChzZWxlY3RlZEtleXMpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4iXX0=