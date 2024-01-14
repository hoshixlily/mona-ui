import { Component, computed, effect, ElementRef, HostBinding, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCaretRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { DropPositionChangeEvent } from "../../models/DropPositionChangeEvent";
import { TreeService } from "../../services/tree.service";

@Component({
    selector: "mona-tree-drop-hint",
    standalone: true,
    imports: [FaIconComponent],
    templateUrl: "./tree-drop-hint.component.html",
    styleUrl: "./tree-drop-hint.component.scss"
})
export class TreeDropHintComponent<T> {
    readonly #dropPositionChange: Signal<DropPositionChangeEvent<T> | null> = toSignal(
        this.treeService.dropPositionChange$,
        {
            initialValue: null
        }
    );
    protected readonly dropHintIcon: IconDefinition = faCaretRight;
    protected readonly dropHintStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        const dropPositionData = this.#dropPositionChange();
        if (!dropPositionData) {
            return { display: "none" };
        }
        const node = dropPositionData.targetNode;
        if (!node) {
            return { display: "none" };
        }
        const nodeElement = this.elementRef.nativeElement.parentElement?.querySelector(
            `[data-uid="${node.uid}"] > div`
        );
        if (!nodeElement) {
            return { display: "none" };
        }
        const rect = nodeElement.getBoundingClientRect();
        const position = dropPositionData.position;
        const leftOffset = 0;
        if (position === "before") {
            return {
                display: "flex",
                top: `${rect.top}px`,
                left: `${rect.left + leftOffset}px`
            };
        } else if (position === "after") {
            return {
                display: "flex",
                top: `${rect.bottom}px`,
                left: `${rect.left + leftOffset}px`
            };
        } else {
            return { display: "none" };
        }
    });

    @HostBinding("mona-tree-drop-hint")
    public get dropHint(): boolean {
        return true;
    }

    public constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly treeService: TreeService<T>
    ) {
        elementRef.nativeElement.classList.add("mona-tree-drop-hint");
        effect(() => {
            const styles = this.dropHintStyles();
            Object.assign(this.elementRef.nativeElement.style, styles);
        });
    }
}
