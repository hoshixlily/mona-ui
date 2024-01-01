import { EventEmitter, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ImmutableSet } from "@mirei/ts-collections";
import { debounceTime, distinctUntilChanged, ReplaySubject } from "rxjs";
import { FilterChangeEvent } from "../../../common/filter-input/models/FilterChangeEvent";
import { ExpandableOptions } from "../../../tree-view/models/ExpandableOptions";
import { FilterableOptions } from "../../../tree-view/models/FilterableOptions";

@Injectable()
export class DropDownTreeService {
    public expandableOptions: Required<ExpandableOptions> = {
        enabled: false
    };
    public readonly filterableOptions: Required<FilterableOptions> = {
        caseSensitive: false,
        debounce: 0,
        enabled: false,
        operator: "contains"
    };
    public readonly filter$: ReplaySubject<string> = new ReplaySubject<string>(1);
    public readonly filterPlaceholder: WritableSignal<string> = signal("");
    public readonly filterText: Signal<string> = toSignal(
        this.filter$.pipe(debounceTime(this.filterableOptions.debounce), distinctUntilChanged()),
        {
            initialValue: ""
        }
    );

    public expandedKeys: WritableSignal<ImmutableSet<unknown>> = signal(ImmutableSet.create());
    public expandedKeysChange: EventEmitter<unknown[]> = new EventEmitter<unknown[]>();
    public filterChange: EventEmitter<FilterChangeEvent> = new EventEmitter<FilterChangeEvent>();

    public constructor() {}

    public loadExpandedKeys(expandedKeys: Iterable<unknown>): void {
        this.expandedKeys.update(set => set.clear().addAll(expandedKeys));
    }

    public setExpandableOptions(options: ExpandableOptions): void {
        Object.assign(this.expandableOptions, options);
    }

    public setFilterableOptions(options: FilterableOptions): void {
        Object.assign(this.filterableOptions, options);
    }
}
