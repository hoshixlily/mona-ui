import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    input,
    InputSignal,
    model,
    ModelSignal,
    OnDestroy,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { asapScheduler } from "rxjs";
import { WindowTitleTemplateDirective } from "../../directives/window-title-template.directive";
import { WindowCloseEvent } from "../../models/WindowCloseEvent";
import { WindowRef } from "../../models/WindowRef";
import { WindowService } from "../../services/window.service";

@Component({
    selector: "mona-window",
    templateUrl: "./window.component.html",
    styleUrls: ["./window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class WindowComponent implements OnDestroy, AfterViewInit {
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly #windowService: WindowService = inject(WindowService);
    #windowRef?: WindowRef;
    public draggable: InputSignal<boolean> = input(true);
    public focusedElement: InputSignal<HTMLElement | ElementRef<HTMLElement> | string | undefined> = input<
        HTMLElement | ElementRef<HTMLElement> | string | undefined
    >(undefined);
    public height: ModelSignal<number | undefined> = model<number | undefined>(undefined);
    public left: ModelSignal<number | undefined> = model<number | undefined>(undefined);
    public maxHeight: InputSignal<number | undefined> = input<number | undefined>(undefined);
    public maxWidth: InputSignal<number | undefined> = input<number | undefined>(undefined);
    public minHeight: InputSignal<number | undefined> = input<number | undefined>(undefined);
    public minWidth: InputSignal<number | undefined> = input<number | undefined>(undefined);
    public modal: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
    public resizable: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
    public title: InputSignal<string | undefined> = input<string | undefined>(undefined);
    public top: ModelSignal<number | undefined> = model<number | undefined>(undefined);
    public width: ModelSignal<number | undefined> = model<number | undefined>(undefined);

    @Output()
    public close: EventEmitter<WindowCloseEvent> = new EventEmitter<WindowCloseEvent>();

    @Output()
    public dragEnd: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public dragStart: EventEmitter<void> = new EventEmitter<void>();

    @ContentChild(WindowTitleTemplateDirective)
    public titleTemplateDirective?: WindowTitleTemplateDirective;

    @ViewChild("windowTemplate")
    public windowTemplate!: TemplateRef<any>;

    public ngAfterViewInit(): void {
        asapScheduler.schedule(() => {
            this.#windowRef = this.#windowService.open({
                content: this.windowTemplate,
                draggable: this.draggable(),
                focusedElement: this.focusedElement(),
                height: this.height(),
                left: this.left(),
                maxHeight: this.maxHeight(),
                maxWidth: this.maxWidth(),
                minHeight: this.minHeight(),
                minWidth: this.minWidth(),
                modal: this.modal(),
                resizable: this.resizable(),
                title: this.titleTemplateDirective?.templateRef ?? this.title(),
                top: this.top(),
                width: this.width()
            });
            this.#windowRef.resize$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
                if (event.width != null) {
                    this.width.set(event.width);
                }
                if (event.height != null) {
                    this.height.set(event.height);
                }
                if (event.left != null) {
                    this.left.set(event.left);
                }
                if (event.top != null) {
                    this.top.set(event.top);
                }
            });
            this.#windowRef.close$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
                this.close.emit(event);
            });
            this.#windowRef.drag$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
                if (event.left != null) {
                    this.left.set(event.left);
                }
                if (event.top != null) {
                    this.top.set(event.top);
                }
            });
            this.#windowRef.dragEnd$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
                this.dragEnd.emit();
            });
            this.#windowRef.dragStart$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
                this.dragStart.emit();
            });
        });
    }

    public ngOnDestroy(): void {
        this.#windowRef?.close();
    }
}
