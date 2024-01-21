import { DestroyRef, Directive, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
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

    @Input()
    public set checkBy(value: string | Selector<T, any> | null | undefined) {
        this.treeService.setCheckBy(value ?? "");
    }

    @Input()
    public set checkedKeys(value: Iterable<any> | null | undefined) {
        this.treeService.setCheckedKeys(value ?? []);
    }

    @Output()
    public checkedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Input("monaTreeViewCheckable")
    public set options(value: Partial<CheckableOptions> | "") {
        if (value === "") {
            this.treeService.setCheckableOptions(this.#defaultOptions);
        } else {
            this.treeService.setCheckableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.treeService.checkedKeysChange = this.checkedKeysChange;
        this.setNodeCheckSubscription();
    }

    private setNodeCheckSubscription(): void {
        this.treeService.checkedKeys$
            .pipe(pairwise(), takeUntilDestroyed(this.#destroyRef))
            .subscribe(([oldKeys, keys]) => {
                const orderedOldKeys = oldKeys.orderBy(k => k);
                const orderedKeys = keys.orderBy(k => k);
                if (sequenceEqual(orderedOldKeys, orderedKeys)) {
                    return;
                }
                this.treeService.checkedKeysChange.emit(keys.toArray());
            });
    }
}
