import { DestroyRef, Directive, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Selector } from "@mirei/ts-collections";
import { SelectableOptions } from "../models/SelectableOptions";
import { TreeService } from "../services/tree.service";

@Directive({
    selector: "mona-tree[monaTreeSelectable]",
    standalone: true
})
export class TreeSelectableDirective<T> implements OnInit {
    readonly #defaultOptions: SelectableOptions = {
        childrenOnly: false,
        enabled: true,
        mode: "single"
    };
    readonly #destroyRef: DestroyRef = inject(DestroyRef);

    @Input("monaTreeSelectable")
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
        this.treeService.nodeSelectChange$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
            this.treeService.selectedKeysChange.emit(this.treeService.selectedKeys().toArray());
        });
    }
}
