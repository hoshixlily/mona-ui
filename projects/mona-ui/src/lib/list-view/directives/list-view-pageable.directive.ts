import { Directive, Input } from "@angular/core";
import { ListViewComponent } from "../components/list-view/list-view.component";
import { PagerSettings } from "../models/PagerSettings";

@Directive({
    selector: "mona-list-view[monaListViewPageable]",
    standalone: true
})
export class ListViewPageableDirective {
    readonly #defaultOptions: PagerSettings = {
        enabled: true,
        info: false,
        firstLast: false,
        type: "numeric",
        previousNext: true,
        pageSizeValues: [5, 10, 20, 25, 50, 100],
        visiblePages: 5
    };

    @Input("monaListViewPageable")
    public set options(value: Partial<PagerSettings> | "") {
        if (value === "") {
            this.host.setPagerSettings(this.#defaultOptions);
        } else {
            this.host.setPagerSettings({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly host: ListViewComponent) {}
}
