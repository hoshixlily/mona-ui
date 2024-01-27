import {
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

@Injectable({
    providedIn: "root"
})
export class Popup2Service {
    readonly #injector: EnvironmentInjector = inject(EnvironmentInjector);
    readonly #zone: NgZone = inject(NgZone);

    public constructor() {}

    public open(options: Popup2Options): Popup2Ref {
        const close$ = new Subject<void>();
        const container = this.createPopupContainer();
        const componentRef = this.createContainerComponentRef(options.content);
        const componentContent = this.createContentElement(componentRef.location.nativeElement);
        container.appendChild(componentContent);
        this.attachPopupContainer(container, options.anchor);
        this.#zone.runOutsideAngular(() => {
            window.requestAnimationFrame(() => {
                this.setCloseOnOutsideClickSubscription(container, close$, options.closeOnOutsideClick);
                this.setCloseOnEscapeSubscription(container, close$, options.closeOnEscape);
            });
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

    private attachPopupContainer(container: HTMLElement, anchor: HTMLElement = document.body): void {
        this.setPopupContainerPosition(container, anchor);
        anchor.insertAdjacentElement("afterend", container);
    }

    private closePopupContainer(container: HTMLElement): void {
        container.remove();
    }

    private createContainerComponentRef(content: TemplateRef<any>): ComponentRef<Popup2ContainerComponent> {
        const componentRef = createComponent(Popup2ContainerComponent, {
            environmentInjector: this.#injector
        });
        componentRef.instance.content = content;
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

    private setCloseOnEscapeSubscription(
        container: HTMLElement,
        close$: Subject<void>,
        close: boolean | undefined
    ): void {
        const escapeKey$ = this.setEscapeKeyHandler(close$);
        if (close) {
            escapeKey$.pipe(take(1)).subscribe(() => {
                this.closePopupContainer(container);
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

    private setPopupContainerPosition(container: HTMLElement, anchor: HTMLElement): void {
        const anchorRect = anchor.getBoundingClientRect();
        const anchorCenterX = anchorRect.x;
        const anchorCenterY = anchorRect.y + anchorRect.height;
        container.style.left = `${anchorCenterX}px`;
        container.style.top = `${anchorCenterY}px`;
    }

    private setOutsideClickHandler(container: HTMLElement, close$: Subject<void>): Observable<MouseEvent> {
        const event$: Subject<MouseEvent> = new Subject<MouseEvent>();
        const handler = (event: MouseEvent) => {
            if (!container.contains(event.target as Node)) {
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
}
