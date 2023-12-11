import { EventEmitter, Injectable, signal, WritableSignal } from "@angular/core";
import { ImmutableSet } from "@mirei/ts-collections";
import { ExpandableOptions } from "../../../tree-view/models/ExpandableOptions";

@Injectable()
export class DropDownTreeService {
    public expandableOptions: ExpandableOptions = {
        enabled: false
    };
    public expandedKeys: WritableSignal<ImmutableSet<string>> = signal(ImmutableSet.create());
    public expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();

    public constructor() {}

    public loadExpandedKeys(expandedKeys: Iterable<string>): void {
        this.expandedKeys.update(set => set.clear().addAll(expandedKeys));
    }

    public setExpandableOptions(options: ExpandableOptions): void {
        this.expandableOptions = { ...this.expandableOptions, ...options };
    }
}
