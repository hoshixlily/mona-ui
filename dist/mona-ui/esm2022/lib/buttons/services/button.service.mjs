import { Injectable } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";
import { v4 } from "uuid";
import * as i0 from "@angular/core";
export class ButtonService {
    static { this.ID = v4(); }
    constructor() {
        this.buttonClick$ = new ReplaySubject(1);
        this.buttonSelect$ = new Subject();
        this.buttonSelected$ = new Subject();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9tb25hLXVpL3NyYy9saWIvYnV0dG9ucy9zZXJ2aWNlcy9idXR0b24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7O0FBRzFCLE1BQU0sT0FBTyxhQUFhO2FBQ0MsT0FBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBSWpDO1FBSGdCLGlCQUFZLEdBQW1DLElBQUksYUFBYSxDQUFrQixDQUFDLENBQUMsQ0FBQztRQUNyRixrQkFBYSxHQUF3QyxJQUFJLE9BQU8sRUFBOEIsQ0FBQztRQUMvRixvQkFBZSxHQUE2QixJQUFJLE9BQU8sRUFBbUIsQ0FBQztJQUNyRSxDQUFDOzhHQUxkLGFBQWE7a0hBQWIsYUFBYTs7MkZBQWIsYUFBYTtrQkFEekIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgQnV0dG9uRGlyZWN0aXZlIH0gZnJvbSBcIi4uL21vZHVsZXMvYnV0dG9uL2RpcmVjdGl2ZXMvYnV0dG9uLmRpcmVjdGl2ZVwiO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCwgU3ViamVjdCB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyB2NCB9IGZyb20gXCJ1dWlkXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBCdXR0b25TZXJ2aWNlIHtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IElEID0gdjQoKTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgYnV0dG9uQ2xpY2skOiBSZXBsYXlTdWJqZWN0PEJ1dHRvbkRpcmVjdGl2ZT4gPSBuZXcgUmVwbGF5U3ViamVjdDxCdXR0b25EaXJlY3RpdmU+KDEpO1xuICAgIHB1YmxpYyByZWFkb25seSBidXR0b25TZWxlY3QkOiBTdWJqZWN0PFtCdXR0b25EaXJlY3RpdmUsIGJvb2xlYW5dPiA9IG5ldyBTdWJqZWN0PFtCdXR0b25EaXJlY3RpdmUsIGJvb2xlYW5dPigpO1xuICAgIHB1YmxpYyByZWFkb25seSBidXR0b25TZWxlY3RlZCQ6IFN1YmplY3Q8QnV0dG9uRGlyZWN0aXZlPiA9IG5ldyBTdWJqZWN0PEJ1dHRvbkRpcmVjdGl2ZT4oKTtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7fVxufVxuIl19