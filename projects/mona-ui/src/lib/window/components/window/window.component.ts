import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
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
    private windowRef?: WindowRef;

    @Output()
    public close: EventEmitter<WindowCloseEvent> = new EventEmitter<WindowCloseEvent>();

    @Output()
    public dragEnd: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public dragStart: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    public draggable?: boolean;

    @Input()
    public focusedElement?: HTMLElement | ElementRef<HTMLElement> | string;

    @Input()
    public height?: number;

    @Output()
    public heightChange: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    public left?: number;

    @Output()
    public leftChange: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    public maxHeight?: number;

    @Input()
    public maxWidth?: number;

    @Input()
    public minHeight?: number;

    @Input()
    public minWidth?: number;

    @Input()
    public modal?: boolean;

    @Input()
    public resizable?: boolean;

    @Input()
    public title?: string;

    @ContentChild(WindowTitleTemplateDirective)
    public titleTemplateDirective?: WindowTitleTemplateDirective;

    @Input()
    public top?: number;

    @Output()
    public topChange: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    public width?: number;

    @Output()
    public widthChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild("windowTemplate")
    public windowTemplate!: TemplateRef<any>;

    public constructor(private readonly windowService: WindowService) {}

    public ngAfterViewInit(): void {
        asapScheduler.schedule(() => {
            this.windowRef = this.windowService.open({
                content: this.windowTemplate,
                draggable: this.draggable,
                focusedElement: this.focusedElement,
                height: this.height,
                left: this.left,
                maxHeight: this.maxHeight,
                maxWidth: this.maxWidth,
                minHeight: this.minHeight,
                minWidth: this.minWidth,
                modal: this.modal,
                resizable: this.resizable,
                title: this.titleTemplateDirective?.templateRef ?? this.title,
                top: this.top,
                width: this.width
            });
            this.windowRef.resize$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
                if (event.width != null) {
                    this.widthChange.emit(event.width);
                }
                if (event.height != null) {
                    this.heightChange.emit(event.height);
                }
                if (event.left != null) {
                    this.leftChange.emit(event.left);
                }
                if (event.top != null) {
                    this.topChange.emit(event.top);
                }
            });
            this.windowRef.close$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
                this.close.emit(event);
            });
            this.windowRef.drag$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(event => {
                if (event.left != null) {
                    this.leftChange.emit(event.left);
                }
                if (event.top != null) {
                    this.topChange.emit(event.top);
                }
            });
            this.windowRef.dragEnd$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
                this.dragEnd.emit();
            });
            this.windowRef.dragStart$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
                this.dragStart.emit();
            });
        });
    }

    public ngOnDestroy(): void {
        this.windowRef?.close();
    }
}
