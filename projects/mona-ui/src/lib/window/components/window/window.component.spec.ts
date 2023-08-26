import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { WindowService } from "../../services/window.service";
import { WindowComponent } from "./window.component";

describe("WindowComponent", () => {
    let component: WindowComponent;
    let fixture: ComponentFixture<WindowComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [WindowComponent, BrowserAnimationsModule],
            providers: [WindowService]
        });
        fixture = TestBed.createComponent(WindowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
