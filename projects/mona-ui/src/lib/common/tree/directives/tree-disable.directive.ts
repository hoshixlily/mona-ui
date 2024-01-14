import { Directive, Input } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { DisableOptions } from "../models/DisableOptions";
import { TreeService } from "../services/tree.service";

@Directive({
    selector: "mona-tree[monaTreeDisable]",
    standalone: true
})
export class TreeDisableDirective<T> {
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

    @Input("monaTreeDisable")
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
