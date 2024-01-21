import { DestroyRef, Directive, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Selector, sequenceEqual } from "@mirei/ts-collections";
import { distinctUntilChanged, pairwise } from "rxjs";
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

    @Input("monaTreeViewSelectable")
    public set options(value: Partial<SelectableOptions> | "") {
        if (value === "") {
            this.treeService.setSelectableOptions(this.#defaultOptions);
        } else {
            this.treeService.setSelectableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    @Input()
    public set selectBy(value: string | Selector<T, any> | null | undefined) {
        this.treeService.setSelectBy(value ?? "");
    }

    @Input()
    public set selectedKeys(value: Iterable<any> | null | undefined) {
        this.treeService.setSelectedKeys(value ?? []);
    }

    @Output()
    public selectedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    public constructor(private readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.treeService.selectedKeysChange = this.selectedKeysChange;
        this.setNodeSelectSubscription();
    }

    private setNodeSelectSubscription(): void {
        this.treeService.selectedKeys$
            .pipe(pairwise(), takeUntilDestroyed(this.#destroyRef))
            .subscribe(([oldKeys, keys]) => {
                const orderedOldKeys = oldKeys.orderBy(k => k);
                const orderedKeys = keys.orderBy(k => k);
                if (sequenceEqual(orderedOldKeys, orderedKeys)) {
                    return;
                }
                this.treeService.selectedKeysChange.emit(keys.toArray());
            });
    }
}
