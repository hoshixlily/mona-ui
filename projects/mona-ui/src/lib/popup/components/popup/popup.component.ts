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
    OnDestroy,
    output,
    TemplateRef
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { fromEvent, take } from "rxjs";
import { PopupOffset } from "../../models/PopupOffset";
import { PopupRef } from "../../models/PopupRef";
import { PopupSettings } from "../../models/PopupSettings";
import { PopupService } from "../../services/popup.service";

@Component({
    selector: "mona-popup",
    templateUrl: "./popup.component.html",
    styleUrls: ["./popup.component.scss"],
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

    protected readonly contentTemplate = contentChild.required(TemplateRef);

    public readonly close = output();
    public readonly open = output<PopupRef>();

    public anchor = input.required<FlexibleConnectedPositionStrategyOrigin>();
    public closeOnEscape = input(true);
    public height = input<number | string | undefined>(undefined);
    public maxHeight = input<number | string | undefined>(undefined);
    public maxWidth = input<number | string | undefined>(undefined);
    public minHeight = input<number | string | undefined>(undefined);
    public minWidth = input<number | string | undefined>(undefined);
    public offset = input<PopupOffset | undefined>(undefined);
    public popupClass = input<string | string[]>([]);
    public popupWrapperClass = input<string | string[]>([]);
    public trigger = input("click");
    public width = input<number | string | undefined>(undefined);

    public ngAfterViewInit(): void {
        window.setTimeout(() => {
            this.setEventListeners();
        });
    }

    public ngOnDestroy(): void {
        this.#popupRef?.close();
    }

    private getPopupWidth(): string | number | undefined {
        const width = this.width();
        if (width != null) {
            return width;
        }

        const anchor = this.anchor();
        if (anchor instanceof HTMLElement) {
            return anchor.getBoundingClientRect().width;
        }
        if (anchor instanceof ElementRef) {
            return anchor.nativeElement.getBoundingClientRect().width;
        }
        return undefined;
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
        const width = this.getPopupWidth();
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
                this.#popupRef.closed.pipe(take(1)).subscribe(result => {
                    this.#popupRef = null;
                    this.close.emit();
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
