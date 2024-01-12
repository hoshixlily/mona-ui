import { DestroyRef, Directive, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Selector } from "@mirei/ts-collections";
import { CheckableOptions } from "../models/CheckableOptions";
import { TreeService } from "../services/tree.service";

@Directive({
    selector: "[monaTreeCheckable]",
    standalone: true
})
export class TreeCheckableDirective<T> implements OnInit {
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

    @Input("monaTreeCheckable")
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
        this.treeService.nodeCheckChange$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
            this.treeService.checkedKeysChange.emit(this.treeService.checkedKeys().toArray());
        });
    }
}
