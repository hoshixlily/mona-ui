import { Directive, effect, inject, input, OnInit, output, untracked } from "@angular/core";
import { ExpandableOptions } from "../../common/tree/models/ExpandableOptions";
import { NodeKeySelector } from "../../common/tree/models/TreeSelectors";
import { TreeService } from "../../common/tree/services/tree.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewExpandable]",
    standalone: true
})
export class TreeViewExpandableDirective<T, K = T> implements OnInit {
    readonly #defaultOptions: ExpandableOptions = {
        enabled: true
    };
    readonly #treeService: TreeService<T> = inject(TreeService);

    public readonly expandedKeysChange = output<Array<K>>();

    public expandBy = input<NodeKeySelector<T, K> | undefined>("");
    public expandedKeys = input<Iterable<K>>([]);
    public options = input<Partial<ExpandableOptions> | "">("", {
        alias: "monaTreeViewExpandable"
    });

    public constructor() {
        effect(() => {
            const expandBy = this.expandBy();
            untracked(() => {
                this.#treeService.setExpandBy(expandBy ?? "");
            });
        });
        effect(() => {
            const expandedKeys = this.expandedKeys();
            untracked(() => {
                this.#treeService.setExpandedKeys(expandedKeys ?? []);
            });
        });
        effect(() => {
            const options = this.options();
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
