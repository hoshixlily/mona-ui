import { DestroyRef, Directive, effect, inject, input, OnInit, output, untracked } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { any, orderBy, sequenceEqual } from "@mirei/ts-collections";
import { filter, map, pairwise, skip, startWith } from "rxjs";
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
                prev,
                curr,
                (p, n) => p.field() === n.field() && p.groupSortDirection() === n.groupSortDirection()
            );
        }),
        map(([_, curr]) => {
            return this.#gridService.getGroupDescriptors(curr);
        })
    );
    readonly #groupSortChange$ = toObservable(this.#gridService.appliedGroupSorts).pipe(
        takeUntilDestroyed(this.#destroyRef),
        startWith(this.#gridService.appliedGroupSorts()),
        pairwise(),
        filter(([prev, curr]) => {
            if (prev.length !== curr.length) {
                return false; // Different number of sorts, not handled by this subscription
            }
            return (
                !sequenceEqual(
                    orderBy(prev, p => p.value.sort.field),
                    orderBy(curr, p => p.value.sort.field)
                ) ||
                !sequenceEqual(
                    orderBy(prev, p => p.value.sort.dir),
                    orderBy(curr, p => p.value.sort.dir)
                )
            );
        }),
        map(() => {
            const groupColumns = this.#gridService.groupColumns();
            return this.#gridService.getGroupDescriptors(groupColumns);
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
        this.#groupColumnsChange$
            .pipe(skip(any(this.group()) ? 1 : 0), takeUntilDestroyed(this.#destroyRef))
            .subscribe(groupDescriptors => {
                this.groupChange.emit(groupDescriptors);
            });
        this.#groupSortChange$.subscribe(groupDescriptors => {
            this.groupChange.emit(groupDescriptors);
        });
    }
}
