import { AfterViewInit, ComponentRef, ElementRef, Injector, OnInit, ViewContainerRef } from "@angular/core";
import { WindowInjectorData } from "../../models/WindowInjectorData";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import * as i0 from "@angular/core";
export declare class WindowContentComponent implements OnInit, AfterViewInit {
    private injector;
    windowData: WindowInjectorData;
    private readonly elementRef;
    readonly closeIcon: IconDefinition;
    readonly componentRef?: ComponentRef<any>;
    readonly contentType: "template" | "component";
    componentAnchor: ViewContainerRef;
    constructor(injector: Injector, windowData: WindowInjectorData, elementRef: ElementRef<HTMLElement>);
    ngAfterViewInit(): void;
    ngOnInit(): void;
    onCloseClick(event: MouseEvent): void;
    private focusElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<WindowContentComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WindowContentComponent, "mona-window-content", never, {}, {}, never, never, false, never>;
}
