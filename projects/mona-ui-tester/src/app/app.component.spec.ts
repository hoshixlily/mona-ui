import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { WindowService } from "mona-ui";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
    let spectator: Spectator<AppComponent>;
    const createComponent = createComponentFactory({
        component: AppComponent,
        imports: [RouterTestingModule],
        providers: [WindowService]
    });

    beforeEach(() => (spectator = createComponent()));

    it("should create the app", () => {
        expect(spectator.component).toBeTruthy();
    });

    // beforeEach(async () => {
    //     await TestBed.configureTestingModule({
    //         imports: [RouterTestingModule],
    //         declarations: [AppComponent]
    //     }).compileComponents();
    // });
    //
    // it("should create the app", () => {
    //     const fixture = TestBed.createComponent(AppComponent);
    //     const app = fixture.componentInstance;
    //     expect(app).toBeTruthy();
    // });
});
