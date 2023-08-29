import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Subject } from "rxjs";
import { ProgressBarComponent } from "../../../progress-bars/progress-bar/components/progress-bar/progress-bar.component";
import { NotificationData } from "../../models/NotificationData";
import { NotificationComponent } from "./notification.component";

describe("NotificationComponent", () => {
    let component: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;
    let notificationData: NotificationData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NotificationComponent, ProgressBarComponent, BrowserAnimationsModule]
        });
        fixture = TestBed.createComponent(NotificationComponent);
        component = fixture.componentInstance;
        notificationData = {
            componentDestroy$: new Subject<string>(),
            options: {},
            visible: true
        };
        component.data = notificationData;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
