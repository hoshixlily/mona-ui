import { CommonModule } from "@angular/common";
import {
    Component,
    computed,
    contentChild,
    DestroyRef,
    effect,
    ElementRef,
    forwardRef,
    inject,
    Injector,
    input,
    model,
    OnInit,
    Signal,
    signal,
    TemplateRef,
    untracked,
    viewChild,
    WritableSignal
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Selector } from "@mirei/ts-collections";
import { distinctUntilChanged, fromEvent, Observable, take } from "rxjs";
import { v4 } from "uuid";
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
    ],
    host: {
        "[class.mona-disabled]": "disabled()",
        "[class.mona-dropdown]": "true",
        "[class.mona-dropdown-tree]": "true",
        "[attr.tabindex]": "disabled() ? null : 0"
    }
})
export class DropDownTreeComponent<T> implements ControlValueAccessor, OnInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    readonly #injector: Injector = inject(Injector);
    readonly #popupAnimationService: PopupAnimationService = inject(PopupAnimationService);
    readonly #popupService: PopupService = inject(PopupService);
    readonly #popupUidClass: string = `mona-dropdown-popup-${v4()}`;
    readonly #selectedNode: Signal<TreeNode<T> | null> = computed(() => {
        return this.treeService.selectedNodes().firstOrDefault();
    });
    #popupRef: PopupRef | null = null;
    #propagateChange: Action<any> | null = null;
    #value: WritableSignal<any | null> = signal(null);
    protected readonly clearIcon: IconDefinition = faTimes;
    protected readonly dropdownIcon: IconDefinition = faChevronDown;
    protected readonly footerTemplate = contentChild(DropDownTreeFooterTemplateDirective, { read: TemplateRef });
    protected readonly headerTemplate = contentChild(DropDownTreeHeaderTemplateDirective, { read: TemplateRef });
    protected readonly noDataTemplate = contentChild(DropDownTreeNoDataTemplateDirective, { read: TemplateRef });
    protected readonly nodeTemplate = contentChild(DropDownTreeNodeTemplateDirective, { read: TemplateRef });
    protected readonly popupTemplate: Signal<TemplateRef<any>> = viewChild.required("popupTemplate");
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
    protected readonly treeService: TreeService<T> = inject(TreeService);

    public children = input<string | Selector<T, Iterable<T> | Observable<Iterable<T>>>>("");
    public data = input<Iterable<T>>([]);
    public disabled = model(false);
    public textField = input<string | null | undefined>("");
    public valueField = input<string | null | undefined>(null);

    public constructor() {
        effect(() => {
            const textField = this.textField() ?? "";
            untracked(() => this.treeService.setTextField(textField));
        });
        effect(() => {
            const valueField = this.valueField() ?? null;
            untracked(() => this.treeService.setSelectBy(valueField));
        });
        effect(() => {
            const children = this.children() ?? "";
            untracked(() => this.treeService.setChildrenSelector(children));
        });
        effect(() => {
            const data = this.data() ?? [];
            untracked(() => this.treeService.setData(data));
        });
    }

    public close(): void {
        this.#popupRef?.close();
    }

    public ngOnInit(): void {
        this.treeService.setSelectableOptions(this.selectableOptions);
        this.setEffects();
        this.setSubscriptions();
        this.setEventListeners();
    }

    public onFilterChange(event: FilterChangeEvent): void {
        this.treeService.filterChange.emit(event);
        if (!event.isDefaultPrevented()) {
            this.treeService.filter$.next(event.filter);
        }
    }

    public open(): void {
        this.#hostElementRef.nativeElement.focus();
        if (this.#popupRef) {
            return;
        }
        this.#popupRef = this.#popupService.create({
            anchor: this.#hostElementRef.nativeElement,
            content: this.popupTemplate(),
            hasBackdrop: false,
            withPush: false,
            width: this.#hostElementRef.nativeElement.getBoundingClientRect().width,
            popupClass: ["mona-dropdown-popup-content", "mona-dropdown-tree-popup-content", this.#popupUidClass],
            closeOnOutsideClick: false,
            positions: DropDownService.getDefaultPositions()
        });
        this.focusSelectedNode();
        this.#popupAnimationService.setupDropdownOutsideClickCloseAnimation(this.#popupRef);
        this.#popupAnimationService.animateDropdown(this.#popupRef, AnimationState.Show);
        this.#popupRef.closed.pipe(take(1)).subscribe(() => {
            this.#popupRef = null;
            this.treeService.clearFilter();
            const popupElement = document.querySelector(`.${this.#popupUidClass}`);
            if (DropDownService.shouldFocusAfterClose(this.#hostElementRef.nativeElement, popupElement)) {
                this.focus();
            }
        });
    }

    public registerOnChange(fn: any): void {
        this.#propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {}

    public setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    public writeValue(obj: any | null) {
        this.#value.set(obj);
        if (obj != null) {
            this.treeService.setSelectedDataItems([obj]);
        }
    }

    private focus(): void {
        this.#hostElementRef.nativeElement?.focus();
    }

    private focusSelectedNode(): void {
        window.setTimeout(() => {
            const popupElement = document.querySelector(`.${this.#popupUidClass}`);
            if (!popupElement) {
                return;
            }
            const firstElement = popupElement.querySelector(
                ".mona-dropdown-popup-content ul:first-child li:first-child"
            ) as HTMLElement;
            const uid = this.#selectedNode()?.uid;
            if (uid) {
                const selectedElement = popupElement.querySelector(
                    ".mona-dropdown-popup-content ul li[data-uid='" + uid + "']"
                ) as HTMLElement;
                if (selectedElement) {
                    selectedElement?.scrollIntoView({
                        behavior: "auto",
                        block: "center"
                    });
                    selectedElement.focus();
                    return;
                } else {
                    if (firstElement) {
                        firstElement.focus();
                    }
                }
            }
            if (firstElement) {
                firstElement.focus();
            }
        }, 200);
    }

    private handleEnterKey(): void {
        if (this.#popupRef) {
            this.close();
            return;
        }
        this.open();
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.handleEnterKey();
        }
    }

    private notifyValueChange(): void {
        this.#propagateChange?.(this.#value());
    }

    private setEffects(): void {
        effect(
            () => {
                const highlightedNode = this.treeService.navigatedNode();
                window.setTimeout(() => {
                    if (!highlightedNode) {
                        return;
                    }
                    const popupElement = document.querySelector(`.${this.#popupUidClass}`);
                    if (!popupElement) {
                        return;
                    }
                    const nodeElement = popupElement.querySelector(
                        `[data-uid="${highlightedNode.uid}"]`
                    ) as HTMLElement;
                    if (nodeElement) {
                        nodeElement.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center"
                        });
                    }
                });
            },
            { injector: this.#injector }
        );
    }

    private setEventListeners(): void {
        fromEvent<KeyboardEvent>(this.#hostElementRef.nativeElement, "keydown")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((event: KeyboardEvent) => {
                this.handleKeyDown(event);
            });
        fromEvent<MouseEvent>(this.#hostElementRef.nativeElement, "click")
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                if (this.disabled()) {
                    return;
                }
                this.open();
            });
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
                this.notifyValueChange();
            });
    }
}
