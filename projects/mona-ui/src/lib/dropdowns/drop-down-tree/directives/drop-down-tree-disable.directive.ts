import { Directive, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { DisableOptions } from "../../../common/tree/models/DisableOptions";
import { TreeService } from "../../../common/tree/services/tree.service";

@Directive({
    selector: "mona-drop-down-tree[monaDropDownTreeDisable]",
    standalone: true
})
export class DropDownTreeDisableDirective<T> {
    readonly #defaultOptions: DisableOptions = {
        disableChildren: true,
        enabled: true
    };

    @Input()
    public set disableBy(value: string | Selector<T, any> | null | undefined) {
        this.treeService.setDisableBy(value ?? "");
    }

    @Input()
    public set disabledKeys(value: Iterable<any> | null | undefined) {
        this.treeService.setDisabledKeys(value ?? []);
    }

    @Input("monaDropDownTreeDisable")
    public set options(value: Partial<DisableOptions> | "") {
        if (value === "") {
            this.treeService.setDisableOptions(this.#defaultOptions);
        } else {
            this.treeService.setDisableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly treeService: TreeService<T>) {}
}
