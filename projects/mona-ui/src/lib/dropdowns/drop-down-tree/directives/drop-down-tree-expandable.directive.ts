import { Directive, effect, inject, input, OnInit, output, untracked } from "@angular/core";
import { Selector } from "@mirei/ts-collections";
import { ExpandableOptions } from "../../../common/tree/models/ExpandableOptions";
import { TreeService } from "../../../common/tree/services/tree.service";

@Directive({
    selector: "mona-drop-down-tree[monaDropDownTreeExpandable]",
    standalone: true
})
export class DropDownTreeExpandableDirective<T> implements OnInit {
    readonly #defaultOptions: ExpandableOptions = {
        enabled: true
    };
    readonly #treeService: TreeService<T> = inject(TreeService);

    public readonly expandedKeysChange = output<unknown[]>();

    public expandBy = input<string | Selector<T, any> | null | undefined>();
    public expandedKeys = input<Iterable<unknown>>();
    public options = input<Partial<ExpandableOptions> | "">("", {
        alias: "monaDropDownTreeExpandable"
    });

    public constructor() {
        effect(() => {
            const expandBy = this.expandBy() ?? "";
            untracked(() => this.#treeService.setExpandBy(expandBy));
        });
        effect(() => {
            const expandedKeys = this.expandedKeys() ?? [];
            untracked(() => this.#treeService.setExpandedKeys(expandedKeys));
        });
        effect(() => {
            const options = this.options() ?? "";
            untracked(() => {
                if (options === "") {
                    this.#treeService.setExpandableOptions(this.#defaultOptions);
                } else {
                    this.#treeService.setExpandableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#treeService.expandedKeysChange = this.expandedKeysChange;
        this.#treeService.setNodeExpandSubscription();
    }
}
