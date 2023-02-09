import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { asapScheduler, Subject, takeUntil } from "rxjs";
import { WindowService } from "../../services/window.service";
import { WindowTitleTemplateDirective } from "../../directives/window-title-template.directive";
import { WindowRef, WindowReference } from "../../models/WindowRef";

@Component({
    selector: "mona-window",
    templateUrl: "./window.component.html",
    styleUrls: ["./window.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly componentDestroy$: Subject<void> = new Subject<void>();
    private windowRef!: WindowRef;

    @Input()
    public draggable?: boolean;

    @Input()
    public focusedElement?: HTMLElement | ElementRef<HTMLElement> | string;

    @Input()
    public height?: number;

    @Output()
    public heightChange: EventEmitter<number> = new EventEmitter<number>();

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
    public width?: number;

    @Output()
    public widthChange: EventEmitter<number> = new EventEmitter<number>();

    @ViewChild("windowTemplate")
    public windowTemplate!: TemplateRef<void>;

    public constructor(private readonly windowService: WindowService) {}

    public ngAfterViewInit(): void {
        asapScheduler.schedule(() => {
            this.windowRef = this.windowService.open({
                content: this.windowTemplate,
                draggable: this.draggable,
                focusedElement: this.focusedElement,
                height: this.height,
                maxHeight: this.maxHeight,
                maxWidth: this.maxWidth,
                minHeight: this.minHeight,
                minWidth: this.minWidth,
                modal: this.modal,
                resizable: this.resizable,
                title: this.titleTemplateDirective?.templateRef ?? this.title,
                width: this.width
            });
            this.windowRef.resized$.pipe(takeUntil(this.componentDestroy$)).subscribe(event => {
                if (event.width != null) {
                    this.widthChange.emit(event.width);
                }
                if (event.height != null) {
                    this.heightChange.emit(event.height);
                }
            });
        });
    }

    public ngOnDestroy(): void {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.windowRef.close();
    }

    public ngOnInit(): void {}
}
