import { FlexibleConnectedPositionStrategyOrigin } from "@angular/cdk/overlay";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    contentChild,
    DestroyRef,
    ElementRef,
    inject,
    input,
    InputSignal,
    OnDestroy,
    output,
    OutputEmitterRef,
    Signal,
    TemplateRef
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent } from "rxjs";
import { PopupOffset } from "../../models/PopupOffset";
import { PopupRef } from "../../models/PopupRef";
import { PopupSettings } from "../../models/PopupSettings";
import { PopupService } from "../../services/popup.service";

@Component({
    selector: "mona-popup",
    template: ` <ng-content></ng-content> `,
    styles: "",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "mona-popup"
    }
})
export class PopupComponent implements OnDestroy, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #popupService: PopupService = inject(PopupService);
    #popupOpened: boolean = false;
    #popupRef: PopupRef | null = null;

    public anchor: InputSignal<FlexibleConnectedPositionStrategyOrigin> = input.required();
    public close: OutputEmitterRef<void> = output();
    public closeOnEscape: InputSignal<boolean> = input(true);
    public contentTemplate: Signal<TemplateRef<any>> = contentChild.required(TemplateRef);
    public height: InputSignal<number | string | undefined> = input<number | string | undefined>(undefined);
    public maxHeight: InputSignal<number | string | undefined> = input<number | string | undefined>(undefined);
    public maxWidth: InputSignal<number | string | undefined> = input<number | string | undefined>(undefined);
    public minHeight: InputSignal<number | string | undefined> = input<number | string | undefined>(undefined);
    public minWidth: InputSignal<number | string | undefined> = input<number | string | undefined>(undefined);
    public offset: InputSignal<PopupOffset | undefined> = input<PopupOffset | undefined>(undefined);
    public open: OutputEmitterRef<PopupRef> = output();
    public popupClass: InputSignal<string | string[]> = input<string | string[]>([]);
    public popupWrapperClass: InputSignal<string | string[]> = input<string | string[]>([]);
    public trigger: InputSignal<string> = input("click");
    public width: InputSignal<number | string | undefined> = input<number | string | undefined>(undefined);

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.setEventListeners();
        });
    }

    public ngOnDestroy(): void {
        this.#popupRef?.close();
    }

    private setEventListeners(): void {
        let pointAnchor = false;
        let target: HTMLElement;
        const anchor = this.anchor();
        if (anchor instanceof ElementRef) {
            target = anchor.nativeElement;
        } else if (anchor instanceof HTMLElement) {
            target = anchor;
        } else {
            target = document.body;
            pointAnchor = true;
        }
        const width =
            this.width() ??
            (anchor instanceof HTMLElement
                ? anchor.getBoundingClientRect().width
                : anchor instanceof ElementRef
                  ? anchor.nativeElement.getBoundingClientRect().width
                  : undefined);
        fromEvent<MouseEvent>(target, this.trigger())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(event => {
                event.preventDefault();
                if (this.#popupOpened) {
                    this.#popupOpened = false;
                    return;
                }
                const popupSettings: PopupSettings = {
                    anchor,
                    closeOnEscape: this.closeOnEscape(),
                    content: this.contentTemplate(),
                    hasBackdrop: false,
                    height: this.height(),
                    maxHeight: this.maxHeight(),
                    maxWidth: this.maxWidth(),
                    minHeight: this.minHeight(),
                    minWidth: this.minWidth(),
                    offset: this.offset(),
                    popupClass: this.popupClass(),
                    popupWrapperClass: this.popupWrapperClass(),
                    width
                };
                this.#popupRef = this.#popupService.create(popupSettings);
                const subscription = this.#popupRef.closed.subscribe(result => {
                    this.#popupRef = null;
                    this.close.emit();
                    subscription.unsubscribe();
                    if (result instanceof PointerEvent && result.type === this.trigger()) {
                        this.#popupOpened =
                            target instanceof HTMLElement && target.contains(result.target as HTMLElement);
                    } else if (result instanceof PointerEvent && pointAnchor && result.type !== this.trigger()) {
                        this.#popupOpened = false;
                    }
                });
                if (pointAnchor) {
                    this.#popupOpened = true;
                }
                this.open.emit(this.#popupRef);
            });
    }
}
