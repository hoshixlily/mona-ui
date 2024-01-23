import { CommonModule } from "@angular/common";
import {
    Component,
    computed,
    ContentChild,
    DestroyRef,
    ElementRef,
    forwardRef,
    HostBinding,
    inject,
    Input,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Selector } from "@mirei/ts-collections";
import { distinctUntilChanged, Observable, take } from "rxjs";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { FilterInputComponent } from "../../../../common/filter-input/components/filter-input/filter-input.component";
import { FilterChangeEvent } from "../../../../common/filter-input/models/FilterChangeEvent";
import { TreeComponent } from "../../../../common/tree/components/tree/tree.component";
import { TreeNodeTemplateDirective } from "../../../../common/tree/directives/tree-node-template.directive";
import { SelectableOptions } from "../../../../common/tree/models/SelectableOptions";
import { TreeNode } from "../../../../common/tree/models/TreeNode";
import { TreeService } from "../../../../common/tree/services/tree.service";
import { PlaceholderComponent } from "../../../../layout/placeholder/placeholder.component";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { PopupService } from "../../../../popup/services/popup.service";
import { TreeViewComponent } from "../../../../tree-view/components/tree-view/tree-view.component";
import { TreeViewDisableDirective } from "../../../../tree-view/directives/tree-view-disable.directive";
import { TreeViewExpandableDirective } from "../../../../tree-view/directives/tree-view-expandable.directive";
import { TreeViewFilterableDirective } from "../../../../tree-view/directives/tree-view-filterable.directive";
import { TreeViewSelectableDirective } from "../../../../tree-view/directives/tree-view-selectable.directive";
import { Action } from "../../../../utils/Action";
import { DropDownListFooterTemplateDirective } from "../../../drop-down-list/directives/drop-down-list-footer-template.directive";
import { DropDownListHeaderTemplateDirective } from "../../../drop-down-list/directives/drop-down-list-header-template.directive";
import { DropDownListNoDataTemplateDirective } from "../../../drop-down-list/directives/drop-down-list-no-data-template.directive";
import { DropDownService } from "../../../services/drop-down.service";
import { DropDownTreeFooterTemplateDirective } from "../../directives/drop-down-tree-footer-template.directive";
import { DropDownTreeHeaderTemplateDirective } from "../../directives/drop-down-tree-header-template.directive";
import { DropDownTreeNoDataTemplateDirective } from "../../directives/drop-down-tree-no-data-template.directive";
import { DropDownTreeNodeTemplateDirective } from "../../directives/drop-down-tree-node-template.directive";
import { DropDownTreeService } from "../../services/drop-down-tree.service";

@Component({
    selector: "mona-drop-down-tree",
    standalone: true,
    imports: [
        CommonModule,
        ButtonDirective,
        FaIconComponent,
        TreeViewComponent,
        TreeViewDisableDirective,
        TreeViewSelectableDirective,
        TreeViewFilterableDirective,
        TreeViewExpandableDirective,
        TreeComponent,
        FilterInputComponent,
        TreeNodeTemplateDirective,
        PlaceholderComponent
    ],
    templateUrl: "./drop-down-tree.component.html",
    styleUrl: "./drop-down-tree.component.scss",
    providers: [
        TreeService,
        DropDownTreeService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropDownTreeComponent),
            multi: true
        }
    ]
})
export class DropDownTreeComponent<T> implements ControlValueAccessor, OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #selectedNode: Signal<TreeNode<T> | null> = computed(() => {
        return this.treeService.selectedNodes().firstOrDefault();
    });
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<any> | null = null;
    #value: WritableSignal<any | null> = signal(null);

    protected readonly selectableOptions: SelectableOptions = {
        enabled: true,
        mode: "single",
        toggleable: false,
        childrenOnly: false
    };
    protected readonly text: Signal<string> = computed(() => {
        const node = this.#selectedNode();
        if (!node) {
            return "";
        }
        return this.treeService.getNodeText(node);
    });
    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public set children(value: string | Selector<T, Iterable<T> | Observable<Iterable<T>>>) {
        this.treeService.setChildrenSelector(value);
    }

    @Input()
    public set data(value: Iterable<T>) {
        this.treeService.setData(value);
    }

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @ContentChild(DropDownTreeFooterTemplateDirective, { read: TemplateRef })
    public footerTemplate: TemplateRef<any> | null = null;

    @ContentChild(DropDownTreeHeaderTemplateDirective, { read: TemplateRef })
    public headerTemplate: TemplateRef<any> | null = null;

    @ContentChild(DropDownTreeNoDataTemplateDirective, { read: TemplateRef })
    public noDataTemplate: TemplateRef<any> | null = null;

    @ContentChild(DropDownTreeNodeTemplateDirective, { read: TemplateRef })
    public nodeTemplate: TemplateRef<any> | null = null;

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<any>;

    @Input()
    public set textField(value: string | null | undefined) {
        this.treeService.setTextField(value ?? "");
    }

    @Input()
    public set valueField(valueField: string | null | undefined) {
        this.treeService.setSelectBy(valueField ?? null);
    }

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService,
        protected readonly treeService: TreeService<T>
    ) {}

    public close(): void {
        this.#popupRef?.close();
    }

    public ngOnInit(): void {
        this.treeService.setSelectableOptions(this.selectableOptions);
        this.setSubscriptions();
    }

    public onFilterChange(event: FilterChangeEvent): void {
        this.treeService.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.treeService.filter$.next(event.filter);
        }
    }

    public open(): void {
        this.dropdownWrapper.nativeElement.focus();
        if (this.#popupRef) {
            this.#popupRef.close();
        }
        this.#popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: false,
            withPush: false,
            width: this.elementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content", "mona-dropdown-tree-popup-content"],
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.#popupRef);
        this.popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Show);
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.#popupRef = null;
            (this.elementRef.nativeElement.firstElementChild as HTMLElement)?.focus();
        });
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public writeValue(obj: any | null) {
        this.#value.set(obj);
        if (obj != null) {
            this.treeService.setSelectedDataItems([obj]);
        }
    }

    private setSubscriptions(): void {
        this.treeService.selectedKeys$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => this.close());
        this.treeService.selectionChange$
            .pipe(
                distinctUntilChanged((n1, n2) => n1.data === n2.data),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe(node => {
                this.#value.set(node.data);
                this.#propagateChange?.(this.#value());
            });
    }
}
