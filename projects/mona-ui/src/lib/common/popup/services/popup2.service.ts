import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    EnvironmentInjector,
    inject,
    Injectable,
    NgZone,
    TemplateRef
} from "@angular/core";
import { fromEvent, Observable, Subject, take, takeUntil } from "rxjs";
import { Popup2ContainerComponent } from "../components/popup2-container/popup2-container.component";
import { Popup2Options } from "../models/Popup2Options";
import { Popup2Ref } from "../models/Popup2Ref";
import { PopupConnectPosition } from "../models/PopupConnectPosition";
import { PopupCornerPosition } from "../models/PopupCornerPosition";

@Injectable({
    providedIn: "root"
})
export class Popup2Service {
    readonly #appRef: ApplicationRef = inject(ApplicationRef);
    readonly #defaultPositions: PopupConnectPosition[] = [
        // {
        //     left: "start",
        //     top: "end"
        // },
        {
            left: "end",
            top: "end"
        },
        {
            left: "start",
            top: "end"
        }
    ];
    readonly #injector: EnvironmentInjector = inject(EnvironmentInjector);
    readonly #zone: NgZone = inject(NgZone);

    public constructor() {}

    public open(options: Popup2Options): Popup2Ref {
        const push = options.push ?? false;
        const close$ = new Subject<void>();
        const container = this.createPopupContainer();
        const componentRef = this.createContainerComponentRef(options.content);
        const componentContent = this.createContentElement(componentRef.location.nativeElement);
        const positions = options.positions ?? this.#defaultPositions;

        container.appendChild(componentContent);
        window.setTimeout(() => {
            this.attachPopupContainer(container, options.anchor);
            this.setPopupContainerPosition(container, options.anchor, positions, push);
            this.applyContainerStyles(container, options.anchor, options);
        });
        this.#zone.runOutsideAngular(() => {
            window.requestAnimationFrame(() => {
                this.setCloseOnOutsideClickSubscription(container, close$, options.closeOnOutsideClick);
                this.setCloseOnEscapeSubscription(container, close$, options.closeOnEscape);
                this.setWindowScrollHandler(container, options.anchor, positions, close$, push);
            });
        });
        close$.pipe(take(1)).subscribe(() => {
            this.#appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        });

        return new Popup2Ref({
            close$: close$,
            close: () => {
                this.closePopupContainer(container);
                close$.next(undefined);
                close$.complete();
            }
        });
    }

    private applyContainerStyles(container: HTMLElement, anchor: HTMLElement, options: Popup2Options): void {
        const containerRect = container.getBoundingClientRect();
        if (options.width) {
            container.style.width = `${options.width}px`;
        }
        container.style.maxWidth = `${window.innerWidth - containerRect.left}px`;
    }

    private attachPopupContainer(container: HTMLElement, anchor: HTMLElement = document.body): void {
        anchor.insertAdjacentElement("afterend", container);
    }

    private calculatePosition(anchor: HTMLElement, connectPosition: PopupConnectPosition): PopupCornerPosition {
        const rect = anchor.getBoundingClientRect();
        const parentRect = anchor.offsetParent?.getBoundingClientRect() ?? document.body.getBoundingClientRect();
        let top = 0;
        let left = 0;
        if (connectPosition.left === "start") {
            left = rect.left - parentRect.left;
        } else if (connectPosition.left === "center") {
            left = rect.left - parentRect.left + rect.width / 2;
        } else if (connectPosition.left === "end") {
            left = rect.left - parentRect.left + rect.width;
        }
        if (connectPosition.top === "start") {
            top = rect.top - parentRect.top;
        } else if (connectPosition.top === "center") {
            top = rect.top - parentRect.top + rect.height / 2;
        } else if (connectPosition.top === "end") {
            top = rect.top - parentRect.top + rect.height;
        }
        return { top, left };
    }

    private calculateHorizontalPushedPosition(
        anchor: HTMLElement,
        container: HTMLElement,
        connectPosition: PopupConnectPosition
    ): PopupCornerPosition {
        const anchorRect = anchor.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const calculatedPosition = this.calculatePosition(anchor, connectPosition);
        if (connectPosition.left === "start") {
            calculatedPosition.left = anchorRect.left - (containerRect.width - anchorRect.width);
        } else if (connectPosition.left === "center") {
            calculatedPosition.left = anchorRect.left - containerRect.width / 2 + anchorRect.width / 2;
        } else if (connectPosition.left === "end") {
            calculatedPosition.left = anchorRect.left - containerRect.width;
        }
        return calculatedPosition;
    }

    private calculateVerticalPushedPosition(
        anchor: HTMLElement,
        container: HTMLElement,
        connectPosition: PopupConnectPosition
    ): PopupCornerPosition {
        const anchorRect = anchor.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const calculatedPosition = this.calculatePosition(anchor, connectPosition);
        if (connectPosition.top === "start") {
            calculatedPosition.top = anchorRect.top - (containerRect.height - anchorRect.height);
        } else if (connectPosition.top === "center") {
            calculatedPosition.top = anchorRect.top - containerRect.height / 2 + anchorRect.height / 2;
        } else if (connectPosition.top === "end") {
            calculatedPosition.top = anchorRect.top - containerRect.height;
        }
        return calculatedPosition;
    }

    private isHorizontalPositionFitting(container: HTMLElement, cornerPosition: PopupCornerPosition): boolean {
        const rect = container.getBoundingClientRect();
        return cornerPosition.left + rect.width <= window.innerWidth && cornerPosition.left >= 0;
    }

    private isVerticalPositionFitting(container: HTMLElement, cornerPosition: PopupCornerPosition): boolean {
        const rect = container.getBoundingClientRect();
        return cornerPosition.top + rect.height <= window.innerHeight && cornerPosition.top >= 0;
    }

    private closePopupContainer(container: HTMLElement): void {
        container.remove();
    }

    private createContainerComponentRef(content: TemplateRef<any>): ComponentRef<Popup2ContainerComponent> {
        const componentRef = createComponent(Popup2ContainerComponent, {
            environmentInjector: this.#injector
        });
        componentRef.instance.content = content;
        this.#appRef.attachView(componentRef.hostView);
        componentRef.changeDetectorRef.detectChanges();
        return componentRef;
    }

    private createContentElement(componentContent: Element): HTMLElement {
        const element = document.createElement("div");
        element.classList.add("mona-popup2-content");
        element.appendChild(componentContent);
        return element;
    }

    private createPopupContainer(): HTMLElement {
        const container = document.createElement("div");
        container.classList.add("mona-popup2-container");
        return container;
    }

    private findClosestScrollableElement(element: HTMLElement): Element | null {
        let style = getComputedStyle(element);
        const excludeStaticParent = style.position === "absolute";
        const overflowRegex = /(auto|scroll|hidden)/;
        if (style.position === "fixed") return document.body;
        for (let parent: HTMLElement | null | undefined = element; ; parent = parent?.parentElement) {
            if (!parent) {
                return document.scrollingElement;
            }
            style = getComputedStyle(parent);
            if (excludeStaticParent && style.position === "static") {
                continue;
            }
            if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
                return parent;
            }
        }
    }

    private setCloseOnEscapeSubscription(
        container: HTMLElement,
        close$: Subject<void>,
        close: boolean | undefined
    ): void {
        const escapeKey$ = this.setEscapeKeyHandler(close$);
        if (close) {
            escapeKey$.pipe(take(1)).subscribe(() => {
                this.closePopupContainer(container);
                close$.next(undefined);
                close$.complete();
            });
        }
    }

    private setCloseOnOutsideClickSubscription(
        container: HTMLElement,
        close$: Subject<void>,
        close: boolean | undefined
    ): void {
        const outsideClick$ = this.setOutsideClickHandler(container, close$);
        if (close) {
            outsideClick$.pipe(take(1)).subscribe(() => {
                this.closePopupContainer(container);
                close$.next(undefined);
                close$.complete();
            });
        }
    }

    private setEscapeKeyHandler(close$: Subject<void>): Observable<KeyboardEvent> {
        const event$: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event$.next(event);
            }
        };
        fromEvent<KeyboardEvent>(document, "keydown")
            .pipe(takeUntil(close$))
            .subscribe({
                next: (event: KeyboardEvent) => handler(event)
            });
        return event$.asObservable();
    }

    private setOutsideClickHandler(container: HTMLElement, close$: Subject<void>): Observable<MouseEvent> {
        const event$: Subject<MouseEvent> = new Subject<MouseEvent>();
        const handler = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest(".mona-popup2-container")) {
                event$.next(event);
            }
        };
        fromEvent<MouseEvent>(document, "click")
            .pipe(takeUntil(close$))
            .subscribe({
                next: (event: MouseEvent) => handler(event)
            });
        return event$.asObservable();
    }

    private setPopupContainerPosition(
        container: HTMLElement,
        anchor: HTMLElement,
        positions: PopupConnectPosition[],
        push: boolean
    ): void {
        for (const position of positions) {
            const calculatedPosition = this.calculatePosition(anchor, position);
            const horizontallyFitting = this.isHorizontalPositionFitting(container, calculatedPosition);
            const verticallyFitting = this.isVerticalPositionFitting(container, calculatedPosition);
            if (!push || (horizontallyFitting && verticallyFitting)) {
                container.style.top = `${calculatedPosition.top}px`;
                container.style.left = `${calculatedPosition.left}px`;
                console.log("position", calculatedPosition);
                return;
            }
        }
        const position = positions[0];
        const calculatedPosition = this.calculatePosition(anchor, position);
        const horizontallyFitting = this.isHorizontalPositionFitting(container, calculatedPosition);
        const verticallyFitting = this.isVerticalPositionFitting(container, calculatedPosition);
        let horizontalPushedPosition: PopupCornerPosition | null;
        if (push && !horizontallyFitting) {
            horizontalPushedPosition = this.calculateHorizontalPushedPosition(anchor, container, position);
            const pushedHorizontallyFitting = this.isHorizontalPositionFitting(container, horizontalPushedPosition);
            if (!pushedHorizontallyFitting) {
                horizontalPushedPosition = calculatedPosition;
            }
        } else {
            horizontalPushedPosition = calculatedPosition;
        }

        let verticalPushedPosition: PopupCornerPosition | null;
        if (push && !verticallyFitting) {
            verticalPushedPosition = this.calculateVerticalPushedPosition(anchor, container, position);
            const pushedVerticallyFitting = this.isVerticalPositionFitting(container, verticalPushedPosition);
            if (!pushedVerticallyFitting) {
                verticalPushedPosition = calculatedPosition;
            }
        } else {
            verticalPushedPosition = calculatedPosition;
        }
        container.style.top = `${verticalPushedPosition.top}px`;
        container.style.left = `${horizontalPushedPosition.left}px`;
    }

    private setWindowScrollHandler(
        container: HTMLElement,
        anchor: HTMLElement,
        positions: PopupConnectPosition[],
        close$: Subject<void>,
        push: boolean
    ): void {
        const scrollableElement = this.findClosestScrollableElement(anchor);
        if (scrollableElement === null) {
            return;
        }
        fromEvent<Event>(scrollableElement, "scroll")
            .pipe(takeUntil(close$))
            .subscribe({
                next: () => {
                    this.setPopupContainerPosition(container, anchor, positions, push);
                }
            });
    }
}
