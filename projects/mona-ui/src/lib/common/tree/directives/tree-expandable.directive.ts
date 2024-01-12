import { DestroyRef, Directive, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Selector, sequenceEqual } from "@mirei/ts-collections";
import { pairwise } from "rxjs";
import { ExpandableOptions } from "../models/ExpandableOptions";
import { TreeService } from "../services/tree.service";

@Directive({
    selector: "mona-tree[monaTreeExpandable]",
    standalone: true
})
export class TreeExpandableDirective<T> implements OnInit {
    readonly #defaultOptions: ExpandableOptions = {
        enabled: true
    };
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    @Input()
    public set expandBy(value: string | Selector<T, any> | null | undefined) {
        this.treeService.setExpandBy(value ?? "");
    }

    @Input()
    public set expandedKeys(value: Iterable<any> | null | undefined) {
        this.treeService.setExpandedKeys(value ?? []);
    }

    @Output()
    public expandedKeysChange: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Input("monaTreeExpandable")
    public set options(value: Partial<ExpandableOptions> | "") {
        if (value === "") {
            this.treeService.setExpandableOptions(this.#defaultOptions);
        } else {
            this.treeService.setExpandableOptions({
                ...this.#defaultOptions,
                ...value
            });
        }
    }

    public constructor(private readonly treeService: TreeService<T>) {}

    public ngOnInit(): void {
        this.treeService.expandedKeysChange = this.expandedKeysChange;
        this.setNodeExpandSubscription();
    }

    private setNodeExpandSubscription(): void {
        this.treeService.expandedKeys$
            .pipe(pairwise(), takeUntilDestroyed(this.#destroyRef))
            .subscribe(([oldKeys, keys]) => {
                const orderedOldKeys = oldKeys.orderBy(k => k);
                const orderedKeys = keys.orderBy(k => k);
                if (sequenceEqual(orderedOldKeys, orderedKeys)) {
                    return;
                }
                this.treeService.expandedKeysChange.emit(keys.toArray());
            });
    }
}
