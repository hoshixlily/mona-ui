import { Component, computed, effect, ElementRef, inject, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DropPositionChangeEvent } from "../../models/DropPositionChangeEvent";
import { TreeService } from "../../services/tree.service";

@Component({
    selector: "mona-tree-drop-hint",
    imports: [],
    templateUrl: "./tree-drop-hint.component.html",
    styleUrl: "./tree-drop-hint.component.scss",
    host: {
        "[class.mona-tree-drop-hint]": "true"
    }
})
export class TreeDropHintComponent<T> {
    readonly #dropPositionChange: Signal<DropPositionChangeEvent<T> | null> = toSignal(
        this.treeService.dropPositionChange$,
        {
            initialValue: null
        }
    );
    readonly #hostElementRef: ElementRef<HTMLElement> = inject(ElementRef);
    protected readonly dropHintStyles: Signal<Partial<CSSStyleDeclaration>> = computed(() => {
        const dropPositionData = this.#dropPositionChange();
        if (!dropPositionData) {
            return { display: "none" };
        }
        const node = dropPositionData.targetNode;
        if (!node) {
            return { display: "none" };
        }
        const nodeElement = this.#hostElementRef.nativeElement.parentElement?.querySelector(
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

    public constructor(private readonly treeService: TreeService<T>) {
        effect(() => {
            const styles = this.dropHintStyles();
            Object.assign(this.#hostElementRef.nativeElement.style, styles);
        });
    }
}
