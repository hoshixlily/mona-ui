import { Injectable } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../../../../popup/services/popup.service";
export class ContextMenuService {
    constructor(popupService) {
        this.popupService = popupService;
        this.defaultSubMenuPositions = [
            {
                originX: "end",
                originY: "top",
                overlayX: "start",
                overlayY: "top"
            },
            {
                originX: "start",
                originY: "top",
                overlayX: "end",
                overlayY: "top"
            },
            {
                originX: "end",
                originY: "bottom",
                overlayX: "start",
                overlayY: "bottom"
            },
            {
                originX: "start",
                originY: "bottom",
                overlayX: "end",
                overlayY: "bottom"
            }
        ];
    }
    open(settings) {
        return this.popupService.create({
            ...settings,
            hasBackdrop: false
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuService, deps: [{ token: i1.PopupService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuService, providedIn: "root" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root"
                }]
        }], ctorParameters: function () { return [{ type: i1.PopupService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC1tZW51LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvbWVudXMvbW9kdWxlcy9jb250ZXh0LW1lbnUvc2VydmljZXMvY29udGV4dC1tZW51LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBUzNDLE1BQU0sT0FBTyxrQkFBa0I7SUE0QjNCLFlBQW1DLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBM0I3Qyw0QkFBdUIsR0FBd0I7WUFDM0Q7Z0JBQ0ksT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRSxLQUFLO2FBQ2xCO1lBQ0Q7Z0JBQ0ksT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFFBQVEsRUFBRSxLQUFLO2FBQ2xCO1lBQ0Q7Z0JBQ0ksT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLFFBQVE7Z0JBQ2pCLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixRQUFRLEVBQUUsUUFBUTthQUNyQjtZQUNEO2dCQUNJLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixPQUFPLEVBQUUsUUFBUTtnQkFDakIsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsUUFBUSxFQUFFLFFBQVE7YUFDckI7U0FDSixDQUFDO0lBRThELENBQUM7SUFFMUQsSUFBSSxDQUFDLFFBQTZCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDNUIsR0FBRyxRQUFRO1lBQ1gsV0FBVyxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs4R0FuQ1Esa0JBQWtCO2tIQUFsQixrQkFBa0IsY0FGZixNQUFNOzsyRkFFVCxrQkFBa0I7a0JBSDlCLFVBQVU7bUJBQUM7b0JBQ1IsVUFBVSxFQUFFLE1BQU07aUJBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBQb3B1cFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vLi4vLi4vcG9wdXAvc2VydmljZXMvcG9wdXAuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29udGV4dE1lbnVTZXR0aW5ncyB9IGZyb20gXCIuLi9tb2RlbHMvQ29udGV4dE1lbnVTZXR0aW5nc1wiO1xuaW1wb3J0IHsgUG9wdXBSZWYgfSBmcm9tIFwiLi4vLi4vLi4vLi4vcG9wdXAvbW9kZWxzL1BvcHVwUmVmXCI7XG5pbXBvcnQgeyBDb25uZWN0ZWRQb3NpdGlvbiB9IGZyb20gXCJAYW5ndWxhci9jZGsvb3ZlcmxheVwiO1xuXG5ASW5qZWN0YWJsZSh7XG4gICAgcHJvdmlkZWRJbjogXCJyb290XCJcbn0pXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVTZXJ2aWNlIHtcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdFN1Yk1lbnVQb3NpdGlvbnM6IENvbm5lY3RlZFBvc2l0aW9uW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9yaWdpblg6IFwiZW5kXCIsXG4gICAgICAgICAgICBvcmlnaW5ZOiBcInRvcFwiLFxuICAgICAgICAgICAgb3ZlcmxheVg6IFwic3RhcnRcIixcbiAgICAgICAgICAgIG92ZXJsYXlZOiBcInRvcFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9yaWdpblg6IFwic3RhcnRcIixcbiAgICAgICAgICAgIG9yaWdpblk6IFwidG9wXCIsXG4gICAgICAgICAgICBvdmVybGF5WDogXCJlbmRcIixcbiAgICAgICAgICAgIG92ZXJsYXlZOiBcInRvcFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9yaWdpblg6IFwiZW5kXCIsXG4gICAgICAgICAgICBvcmlnaW5ZOiBcImJvdHRvbVwiLFxuICAgICAgICAgICAgb3ZlcmxheVg6IFwic3RhcnRcIixcbiAgICAgICAgICAgIG92ZXJsYXlZOiBcImJvdHRvbVwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG9yaWdpblg6IFwic3RhcnRcIixcbiAgICAgICAgICAgIG9yaWdpblk6IFwiYm90dG9tXCIsXG4gICAgICAgICAgICBvdmVybGF5WDogXCJlbmRcIixcbiAgICAgICAgICAgIG92ZXJsYXlZOiBcImJvdHRvbVwiXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBwb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZSkge31cblxuICAgIHB1YmxpYyBvcGVuKHNldHRpbmdzOiBDb250ZXh0TWVudVNldHRpbmdzKTogUG9wdXBSZWYge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3B1cFNlcnZpY2UuY3JlYXRlKHtcbiAgICAgICAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgICAgICAgaGFzQmFja2Ryb3A6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==