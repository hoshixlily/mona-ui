import { Directive, effect, inject, input, untracked } from "@angular/core";
import { DisableOptions } from "../../common/tree/models/DisableOptions";
import { NodeKeySelector } from "../../common/tree/models/TreeSelectors";
import { TreeService } from "../../common/tree/services/tree.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewDisable]",
    standalone: true
})
export class TreeViewDisableDirective<T> {
    readonly #defaultOptions: DisableOptions = {
        disableChildren: true,
        enabled: true
    };
    readonly #treeService: TreeService<T> = inject(TreeService);

    public disableBy = input<NodeKeySelector<T> | undefined>("");
    public disabledKeys = input<Iterable<any>>([]);
    public options = input<Partial<DisableOptions> | "">("", {
        alias: "monaTreeViewDisable"
    });

    public constructor() {
        effect(() => {
            const disableBy = this.disableBy();
            untracked(() => {
                this.#treeService.setDisableBy(disableBy ?? "");
            });
        });
        effect(() => {
            const disabledKeys = this.disabledKeys();
            untracked(() => {
                this.#treeService.setDisabledKeys(disabledKeys ?? []);
            });
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#treeService.setDisableOptions(this.#defaultOptions);
                } else {
                    this.#treeService.setDisableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }
}
