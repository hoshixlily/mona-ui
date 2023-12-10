import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import {
    Component,
    computed,
    DestroyRef,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    inject,
    Input,
    Output,
    Signal,
    signal,
    TemplateRef,
    ViewChild,
    WritableSignal
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { take } from "rxjs";
import { AnimationState } from "../../../../animations/models/AnimationState";
import { PopupAnimationService } from "../../../../animations/services/popup-animation.service";
import { ButtonDirective } from "../../../../buttons/button/button.directive";
import { PopupRef } from "../../../../popup/models/PopupRef";
import { PopupService } from "../../../../popup/services/popup.service";
import { TreeViewComponent } from "../../../../tree-view/components/tree-view/tree-view.component";
import { TreeViewSelectableDirective } from "../../../../tree-view/directives/tree-view-selectable.directive";
import { Node } from "../../../../tree-view/models/Node";
import { NodeLookupItem } from "../../../../tree-view/models/NodeLookupItem";
import { SelectableOptions } from "../../../../tree-view/models/SelectableOptions";

@Component({
    selector: "mona-drop-down-tree",
    standalone: true,
    imports: [CommonModule, ButtonDirective, TreeViewComponent, FaIconComponent, TreeViewSelectableDirective],
    templateUrl: "./drop-down-tree.component.html",
    styleUrl: "./drop-down-tree.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropDownTreeComponent),
            multi: true
        }
    ]
})
export class DropDownTreeComponent implements ControlValueAccessor {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    #popupRef: PopupRef | null = null;
    #selectedNode: WritableSignal<NodeLookupItem | null> = signal(null);
    #propagateChange: any = () => {};
    #value: WritableSignal<any | null> = signal(null);
    protected readonly selectableOptions: SelectableOptions = {
        enabled: true,
        mode: "single",
        childrenOnly: false
    };
    protected readonly selectedTreeKeys: WritableSignal<string[]> = signal([]);
    protected readonly text: Signal<string> = computed(() => {
        return this.#value()?.[this.textField] ?? "";
    });
    public readonly clearIcon: IconDefinition = faTimes;
    public readonly dropdownIcon: IconDefinition = faChevronDown;
    public treeNode?: Node | null = null;

    @Input()
    public childrenField: string = "";

    @Input()
    public data: Iterable<any> = [];

    @Input()
    public disabled: boolean = false;

    @ViewChild("dropdownWrapper")
    public dropdownWrapper!: ElementRef<HTMLDivElement>;

    @HostBinding("class.mona-dropdown")
    public readonly hostClass: boolean = true;

    @Input({ required: true })
    public keyField: string = "";

    @ViewChild("popupTemplate")
    public popupTemplate!: TemplateRef<any>;

    @Input()
    public textField: string = "";

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly popupAnimationService: PopupAnimationService,
        private readonly popupService: PopupService
    ) {}

    public close(): void {
        this.#popupRef?.close();
    }

    public onSelectedKeysChange(selectedKeys: string[]): void {
        this.selectedTreeKeys.set(selectedKeys);
    }

    public onSelectionChange(node: NodeLookupItem): void {
        this.#selectedNode.set(node);
        this.#value.set(node.selected ? node.data : null);
        this.#propagateChange(this.#value());
        this.close();
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
            popupClass: ["mona-dropdown-popup-content"],
            closeOnOutsideClick: false,
            positions: [
                new ConnectionPositionPair(
                    { originX: "start", originY: "bottom" },
                    { overlayX: "start", overlayY: "top" },
                    -1,
                    0,
                    "mona-dropdown-popup-content-bottom"
                ),
                new ConnectionPositionPair(
                    { originX: "start", originY: "top" },
                    { overlayX: "start", overlayY: "bottom" },
                    -1,
                    -1,
                    "mona-dropdown-popup-content-top"
                )
            ]
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
            this.selectedTreeKeys.set([obj[this.keyField]]);
        }
    }
}
