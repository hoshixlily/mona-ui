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
import { pairwise } from "rxjs";
import { CheckableOptions } from "../../common/tree/models/CheckableOptions";
import { TreeService } from "../../common/tree/services/tree.service";

@Directive({
    selector: "mona-tree-view[monaTreeViewCheckable]",
    standalone: true
})
export class TreeViewCheckableDirective<T> implements OnInit {
    readonly #defaultOptions: CheckableOptions = {
        checkChildren: true,
        checkParents: true,
        enabled: true,
        mode: "multiple"
    };
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #treeService: TreeService<T> = inject(TreeService);

    public readonly checkedKeysChange: OutputEmitterRef<Array<any>> = output();

    public checkBy = input<string | Selector<T, any> | null | undefined>("");
    public checkedKeys = input<Iterable<any>>([]);
    public options = input<Partial<CheckableOptions> | "">("", {
        alias: "monaTreeViewCheckable"
    });

    public constructor() {
        effect(() => {
            const checkBy = this.checkBy();
            untracked(() => {
                this.#treeService.setCheckBy(checkBy ?? "");
            });
        });
        effect(() => {
            const checkedKeys = this.checkedKeys();
            untracked(() => {
                this.#treeService.setCheckedKeys(checkedKeys ?? []);
            });
        });
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options === "") {
                    this.#treeService.setCheckableOptions(this.#defaultOptions);
                } else {
                    this.#treeService.setCheckableOptions({
                        ...this.#defaultOptions,
                        ...options
                    });
                }
            });
        });
    }

    public ngOnInit(): void {
        this.#treeService.checkedKeysChange = this.checkedKeysChange;
        this.setNodeCheckSubscription();
    }

    private setNodeCheckSubscription(): void {
        this.#treeService.checkedKeys$
            .pipe(pairwise(), takeUntilDestroyed(this.#destroyRef))
            .subscribe(([oldKeys, keys]) => {
                const orderedOldKeys = oldKeys.orderBy(k => k);
                const orderedKeys = keys.orderBy(k => k);
                if (sequenceEqual(orderedOldKeys, orderedKeys)) {
                    return;
                }
                this.#treeService.checkedKeysChange.emit(keys.toArray());
            });
    }
}
