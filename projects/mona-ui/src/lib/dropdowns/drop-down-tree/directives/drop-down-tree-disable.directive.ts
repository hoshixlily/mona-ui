import { Directive, effect, inject, input, untracked } from "@angular/core";
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
    readonly #treeService: TreeService<T> = inject(TreeService);

    public disableBy = input<string | Selector<T, any> | null | undefined>();
    public disabledKeys = input<Iterable<any>>();
    public options = input<Partial<DisableOptions> | "">("", {
        alias: "monaDropDownTreeDisable"
    });

    public constructor() {
        effect(() => {
            const disableBy = this.disableBy() ?? "";
            untracked(() => this.#treeService.setDisableBy(disableBy));
        });
        effect(() => {
            const disabledKeys = this.disabledKeys() ?? [];
            untracked(() => this.#treeService.setDisabledKeys(disabledKeys));
        });
        effect(() => {
            const options = this.options() ?? "";
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
