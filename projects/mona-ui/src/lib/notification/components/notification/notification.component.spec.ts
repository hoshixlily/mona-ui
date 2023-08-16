import { FontAwesomeTestingModule } from "@fortawesome/angular-fontawesome/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { Subject } from "rxjs";
import { ProgressBarModule } from "../../../progress-bars/modules/progress-bar/progress-bar.module";

import { NotificationComponent } from "./notification.component";

describe("NotificationComponent", () => {
    let spectator: Spectator<NotificationComponent>;
    const createComponent = createComponentFactory({
        component: NotificationComponent,
        imports: [ProgressBarModule, FontAwesomeTestingModule]
    });

    beforeEach(() => {
        spectator = createComponent({
            props: {
                data: {
                    componentDestroy$: new Subject<string>(),
                    visible: true,
                    options: {}
                }
            }
        });
    });

    it("should create", () => {
        expect(spectator.component).toBeDefined();
    });
});
