import { CommonModule } from "@angular/common";
import {
    Component,
    computed,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Selector, sequenceEqual } from "@mirei/ts-collections";
import { Observable, take } from "rxjs";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { NodeItem } from "../../../../common/tree/models/NodeItem";
import { SelectableOptions } from "../../../../common/tree/models/SelectableOptions";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { PopupService } from "../../../../popup/services/popup.service";
import { TreeViewComponent } from "../../../../tree-view/components/tree-view/tree-view.component";
import { TreeViewDisableDirective } from "../../../../tree-view/directives/tree-view-disable.directive";
import { TreeViewExpandableDirective } from "../../../../tree-view/directives/tree-view-expandable.directive";
import { TreeViewFilterableDirective } from "../../../../tree-view/directives/tree-view-filterable.directive";
import { TreeViewSelectableDirective } from "../../../../tree-view/directives/tree-view-selectable.directive";
import { Action } from "../../../../utils/Action";
import { DropDownService } from "../../../services/drop-down.service";
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
        TreeViewExpandableDirective
    ],
    templateUrl: "./drop-down-tree.component.html",
    styleUrl: "./drop-down-tree.component.scss",
    providers: [
        DropDownTreeService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropDownTreeComponent),
            multi: true
        }
    ]
})
export class DropDownTreeComponent<T> implements ControlValueAccessor {
    #popupRef: PopupRef | null = null;
    #selectedNode: WritableSignal<NodeItem<T> | null> = signal(null);
    #propagateChange: any = () => {};
    #value: WritableSignal<any | null> = signal(null);
    protected readonly selectableOptions: SelectableOptions = {
        enabled: true,
        mode: "single",
        toggleable: false,
        childrenOnly: false
    };
    protected readonly selectedTreeKeys: WritableSignal<unknown[]> = signal([]);
    protected readonly text: Signal<string> = computed(() => {
        return this.#value()?.[this.textField] ?? "";
    });
    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public disabler: WritableSignal<Action<unknown, boolean> | string | undefined> = signal(undefined);

    @Input()
    public children: string | Selector<T, Iterable<T> | Observable<Iterable<T>>> = "";

    @Input()
    public data: Iterable<T> = [];

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input()
    public set itemDisabled(nodeDisabler: Action<unknown, boolean> | string) {
        this.disabler.set(nodeDisabler);
    }

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<any>;

    @Input()
    public textField: string = "";

    public constructor(
        protected readonly dropdownTreeService: DropDownTreeService,
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public close(): void {
        this.#popupRef?.close();
    }

    public onExpandedKeysChange(expandedKeys: unknown[]): void {
        this.dropdownTreeService.expandedKeys.update(set => set.clear().addAll(expandedKeys));
        this.dropdownTreeService.expandedKeysChange.emit(expandedKeys);
    }

    public onSelectedKeysChange(selectedKeys: unknown[]): void {
        if (sequenceEqual(this.selectedTreeKeys(), selectedKeys)) {
            return;
        }
        this.selectedTreeKeys.set(selectedKeys);
        this.close();
    }

    public onSelectionChange(node: NodeItem<T>): void {
        this.#selectedNode.set(node);
        this.#value.set(node.data);
        this.#propagateChange(this.#value());
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
        if (obj == null) {
            this.selectedTreeKeys.set([]);
        } else {
            this.selectedTreeKeys.set([obj]);
        }
    }
}
