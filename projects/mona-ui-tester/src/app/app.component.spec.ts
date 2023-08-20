import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MonaUiModule, SlicePipe, WindowService } from "mona-ui";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
    let spectator: Spectator<AppComponent>;
    const createComponent = createComponentFactory({
        component: AppComponent,
        imports: [RouterTestingModule, MonaUiModule, SlicePipe, FontAwesomeTestingModule, FormsModule],
        providers: [WindowService]
    });

    beforeEach(() => (spectator = createComponent()));

    it("should create the app", () => {
        expect(spectator.component).toBeTruthy();
    });
});
