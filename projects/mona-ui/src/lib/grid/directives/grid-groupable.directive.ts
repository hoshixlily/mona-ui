import { DestroyRef, Directive, effect, inject, input, OnInit, output, untracked } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { orderBy, sequenceEqual } from "@mirei/ts-collections";
import { filter, map, pairwise, startWith } from "rxjs";
import { GroupableOptions } from "../models/GroupableOptions";
import { GroupDescriptor } from "../models/GroupDescriptor";
import { GridService } from "../services/grid.service";

@Directive({
    selector: "mona-grid[monaGridGroupable]",
    standalone: true
})
export class GridGroupableDirective implements OnInit {
    readonly #destroyRef = inject(DestroyRef);
    readonly #gridService = inject(GridService);
    readonly #groupColumnsChange$ = toObservable(this.#gridService.groupColumns).pipe(
        takeUntilDestroyed(this.#destroyRef),
        startWith(this.#gridService.groupColumns()),
        pairwise(),
        filter(([prev, curr]) => {
            return !sequenceEqual(
                orderBy(prev, c => c.field()),
                orderBy(curr, c => c.field())
            );
        }),
        map(([_, curr]) => {
            return this.#gridService.getGroupDescriptors(curr);
        })
    );
    readonly #sortStatusChange$ = toObservable(this.#gridService.appliedSorts).pipe(
        takeUntilDestroyed(this.#destroyRef),
        startWith(this.#gridService.appliedSorts()),
        map(sorts => sorts.values()),
        map(s => s.select(sort => sort.sort)),
        pairwise(),
        filter(([prev, curr]) => {
            const changedFields = curr
                .except(prev, (a, b) => a.field === b.field && a.dir === b.dir)
                .select(s => s.field);
            const groupFields = this.#gridService.groupColumns().select(c => c.field());
            return groupFields.any(f => changedFields.contains(f));
        })
    );
    public readonly groupChange = output<GroupDescriptor[]>();
    public group = input<Iterable<GroupDescriptor>>([]);
    public options = input<GroupableOptions | "" | undefined>(undefined, {
        alias: "monaGridGroupable"
    });

    public constructor() {
        effect(() => {
            const options = this.options();
            untracked(() => {
                if (options) {
                    this.#gridService.setGroupableOptions(options);
                } else if (options === "") {
                    this.#gridService.setGroupableOptions({ enabled: true });
                }
            });
        });
        effect(() => {
            const group = this.group();
            untracked(() => {
                this.#gridService.loadGroupColumns(group);
            });
        });
    }

    public ngOnInit(): void {
        this.setSubscriptions();
    }

    private setSubscriptions(): void {
        this.#groupColumnsChange$.subscribe(groupDescriptors => {
            this.groupChange.emit(groupDescriptors);
        });
        this.#sortStatusChange$.subscribe(() => {
            const groupDescriptors = this.#gridService.getGroupDescriptors(this.#gridService.groupColumns());
            this.groupChange.emit(groupDescriptors);
        });
    }
}
