import {
    DestroyRef,
    Directive,
    effect,
    inject,
    input,
    OnInit,
    output,
    OutputEmitterRef,
    untracked
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Selector, sequenceEqual } from "@mirei/ts-collections";
import { distinctUntilChanged, pairwise } from "rxjs";
import { NodeItem } from "../../common/tree/models/NodeItem";
import { SelectableOptions } from "../../common/tree/models/SelectableOptions";
import { TreeService } from "../../common/tree/services/tree.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewSelectable]",
    standalone: true
})
export class TreeViewSelectableDirective<T> implements OnInit {
    readonly #defaultOptions: SelectableOptions = {
        childrenOnly: false,
        enabled: true,
        mode: "single",
        toggleable: false
    };
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #treeService: TreeService<T> = inject(TreeService);

    public readonly selectedKeysChange: OutputEmitterRef<Array<any>> = output();
    public readonly selectionChange: OutputEmitterRef<NodeItem<T>> = output();

    public selectBy = input<string | Selector<T, any> | null | undefined>("");
    public selectedKeys = input<Iterable<any>>([]);
    public options = input<Partial<SelectableOptions> | "">("", {
        alias: "monaTreeViewSelectable"
    });

    public constructor() {
        effect(() => {
            const selectBy = this.selectBy();
            untracked(() => this.#treeService.setSelectBy(selectBy ?? ""));
        });
        effect(() => {
            const selectedKeys = this.selectedKeys();
            untracked(() => this.#treeService.setSelectedKeys(selectedKeys ?? []));
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#treeService.setSelectableOptions(this.#defaultOptions);
                } else {
                    this.#treeService.setSelectableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#treeService.selectionChange = this.selectionChange;
        this.setNodeSelectSubscription();
    }

    private setNodeSelectSubscription(): void {
        this.#treeService.selectedKeys$
            .pipe(pairwise(), takeUntilDestroyed(this.#destroyRef))
            .subscribe(([oldKeys, keys]) => {
                const orderedOldKeys = oldKeys.orderBy(k => k);
                const orderedKeys = keys.orderBy(k => k);
                if (sequenceEqual(orderedOldKeys, orderedKeys)) {
                    return;
                }
                this.selectedKeysChange.emit(keys.toArray());
            });
        this.#treeService.selectionChange$
            .pipe(
                distinctUntilChanged((n1, n2) => n1.data === n2.data),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe(nodeItem => {
                this.#treeService.selectionChange.emit(nodeItem);
            });
    }
}
