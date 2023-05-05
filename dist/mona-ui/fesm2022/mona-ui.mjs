import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Directive, Host, Optional, HostBinding, Input, Output, NgModule, QueryList, Component, ContentChildren, TemplateRef, InjectionToken, Injector, Inject, ViewChildren, ViewChild, ContentChild, ElementRef, ChangeDetectionStrategy, Pipe, forwardRef, SkipSelf, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject, fromEvent, takeUntil, take, interval, delay, debounceTime, map, of, distinctUntilChanged, timer, asyncScheduler, tap, filter, mergeWith, asapScheduler, switchMap } from 'rxjs';
import { v4 } from 'uuid';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import { faStar, faChevronDown, faChevronRight, faChevronLeft, faCalendar, faClock, faChevronUp, faTimes, faSearch, faEllipsis, faAngleDoubleLeft, faAngleDoubleRight, faAngleRight, faAngleLeft, faFilter, faArrowUpLong, faArrowDownLong, faMinus, faPlus, faCaretRight, faCaretLeft, faEllipsisV, faCaretDown, faCaretUp, faEllipsisH, faXmark, faArrowDown, faArrowUp, faClose } from '@fortawesome/free-solid-svg-icons';
import * as i1$2 from '@angular/cdk/a11y';
import { ActiveDescendantKeyManager, A11yModule } from '@angular/cdk/a11y';
import { TemplatePortal, ComponentPortal } from '@angular/cdk/portal';
import * as i1$1 from '@angular/cdk/overlay';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { Dictionary, Enumerable, List, Group, Enumerator, EnumerableSet, KeyValuePair, IndexableList, Collections, SortedSet } from '@mirei/ts-collections';
import * as i5 from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DateTime } from 'luxon';
import * as i5$1 from '@angular/forms';
import { NG_VALUE_ACCESSOR, FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import * as i5$2 from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { trigger, transition, style, animate, state } from '@angular/animations';

class ButtonService {
    static { this.ID = v4(); }
    constructor() {
        this.buttonClick$ = new ReplaySubject(1);
        this.buttonSelect$ = new Subject();
        this.buttonSelected$ = new Subject();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class ButtonDirective {
    #selected;
    set selected(selected) {
        this.#selected = selected;
        this.buttonService?.buttonSelected$.next(this);
    }
    get selected() {
        return this.#selected;
    }
    constructor(buttonService, elementRef) {
        this.buttonService = buttonService;
        this.elementRef = elementRef;
        this.#selected = false;
        this.destroy$ = new Subject();
        this.disabled = false;
        this.flat = false;
        this.primary = false;
        this.selectedChange = new EventEmitter();
        this.toggleable = false;
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngOnInit() {
        if (this.toggleable) {
            fromEvent(this.elementRef.nativeElement, "click")
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                if (this.buttonService) {
                    this.buttonService.buttonClick$.next(this);
                }
                else {
                    this.selected = !this.selected;
                    this.selectedChange.emit(this.selected);
                }
            });
        }
        this.buttonService?.buttonSelect$.pipe(takeUntil(this.destroy$)).subscribe(result => {
            const [button, selected] = result;
            if (button === this) {
                this.#selected = selected;
                this.selectedChange.emit(selected);
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonDirective, deps: [{ token: ButtonService, host: true, optional: true }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ButtonDirective, selector: "[monaButton]", inputs: { disabled: "disabled", flat: "flat", primary: "primary", selected: "selected", toggleable: "toggleable" }, outputs: { selectedChange: "selectedChange" }, host: { properties: { "class.mona-disabled": "this.disabled", "class.mona-flat": "this.flat", "class.mona-primary": "this.primary", "class.mona-selected": "this.selected" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaButton]"
                }]
        }], ctorParameters: function () { return [{ type: ButtonService, decorators: [{
                    type: Host
                }, {
                    type: Optional
                }] }, { type: i0.ElementRef }]; }, propDecorators: { disabled: [{
                type: HostBinding,
                args: ["class.mona-disabled"]
            }, {
                type: Input
            }], flat: [{
                type: HostBinding,
                args: ["class.mona-flat"]
            }, {
                type: Input
            }], primary: [{
                type: HostBinding,
                args: ["class.mona-primary"]
            }, {
                type: Input
            }], selected: [{
                type: HostBinding,
                args: ["class.mona-selected"]
            }, {
                type: Input
            }], selectedChange: [{
                type: Output
            }], toggleable: [{
                type: Input
            }] } });

class ButtonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ButtonModule, declarations: [ButtonDirective], imports: [CommonModule], exports: [ButtonDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ButtonDirective],
                    imports: [CommonModule],
                    exports: [ButtonDirective]
                }]
        }] });

class ButtonGroupComponent {
    #disabled;
    set disabled(disabled) {
        this.#disabled = disabled;
        this.notifyDisableStateChanged();
    }
    get disabled() {
        return this.#disabled;
    }
    set selection(selection) {
        this.selectionMode = selection;
    }
    constructor(buttonService) {
        this.buttonService = buttonService;
        this.#disabled = false;
        this.componentDestroy$ = new Subject();
        this.selectionMode = "multiple";
        this.buttons = new QueryList();
    }
    ngAfterContentInit() {
        this.notifyDisableStateChanged();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.notifySelectionStateChange();
    }
    notifyDisableStateChanged() {
        this.buttons.forEach(b => (b.disabled = this.#disabled));
    }
    notifySelectionStateChange() {
        this.buttonService.buttonClick$.pipe(takeUntil(this.componentDestroy$)).subscribe(button => {
            if (this.selectionMode === "single") {
                this.buttons.forEach(b => {
                    this.buttonService.buttonSelect$.next([b, b === button ? !b.selected : false]);
                });
            }
            else {
                this.buttonService.buttonSelect$.next([button, !button.selected]);
            }
        });
        this.buttonService.buttonSelected$.pipe(takeUntil(this.componentDestroy$)).subscribe(button => {
            if (this.selectionMode === "single") {
                if (button.selected) {
                    this.buttons.forEach(b => {
                        if (b !== button) {
                            this.buttonService.buttonSelect$.next([b, false]);
                        }
                    });
                }
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupComponent, deps: [{ token: ButtonService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ButtonGroupComponent, selector: "mona-button-group", inputs: { disabled: "disabled", selection: "selection" }, providers: [ButtonService], queries: [{ propertyName: "buttons", predicate: ButtonDirective }], ngImport: i0, template: "<div class=\"mona-button-group\">\n    <ng-content select=\"button[monaButton]\"></ng-content>\n</div>\n", styles: ["div.mona-button-group{display:flex}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-button-group", providers: [ButtonService], template: "<div class=\"mona-button-group\">\n    <ng-content select=\"button[monaButton]\"></ng-content>\n</div>\n", styles: ["div.mona-button-group{display:flex}\n"] }]
        }], ctorParameters: function () { return [{ type: ButtonService }]; }, propDecorators: { buttons: [{
                type: ContentChildren,
                args: [ButtonDirective]
            }], disabled: [{
                type: Input
            }], selection: [{
                type: Input
            }] } });

class ButtonGroupModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupModule, declarations: [ButtonGroupComponent], imports: [CommonModule], exports: [ButtonGroupComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonGroupModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ButtonGroupComponent],
                    imports: [CommonModule],
                    exports: [ButtonGroupComponent]
                }]
        }] });

class ChipComponent {
    constructor() {
        this.disabled = false;
        this.label = "";
        this.removable = false;
        this.remove = new EventEmitter();
        this.tabindex = 0;
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ChipComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ChipComponent, selector: "mona-chip", inputs: { disabled: "disabled", label: "label", removable: "removable", tabindex: "tabindex" }, outputs: { remove: "remove" }, ngImport: i0, template: "<div class=\"mona-chip\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : tabindex\">\n    <div></div>\n    <div class=\"mona-chip-content\">\n        <span class=\"mona-chip-label\">{{label}}</span>\n        <ng-container *ngIf=\"!label\">\n            <ng-content></ng-content>\n        </ng-container>\n    </div>\n    <div class=\"mona-chip-close\" (click)=\"remove.emit($event)\" *ngIf=\"removable\">\n        <span class=\"mona-chip-close-icon\">\u2A2F</span>\n    </div>\n</div>\n", styles: ["div.mona-chip{display:flex;height:calc(var(--mona-input-height) - 4px);cursor:pointer;-webkit-user-select:none;user-select:none;outline:none;box-sizing:content-box}div.mona-chip-content{flex:1;display:flex;align-items:center;justify-content:flex-start;padding:0 8px}div.mona-chip-close{display:flex;align-items:center;justify-content:center;height:100%;width:calc(var(--mona-input-height) - 2px);padding:5px}span.mona-chip-close-icon{font-weight:700;font-size:15px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ChipComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-chip", template: "<div class=\"mona-chip\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : tabindex\">\n    <div></div>\n    <div class=\"mona-chip-content\">\n        <span class=\"mona-chip-label\">{{label}}</span>\n        <ng-container *ngIf=\"!label\">\n            <ng-content></ng-content>\n        </ng-container>\n    </div>\n    <div class=\"mona-chip-close\" (click)=\"remove.emit($event)\" *ngIf=\"removable\">\n        <span class=\"mona-chip-close-icon\">\u2A2F</span>\n    </div>\n</div>\n", styles: ["div.mona-chip{display:flex;height:calc(var(--mona-input-height) - 4px);cursor:pointer;-webkit-user-select:none;user-select:none;outline:none;box-sizing:content-box}div.mona-chip-content{flex:1;display:flex;align-items:center;justify-content:flex-start;padding:0 8px}div.mona-chip-close{display:flex;align-items:center;justify-content:center;height:100%;width:calc(var(--mona-input-height) - 2px);padding:5px}span.mona-chip-close-icon{font-weight:700;font-size:15px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { disabled: [{
                type: Input
            }], label: [{
                type: Input
            }], removable: [{
                type: Input
            }], remove: [{
                type: Output
            }], tabindex: [{
                type: Input
            }] } });

class ChipModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ChipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ChipModule, declarations: [ChipComponent], imports: [CommonModule], exports: [ChipComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ChipModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ChipModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ChipComponent],
                    imports: [CommonModule],
                    exports: [ChipComponent]
                }]
        }] });

class SplitButtonTextTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonTextTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: SplitButtonTextTemplateDirective, selector: "ng-template[monaSplitButtonTextTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonTextTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaSplitButtonTextTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class MenuItemTextTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemTextTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MenuItemTextTemplateDirective, selector: "ng-template[monaMenuItemTextTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemTextTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaMenuItemTextTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class MenuItemIconTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemIconTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MenuItemIconTemplateDirective, selector: "ng-template[monaMenuItemIconTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemIconTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaMenuItemIconTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class MenuItemComponent {
    set data(data) {
        this.menuItem.data = data;
    }
    set disabled(disabled) {
        this.menuItem.disabled = disabled;
    }
    set divider(divider) {
        this.menuItem.divider = divider;
    }
    set iconClass(iconClass) {
        this.menuItem.iconClass = iconClass;
    }
    set text(text) {
        this.menuItem.text = text;
    }
    set visible(visible) {
        this.menuItem.visible = visible;
    }
    constructor() {
        this.componentDestroy$ = new Subject();
        this.menuItem = {
            disabled: false,
            divider: false,
            parent: null,
            subMenuItems: [],
            text: "",
            visible: true
        };
        this.iconTemplate = new QueryList();
        this.menuClick = new EventEmitter();
        this.submenuItems = new QueryList();
        this.textTemplate = new QueryList();
    }
    getMenuItem() {
        return this.getMenuItemWithDepth(0);
    }
    ngAfterContentInit() {
        this.submenuItems.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.menuItem.subMenuItems = this.submenuItems.map(si => si.getMenuItem());
        });
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.unsubscribe();
    }
    ngOnInit() { }
    getMenuItemWithDepth(depth = 0) {
        this.menuItem.iconTemplate = this.iconTemplate.get(0);
        this.menuItem.menuClick = () => this.menuClick.emit();
        this.menuItem.subMenuItems = this.submenuItems.map(si => {
            const subMenuItem = si.getMenuItemWithDepth(depth + 1);
            subMenuItem.parent = this.menuItem;
            return subMenuItem;
        });
        this.menuItem.depth = depth;
        this.menuItem.textTemplate = this.textTemplate.get(0);
        return this.menuItem;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MenuItemComponent, selector: "mona-menu-item", inputs: { data: "data", disabled: "disabled", divider: "divider", iconClass: "iconClass", text: "text", visible: "visible" }, outputs: { menuClick: "menuClick" }, queries: [{ propertyName: "iconTemplate", predicate: MenuItemIconTemplateDirective, read: TemplateRef }, { propertyName: "submenuItems", predicate: MenuItemComponent }, { propertyName: "textTemplate", predicate: MenuItemTextTemplateDirective, read: TemplateRef }], ngImport: i0, template: "", isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuItemComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-menu-item", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { data: [{
                type: Input
            }], disabled: [{
                type: Input
            }], divider: [{
                type: Input
            }], iconClass: [{
                type: Input
            }], iconTemplate: [{
                type: ContentChildren,
                args: [MenuItemIconTemplateDirective, { read: TemplateRef, descendants: false }]
            }], menuClick: [{
                type: Output
            }], submenuItems: [{
                type: ContentChildren,
                args: [MenuItemComponent]
            }], text: [{
                type: Input
            }], textTemplate: [{
                type: ContentChildren,
                args: [MenuItemTextTemplateDirective, { read: TemplateRef, descendants: false }]
            }], visible: [{
                type: Input
            }] } });

const PopupInjectionToken = new InjectionToken("PopupInjectionToken");

class ContextMenuItemComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.starIcon = faStar;
        this.iconSpaceVisible = false;
        this.linkSpaceVisible = false;
    }
    ngOnDestroy() {
        this.submenuPopupRef?.close();
    }
    ngOnInit() { }
    setActiveStyles() { }
    setInactiveStyles() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuItemComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ContextMenuItemComponent, selector: "mona-contextmenu-item", inputs: { iconSpaceVisible: "iconSpaceVisible", linkSpaceVisible: "linkSpaceVisible", menuItem: "menuItem", submenuPopupRef: "submenuPopupRef" }, ngImport: i0, template: "<div class=\"mona-contextmenu-item\" *ngIf=\"!menuItem.divider\">\n    <div class=\"mona-contextmenu-item-icon\" *ngIf=\"iconSpaceVisible\">\n        <span [ngClass]=\"menuItem.iconClass\" *ngIf=\"menuItem.iconClass && !menuItem.iconTemplate\"></span>\n        <ng-container [ngTemplateOutlet]=\"menuItem?.iconTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: menuItem}\"\n                      *ngIf=\"menuItem?.iconTemplate\"></ng-container>\n    </div>\n    <div class=\"mona-contextmenu-item-text\" [ngClass]=\"{'icon-visible': iconSpaceVisible}\">\n        <span *ngIf=\"!menuItem?.textTemplate\">{{menuItem.text}}</span>\n        <ng-container [ngTemplateOutlet]=\"menuItem?.textTemplate ?? null\"\n                      [ngTemplateOutletContext]=\"{$implicit: menuItem}\"\n                      *ngIf=\"menuItem?.textTemplate\"></ng-container>\n    </div>\n    <div class=\"mona-contextmenu-item-link\" *ngIf=\"linkSpaceVisible\">\n        <span *ngIf=\"menuItem.subMenuItems && menuItem.subMenuItems.length !== 0\">&rsaquo;</span>\n    </div>\n</div>\n\n<span *ngIf=\"menuItem.divider\" class=\"divider\"></span>\n", styles: ["div.mona-contextmenu-item{width:100%;height:100%;display:flex;align-items:center}div.mona-contextmenu-item-icon{width:var(--mona-input-height);height:100%;display:flex;align-items:center;justify-content:center}div.mona-contextmenu-item-text{padding:0 10px;flex:1}div.mona-contextmenu-item-text.icon-visible{padding-left:0}div.mona-contextmenu-item-link{width:calc(var(--mona-input-height) / 2);height:100%;display:flex;align-items:center;justify-content:center}div.mona-contextmenu-item-link>span{font-size:22px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;margin-top:-2px;margin-left:-5px}span.divider{display:block;height:1px;width:100%;margin:4px 0;color:var(--mona-border-color);border-top:1px solid var(--mona-border-color)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuItemComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-contextmenu-item", template: "<div class=\"mona-contextmenu-item\" *ngIf=\"!menuItem.divider\">\n    <div class=\"mona-contextmenu-item-icon\" *ngIf=\"iconSpaceVisible\">\n        <span [ngClass]=\"menuItem.iconClass\" *ngIf=\"menuItem.iconClass && !menuItem.iconTemplate\"></span>\n        <ng-container [ngTemplateOutlet]=\"menuItem?.iconTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: menuItem}\"\n                      *ngIf=\"menuItem?.iconTemplate\"></ng-container>\n    </div>\n    <div class=\"mona-contextmenu-item-text\" [ngClass]=\"{'icon-visible': iconSpaceVisible}\">\n        <span *ngIf=\"!menuItem?.textTemplate\">{{menuItem.text}}</span>\n        <ng-container [ngTemplateOutlet]=\"menuItem?.textTemplate ?? null\"\n                      [ngTemplateOutletContext]=\"{$implicit: menuItem}\"\n                      *ngIf=\"menuItem?.textTemplate\"></ng-container>\n    </div>\n    <div class=\"mona-contextmenu-item-link\" *ngIf=\"linkSpaceVisible\">\n        <span *ngIf=\"menuItem.subMenuItems && menuItem.subMenuItems.length !== 0\">&rsaquo;</span>\n    </div>\n</div>\n\n<span *ngIf=\"menuItem.divider\" class=\"divider\"></span>\n", styles: ["div.mona-contextmenu-item{width:100%;height:100%;display:flex;align-items:center}div.mona-contextmenu-item-icon{width:var(--mona-input-height);height:100%;display:flex;align-items:center;justify-content:center}div.mona-contextmenu-item-text{padding:0 10px;flex:1}div.mona-contextmenu-item-text.icon-visible{padding-left:0}div.mona-contextmenu-item-link{width:calc(var(--mona-input-height) / 2);height:100%;display:flex;align-items:center;justify-content:center}div.mona-contextmenu-item-link>span{font-size:22px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;margin-top:-2px;margin-left:-5px}span.divider{display:block;height:1px;width:100%;margin:4px 0;color:var(--mona-border-color);border-top:1px solid var(--mona-border-color)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { iconSpaceVisible: [{
                type: Input
            }], linkSpaceVisible: [{
                type: Input
            }], menuItem: [{
                type: Input
            }], submenuPopupRef: [{
                type: Input
            }] } });

class PopupRef {
    #options;
    constructor(options) {
        this.#options = options;
    }
    close(result) {
        this.#options.close(result);
    }
    get closed() {
        return this.#options.closed$;
    }
    get component() {
        return this.#options.component;
    }
    get overlayRef() {
        return this.#options.overlayRef;
    }
}

const DefaultPositions = [
    new ConnectionPositionPair({ originX: "start", originY: "bottom" }, { overlayX: "start", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "start", overlayY: "bottom" }),
    new ConnectionPositionPair({ originX: "end", originY: "top" }, { overlayX: "end", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "end", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "end", originY: "top" }, { overlayX: "start", overlayY: "top" }),
    new ConnectionPositionPair({ originX: "end", originY: "center" }, { overlayX: "start", overlayY: "center" }),
    new ConnectionPositionPair({ originX: "start", originY: "center" }, { overlayX: "end", overlayY: "center" })
];

class PreventableEvent {
    #event;
    #type;
    #defaultPrevented;
    constructor(type, event) {
        this.#defaultPrevented = false;
        this.#type = type;
        this.#event = event;
    }
    isDefaultPrevented() {
        return this.#defaultPrevented;
    }
    preventDefault() {
        this.#defaultPrevented = true;
    }
    get originalEvent() {
        return this.#event;
    }
    get type() {
        return this.#type;
    }
}

class PopupCloseEvent extends PreventableEvent {
    constructor(options) {
        super(options?.type ?? "popupClose", options?.event);
        this.options = options;
    }
    get result() {
        return this.options?.result;
    }
    get via() {
        return this.options?.via;
    }
}
var PopupCloseSource;
(function (PopupCloseSource) {
    PopupCloseSource["BackdropClick"] = "backdropClick";
    PopupCloseSource["CloseButton"] = "closeButton";
    PopupCloseSource["Escape"] = "escape";
    PopupCloseSource["Programmatic"] = "programmatic";
    PopupCloseSource["OutsideClick"] = "outsideClick";
})(PopupCloseSource || (PopupCloseSource = {}));

/**
 * @internal - used by the popup service. Do not use directly or export.
 */
class PopupReference {
    constructor(overlayReference) {
        this.overlayReference = overlayReference;
        this.closed$ = new Subject();
    }
    close(result) {
        const event = result instanceof PopupCloseEvent
            ? result
            : new PopupCloseEvent({ result, via: PopupCloseSource.Programmatic });
        this.overlayRef.dispose();
        this.closed$.next(event);
        this.closed$.complete();
    }
    get closed() {
        return this.closed$.asObservable();
    }
    get component() {
        return this.componentRef ?? null;
    }
    get overlayRef() {
        return this.overlayReference;
    }
    get popupRef() {
        return new PopupRef(this);
    }
}

class PopupService {
    constructor(injector, overlay, rendererFactory, zone) {
        this.injector = injector;
        this.overlay = overlay;
        this.rendererFactory = rendererFactory;
        this.zone = zone;
        this.outsideEventsToClose = ["click", "mousedown", "dblclick", "contextmenu", "auxclick"];
        this.popupStateMap = new Dictionary();
        this.serviceDestroy$ = new Subject();
        this.renderer = rendererFactory.createRenderer(null, null);
    }
    create(settings) {
        const uid = v4();
        let positionStrategy;
        if (settings.positionStrategy === "global") {
            positionStrategy = this.overlay.position().global();
        }
        else {
            positionStrategy = this.overlay
                .position()
                .flexibleConnectedTo(settings.anchor)
                .withPositions(settings.positions ?? DefaultPositions)
                .withDefaultOffsetX(settings.offset?.horizontal ?? 0)
                .withDefaultOffsetY(settings.offset?.vertical ?? 0)
                .withPush(settings.withPush ?? true);
        }
        const panelClass = settings.popupClass
            ? ["mona-popup-content"].concat(settings.popupClass)
            : "mona-popup-content";
        const overlayRef = this.overlay.create({
            positionStrategy,
            hasBackdrop: settings.hasBackdrop ?? true,
            height: settings.height,
            maxHeight: settings.maxHeight,
            maxWidth: settings.maxWidth,
            minHeight: settings.minHeight,
            minWidth: settings.minWidth,
            width: settings.width,
            panelClass,
            backdropClass: settings.backdropClass ?? "transparent"
        });
        const preventClose = settings.preventClose;
        const popupReference = new PopupReference(overlayRef);
        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: PopupRef, useFactory: () => popupReference.popupRef },
                { provide: PopupInjectionToken, useValue: settings.data },
                ...(settings.providers ?? [])
            ]
        });
        let portal;
        if (settings.content instanceof TemplateRef) {
            portal = new TemplatePortal(settings.content, PopupService.popupAnchorDirective.viewContainerRef, null, injector);
            overlayRef.attach(portal);
        }
        else {
            portal = new ComponentPortal(settings.content, PopupService.popupAnchorDirective.viewContainerRef, injector);
            popupReference.componentRef = overlayRef.attach(portal);
        }
        if (settings.hasBackdrop) {
            if (settings.closeOnBackdropClick ?? true) {
                const backdropSubject = new Subject();
                const subscription = overlayRef
                    .backdropClick()
                    .pipe(takeUntil(backdropSubject))
                    .subscribe(e => {
                    const event = new PopupCloseEvent({ event: e, via: PopupCloseSource.BackdropClick });
                    const prevented = preventClose ? preventClose(event) || event.isDefaultPrevented() : false;
                    if (!prevented) {
                        popupReference.close(event);
                        this.popupStateMap.remove(uid);
                        backdropSubject.next();
                        backdropSubject.complete();
                    }
                });
                popupReference.closed.pipe(take(1)).subscribe(() => subscription.unsubscribe());
            }
        }
        else {
            if (settings.closeOnOutsideClick ?? true) {
                const subscription = overlayRef
                    .outsidePointerEvents()
                    .pipe(takeUntil(this.serviceDestroy$))
                    .subscribe(event => {
                    if (this.outsideEventsToClose.includes(event.type)) {
                        const closeEvent = new PopupCloseEvent({ event, via: PopupCloseSource.OutsideClick });
                        const prevented = preventClose
                            ? preventClose(closeEvent) || closeEvent.isDefaultPrevented()
                            : false;
                        if (!prevented) {
                            popupReference.close(closeEvent);
                            this.popupStateMap.remove(uid);
                            subscription.unsubscribe();
                        }
                    }
                });
                popupReference.closed.pipe(take(1)).subscribe(() => subscription.unsubscribe());
            }
        }
        popupReference.closed.pipe(take(1)).subscribe(() => {
            this.popupStateMap.remove(uid);
        });
        this.popupStateMap.add(uid, {
            uid,
            popupRef: popupReference.popupRef,
            settings
        });
        this.setEventListeners(this.popupStateMap.get(uid));
        return popupReference.popupRef;
    }
    ngOnDestroy() {
        this.serviceDestroy$.next();
        this.serviceDestroy$.complete();
    }
    setEventListeners(state) {
        this.zone.runOutsideAngular(() => {
            if (state.settings.closeOnEscape ?? true) {
                fromEvent(document, "keydown")
                    .pipe(takeUntil(state.popupRef.closed))
                    .subscribe(event => {
                    if (event.key === "Escape") {
                        const closeEvent = new PopupCloseEvent({ event, via: PopupCloseSource.Escape });
                        const prevented = state.settings.preventClose
                            ? state.settings.preventClose(closeEvent) || closeEvent.isDefaultPrevented()
                            : false;
                        if (!prevented) {
                            this.zone.run(() => {
                                state.popupRef.close(closeEvent);
                                this.popupStateMap.remove(state.uid);
                            });
                        }
                    }
                });
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupService, deps: [{ token: i0.Injector }, { token: i1$1.Overlay }, { token: i0.RendererFactory2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupService, providedIn: "root" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root"
                }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: i1$1.Overlay }, { type: i0.RendererFactory2 }, { type: i0.NgZone }]; } });

class ContextMenuService {
    constructor(popupService) {
        this.popupService = popupService;
        this.defaultSubMenuPositions = [
            {
                originX: "end",
                originY: "top",
                overlayX: "start",
                overlayY: "top"
            },
            {
                originX: "start",
                originY: "top",
                overlayX: "end",
                overlayY: "top"
            },
            {
                originX: "end",
                originY: "bottom",
                overlayX: "start",
                overlayY: "bottom"
            },
            {
                originX: "start",
                originY: "bottom",
                overlayX: "end",
                overlayY: "bottom"
            }
        ];
    }
    open(settings) {
        return this.popupService.create({
            ...settings,
            hasBackdrop: false
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuService, deps: [{ token: PopupService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuService, providedIn: "root" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root"
                }]
        }], ctorParameters: function () { return [{ type: PopupService }]; } });

class ContextMenuContentComponent {
    constructor(cdr, contextMenuData, contextMenuService, elementRef, renderer, zone) {
        this.cdr = cdr;
        this.contextMenuData = contextMenuData;
        this.contextMenuService = contextMenuService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.zone = zone;
        this.contextMenuInjectorData = { isRoot: false };
        this.activeItemIndex = -1;
        this.currentMenuItem = null;
        this.iconSpaceVisible = false;
        this.linkSpaceVisible = false;
        this.menuPopupRef = null;
        this.contextMenuItemComponents = new QueryList();
    }
    ngAfterViewInit() {
        this.keyManager = new ActiveDescendantKeyManager(this.contextMenuItemComponents)
            .withWrap()
            .skipPredicate(mi => !!mi.menuItem.disabled || !!mi.menuItem.divider);
        this.setEventListeners();
        this.focus();
        if (!this.contextMenuData.isRoot && this.contextMenuData.viaKeyboard) {
            this.keyManager.setFirstItemActive();
            this.cdr.detectChanges();
        }
    }
    ngOnDestroy() { }
    ngOnInit() {
        this.iconSpaceVisible = this.contextMenuData.menuItems.some(mi => mi.iconClass || mi.iconTemplate);
        this.linkSpaceVisible = this.contextMenuData.menuItems.some(mi => mi.subMenuItems && mi.subMenuItems.length > 0);
    }
    onListItemClick(event, menuItem) {
        if (menuItem.disabled || menuItem.divider || (menuItem.subMenuItems && menuItem.subMenuItems.length > 0)) {
            return;
        }
        menuItem.menuClick?.();
        this.contextMenuData.menuClick?.next(menuItem);
    }
    onListItemMouseEnter(event, menuItem) {
        this.currentMenuItem = menuItem;
        this.menuPopupRef?.close();
        if (this.currentMenuItem.subMenuItems && this.currentMenuItem.subMenuItems.length > 0) {
            this.create(event.target, this.currentMenuItem);
        }
    }
    create(anchor, menuItem, viaKeyboard) {
        this.contextMenuInjectorData.menuItems = menuItem.subMenuItems;
        this.contextMenuInjectorData.menuClick = this.contextMenuData.menuClick;
        this.contextMenuInjectorData.navigate = this.contextMenuData.navigate;
        const popupClasses = this.contextMenuData.popupClass
            ? Array.isArray(this.contextMenuData.popupClass)
                ? this.contextMenuData.popupClass
                : [this.contextMenuData.popupClass]
            : [];
        this.contextMenuInjectorData.popupClass = popupClasses;
        this.menuPopupRef = this.contextMenuService.open({
            anchor,
            closeOnOutsideClick: true,
            content: ContextMenuContentComponent,
            data: this.contextMenuInjectorData,
            positions: this.contextMenuService.defaultSubMenuPositions,
            popupClass: ["mona-contextmenu-content", ...popupClasses]
        });
        this.contextMenuInjectorData.parentMenuRef = this.menuPopupRef;
        this.contextMenuInjectorData.viaKeyboard = viaKeyboard;
        this.contextMenuInjectorData.subMenuClose = new Subject();
        if (this.contextMenuData.parentMenuRef) {
            const subscription = this.contextMenuData.parentMenuRef.closed.subscribe(() => {
                this.menuPopupRef?.close();
                subscription.unsubscribe();
            });
        }
        this.contextMenuInjectorData.subMenuClose.subscribe(() => {
            this.focus();
        });
    }
    focus() {
        const listElement = this.elementRef.nativeElement.querySelector("ul:first-child");
        listElement?.focus();
    }
    setEventListeners() {
        this.zone.runOutsideAngular(() => {
            this.renderer.listen(this.elementRef.nativeElement, "keydown", (event) => {
                this.activeItemIndex = this.keyManager.activeItemIndex ?? -1;
                switch (event.key) {
                    case "ArrowDown":
                    case "ArrowUp":
                        this.zone.run(() => {
                            const previousItem = this.keyManager.activeItem;
                            this.keyManager.onKeydown(event);
                            if (this.keyManager.activeItem !== previousItem) {
                                this.contextMenuData.navigate.emit({
                                    previousItem: previousItem?.menuItem ?? null,
                                    currentItem: this.keyManager.activeItem?.menuItem ?? null,
                                    direction: event.key === "ArrowDown" ? "down" : "up"
                                });
                            }
                        });
                        break;
                    case "Enter":
                    case " ":
                        if (this.keyManager.activeItem?.menuItem) {
                            if (this.keyManager.activeItem.menuItem.subMenuItems &&
                                this.keyManager.activeItem.menuItem.subMenuItems.length > 0) {
                                return;
                            }
                            this.zone.run(() => {
                                if (this.keyManager.activeItem) {
                                    this.keyManager.activeItem.menuItem.menuClick?.();
                                    this.contextMenuData.menuClick?.next(this.keyManager.activeItem.menuItem);
                                }
                            });
                        }
                        break;
                    case "ArrowRight":
                        if (this.keyManager.activeItem?.menuItem &&
                            this.keyManager.activeItem.menuItem.subMenuItems &&
                            this.keyManager.activeItem.menuItem.subMenuItems.length > 0) {
                            this.zone.run(() => {
                                this.menuPopupRef?.close();
                                const previousItem = this.keyManager.activeItem;
                                if (this.keyManager.activeItem) {
                                    this.create(this.keyManager.activeItem.elementRef.nativeElement, this.keyManager.activeItem.menuItem, true);
                                }
                                this.contextMenuData.navigate.emit({
                                    previousItem: previousItem?.menuItem ?? null,
                                    currentItem: this.keyManager.activeItem?.menuItem.subMenuItems?.find(mi => !mi.disabled && !mi.divider) ?? null,
                                    direction: "right"
                                });
                            });
                        }
                        else {
                            this.zone.run(() => {
                                this.contextMenuData.navigate.emit({
                                    previousItem: this.keyManager.activeItem?.menuItem ?? null,
                                    currentItem: null,
                                    direction: "right"
                                });
                            });
                        }
                        break;
                    case "ArrowLeft":
                        this.zone.run(() => {
                            if (!this.contextMenuData.isRoot) {
                                this.contextMenuData.parentMenuRef?.close();
                                this.contextMenuData.subMenuClose?.next();
                                this.contextMenuData.navigate.emit({
                                    previousItem: this.keyManager.activeItem?.menuItem ?? null,
                                    currentItem: this.keyManager.activeItem?.menuItem.parent ?? null,
                                    direction: "left"
                                });
                            }
                            else {
                                this.contextMenuData.navigate.emit({
                                    previousItem: this.keyManager.activeItem?.menuItem ?? null,
                                    currentItem: null,
                                    direction: "left"
                                });
                            }
                        });
                        break;
                }
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuContentComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: PopupInjectionToken }, { token: ContextMenuService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ContextMenuContentComponent, selector: "mona-contextmenu-content", viewQueries: [{ propertyName: "contextMenuItemComponents", predicate: ContextMenuItemComponent, descendants: true }], ngImport: i0, template: "<ul class=\"mona-contextmenu-list\" tabindex=\"0\">\n    <ng-container *ngFor=\"let menuItem of contextMenuData.menuItems; let mx = index;\">\n        <li class=\"mona-contextmenu-list-item\"\n            [ngClass]=\"{'mona-disabled': menuItem.disabled, 'divider': menuItem.divider, 'mona-focused': keyManager?.activeItem?.menuItem === menuItem}\"\n            (mouseenter)=\"onListItemMouseEnter($event, menuItem)\"\n            (click)=\"onListItemClick($event, menuItem)\" *ngIf=\"menuItem.visible\">\n            <mona-contextmenu-item [menuItem]=\"menuItem\" [iconSpaceVisible]=\"iconSpaceVisible\" [linkSpaceVisible]=\"linkSpaceVisible\"\n                                   [submenuPopupRef]=\"menuPopupRef\" [attr.tabindex]=\"0\" *ngIf=\"menuItem.visible\"></mona-contextmenu-item>\n        </li>\n    </ng-container>\n</ul>\n", styles: [":host{width:100%}ul{width:100%;list-style:none;outline:none}ul li{height:calc(var(--mona-input-height) - 4px)}ul li.divider{height:auto;pointer-events:none}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: ContextMenuItemComponent, selector: "mona-contextmenu-item", inputs: ["iconSpaceVisible", "linkSpaceVisible", "menuItem", "submenuPopupRef"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuContentComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-contextmenu-content", template: "<ul class=\"mona-contextmenu-list\" tabindex=\"0\">\n    <ng-container *ngFor=\"let menuItem of contextMenuData.menuItems; let mx = index;\">\n        <li class=\"mona-contextmenu-list-item\"\n            [ngClass]=\"{'mona-disabled': menuItem.disabled, 'divider': menuItem.divider, 'mona-focused': keyManager?.activeItem?.menuItem === menuItem}\"\n            (mouseenter)=\"onListItemMouseEnter($event, menuItem)\"\n            (click)=\"onListItemClick($event, menuItem)\" *ngIf=\"menuItem.visible\">\n            <mona-contextmenu-item [menuItem]=\"menuItem\" [iconSpaceVisible]=\"iconSpaceVisible\" [linkSpaceVisible]=\"linkSpaceVisible\"\n                                   [submenuPopupRef]=\"menuPopupRef\" [attr.tabindex]=\"0\" *ngIf=\"menuItem.visible\"></mona-contextmenu-item>\n        </li>\n    </ng-container>\n</ul>\n", styles: [":host{width:100%}ul{width:100%;list-style:none;outline:none}ul li{height:calc(var(--mona-input-height) - 4px)}ul li.divider{height:auto;pointer-events:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PopupInjectionToken]
                }] }, { type: ContextMenuService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { contextMenuItemComponents: [{
                type: ViewChildren,
                args: [ContextMenuItemComponent]
            }] } });

class ContextMenuComponent {
    constructor(contextMenuService, elementRef, renderer, zone) {
        this.contextMenuService = contextMenuService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.zone = zone;
        this.componentDestroy$ = new Subject();
        this.contextMenuInjectorData = { isRoot: true };
        this.contextMenuRef = null;
        this.menuClickNotifier = new Subject();
        this.precise = true;
        this.targetListener = () => void 0;
        this.windowEventListenerRefs = [];
        this.uid = v4();
        this.close = new EventEmitter();
        this.menuItemComponents = new QueryList();
        this.menuItems = [];
        this.navigate = new EventEmitter();
        this.open = new EventEmitter();
        this.popupClass = [];
        this.trigger = "contextmenu";
    }
    closeMenu() {
        this.contextMenuRef?.close();
    }
    ngAfterContentInit() {
        if (this.menuItems.length !== 0) {
            return;
        }
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem()) ?? [];
    }
    ngOnDestroy() {
        this.targetListener?.();
        this.windowEventListenerRefs.forEach(ref => ref());
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.setEventListeners();
    }
    openMenu() {
        this.create(new MouseEvent("click"));
    }
    setPrecise(precise) {
        this.precise = precise;
    }
    create(event) {
        this.contextMenuInjectorData.menuClick = this.menuClickNotifier;
        this.contextMenuInjectorData.menuItems = this.menuItems;
        this.contextMenuInjectorData.navigate = this.navigate;
        this.contextMenuInjectorData.popupClass = this.popupClass;
        this.contextMenuRef = this.contextMenuService.open({
            anchor: this.precise ? { x: event.x, y: event.y } : this.target,
            closeOnOutsideClick: true,
            content: ContextMenuContentComponent,
            data: this.contextMenuInjectorData,
            minWidth: this.minWidth,
            offset: this.offset,
            popupClass: Array.isArray(this.popupClass)
                ? ["mona-contextmenu-content", ...this.popupClass]
                : ["mona-contextmenu-content", this.popupClass],
            width: this.width
        });
        this.contextMenuInjectorData.parentMenuRef = this.contextMenuRef;
        this.open.emit({ uid: this.uid, popupRef: this.contextMenuRef });
        this.contextMenuRef.closed
            .pipe(take(1))
            .subscribe(() => this.close.emit({ uid: this.uid, popupRef: this.contextMenuRef }));
    }
    onOutsideClick(event) {
        if (!this.contextMenuRef) {
            return;
        }
        if (this.contextMenuRef.overlayRef.overlayElement?.contains(event.target)) {
            return;
        }
        this.contextMenuRef.close();
    }
    setEventListeners() {
        this.zone.runOutsideAngular(() => {
            this.targetListener = this.renderer.listen(this.target, this.trigger, (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.zone.run(() => {
                    this.create(event);
                });
            });
            this.windowEventListenerRefs = [
                this.renderer.listen(window, "click", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "contextmenu", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "auxclick", this.onOutsideClick.bind(this)),
                this.renderer.listen(window, "keydown.esc", () => this.contextMenuRef?.close())
            ];
        });
        this.menuClickNotifier.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.contextMenuRef?.close();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuComponent, deps: [{ token: ContextMenuService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ContextMenuComponent, selector: "mona-contextmenu", inputs: { menuItems: "menuItems", minWidth: "minWidth", offset: "offset", popupClass: "popupClass", target: "target", trigger: "trigger", width: "width" }, outputs: { close: "close", navigate: "navigate", open: "open" }, queries: [{ propertyName: "menuItemComponents", predicate: MenuItemComponent }], ngImport: i0, template: "", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-contextmenu", template: "" }]
        }], ctorParameters: function () { return [{ type: ContextMenuService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { close: [{
                type: Output
            }], menuItemComponents: [{
                type: ContentChildren,
                args: [MenuItemComponent]
            }], menuItems: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], navigate: [{
                type: Output
            }], offset: [{
                type: Input
            }], open: [{
                type: Output
            }], popupClass: [{
                type: Input
            }], target: [{
                type: Input
            }], trigger: [{
                type: Input
            }], width: [{
                type: Input
            }] } });

class SplitButtonComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.componentDestroy$ = new Subject();
        this.menuIcon = faChevronDown;
        this.menuItems = [];
        this.popupOffset = {
            horizontal: 0,
            vertical: 0.5
        };
        this.popupWidth = 0;
        this.buttonClick = new EventEmitter();
        this.disabled = false;
        this.menuItemComponents = new QueryList();
        this.text = "";
        this.textTemplate = null;
    }
    ngAfterContentInit() {
        this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        this.menuItemComponents.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.menuItems = this.menuItemComponents.map(m => m.getMenuItem());
        });
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.popupWidth = this.wrapperElementRef.nativeElement.getBoundingClientRect().width - 1;
            this.popupOffset.horizontal = -this.mainButtonElementRef.nativeElement.offsetWidth - 1;
            this.contextMenuComponent.setPrecise(false);
            this.cdr.detectChanges();
        });
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: SplitButtonComponent, selector: "mona-split-button", inputs: { disabled: "disabled", text: "text" }, outputs: { buttonClick: "buttonClick" }, queries: [{ propertyName: "textTemplate", first: true, predicate: SplitButtonTextTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "menuItemComponents", predicate: MenuItemComponent }], viewQueries: [{ propertyName: "contextMenuComponent", first: true, predicate: ["contextMenuComponent"], descendants: true }, { propertyName: "mainButtonElementRef", first: true, predicate: ["mainButton"], descendants: true }, { propertyName: "wrapperElementRef", first: true, predicate: ["wrapperElementRef"], descendants: true }], ngImport: i0, template: "<div class=\"mona-split-button\" #wrapperElementRef>\n    <button monaButton (click)=\"buttonClick.emit()\" [disabled]=\"disabled\" tabindex=\"0\" #mainButton>\n        <span class=\"mona-slit-button-text\" *ngIf=\"!textTemplate\">{{text}}</span>\n        <ng-container [ngTemplateOutlet]=\"textTemplate\" *ngIf=\"textTemplate\"></ng-container>\n    </button>\n    <button monaButton [disabled]=\"disabled\" tabindex=\"0\" #menuButton>\n        <fa-icon [icon]=\"menuIcon\"></fa-icon>\n    </button>\n    <mona-contextmenu [target]=\"menuButton\" trigger=\"click\" [minWidth]=\"popupWidth\" [offset]=\"popupOffset\" popupClass=\"mona-split-button-popup\"\n                      [menuItems]=\"menuItems\" #contextMenuComponent ></mona-contextmenu>\n</div>\n", styles: ["div.mona-split-button{display:flex;align-items:center;background-color:var(--mona-background);border:1px solid var(--mona-border-color);height:var(--mona-input-height);width:-moz-fit-content;width:fit-content}div.mona-split-button>[monaButton]{height:calc(100% - 2px);border-left:none;border-right:none}div.mona-split-button>[monaButton]:first-child{border-right:1px solid var(--mona-border-color)}div.mona-split-button>[monaButton]:nth-child(2)>span{font-size:18px;display:inline-block;transform-origin:center;transform:rotate(90deg)}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: ContextMenuComponent, selector: "mona-contextmenu", inputs: ["menuItems", "minWidth", "offset", "popupClass", "target", "trigger", "width"], outputs: ["close", "navigate", "open"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-split-button", template: "<div class=\"mona-split-button\" #wrapperElementRef>\n    <button monaButton (click)=\"buttonClick.emit()\" [disabled]=\"disabled\" tabindex=\"0\" #mainButton>\n        <span class=\"mona-slit-button-text\" *ngIf=\"!textTemplate\">{{text}}</span>\n        <ng-container [ngTemplateOutlet]=\"textTemplate\" *ngIf=\"textTemplate\"></ng-container>\n    </button>\n    <button monaButton [disabled]=\"disabled\" tabindex=\"0\" #menuButton>\n        <fa-icon [icon]=\"menuIcon\"></fa-icon>\n    </button>\n    <mona-contextmenu [target]=\"menuButton\" trigger=\"click\" [minWidth]=\"popupWidth\" [offset]=\"popupOffset\" popupClass=\"mona-split-button-popup\"\n                      [menuItems]=\"menuItems\" #contextMenuComponent ></mona-contextmenu>\n</div>\n", styles: ["div.mona-split-button{display:flex;align-items:center;background-color:var(--mona-background);border:1px solid var(--mona-border-color);height:var(--mona-input-height);width:-moz-fit-content;width:fit-content}div.mona-split-button>[monaButton]{height:calc(100% - 2px);border-left:none;border-right:none}div.mona-split-button>[monaButton]:first-child{border-right:1px solid var(--mona-border-color)}div.mona-split-button>[monaButton]:nth-child(2)>span{font-size:18px;display:inline-block;transform-origin:center;transform:rotate(90deg)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { buttonClick: [{
                type: Output
            }], contextMenuComponent: [{
                type: ViewChild,
                args: ["contextMenuComponent"]
            }], disabled: [{
                type: Input
            }], mainButtonElementRef: [{
                type: ViewChild,
                args: ["mainButton"]
            }], menuItemComponents: [{
                type: ContentChildren,
                args: [MenuItemComponent]
            }], text: [{
                type: Input
            }], textTemplate: [{
                type: ContentChild,
                args: [SplitButtonTextTemplateDirective, { read: TemplateRef }]
            }], wrapperElementRef: [{
                type: ViewChild,
                args: ["wrapperElementRef"]
            }] } });

class PopupAnchorDirective {
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
        PopupService.popupAnchorDirective = this;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupAnchorDirective, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: PopupAnchorDirective, selector: "[monaPopupAnchor]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupAnchorDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaPopupAnchor]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ViewContainerRef }]; } });

class PopupComponent {
    constructor(popupService, renderer, zone) {
        this.popupService = popupService;
        this.renderer = renderer;
        this.zone = zone;
        this.popupOpened = false;
        this.popupRef = null;
        this.popupTriggerListener = () => void 0;
        this.close = new EventEmitter();
        this.closeOnEscape = true;
        this.open = new EventEmitter();
        this.popupClass = [];
        this.trigger = "click";
    }
    ngAfterViewInit() {
        if (!this.contentTemplate) {
            throw new Error(`${PopupComponent.name} requires contentTemplate`);
        }
        window.setTimeout(() => {
            this.setEventListeners();
        });
    }
    ngOnDestroy() {
        this.popupRef?.close();
    }
    ngOnInit() {
        if (!this.anchor) {
            throw new Error(`${PopupComponent.name} requires anchor`);
        }
    }
    setEventListeners() {
        this.zone.runOutsideAngular(() => {
            let pointAnchor = false;
            let target;
            if (this.anchor instanceof ElementRef) {
                target = this.anchor.nativeElement;
            }
            else if (this.anchor instanceof HTMLElement) {
                target = this.anchor;
            }
            else {
                target = document.body;
                pointAnchor = true;
            }
            const width = this.width ??
                (this.anchor instanceof HTMLElement
                    ? this.anchor.offsetWidth
                    : this.anchor instanceof ElementRef
                        ? this.anchor.nativeElement.offsetWidth
                        : undefined);
            this.popupTriggerListener = this.renderer.listen(target, this.trigger, (event) => {
                event.preventDefault();
                if (this.popupOpened) {
                    this.popupOpened = false;
                    return;
                }
                this.zone.run(() => {
                    const popupSettings = {
                        anchor: this.anchor,
                        closeOnEscape: this.closeOnEscape,
                        content: this.contentTemplate,
                        hasBackdrop: false,
                        height: this.height,
                        maxHeight: this.maxHeight,
                        maxWidth: this.maxWidth,
                        minHeight: this.minHeight,
                        minWidth: this.minWidth,
                        offset: this.offset,
                        popupClass: this.popupClass,
                        width
                    };
                    this.popupRef = this.popupService.create(popupSettings);
                    const subscription = this.popupRef.closed.subscribe(result => {
                        this.popupRef = null;
                        this.close.emit();
                        subscription.unsubscribe();
                        if (result instanceof PointerEvent && result.type === this.trigger) {
                            this.popupOpened =
                                target instanceof HTMLElement && target.contains(result.target);
                        }
                        else if (result instanceof PointerEvent && pointAnchor && result.type !== this.trigger) {
                            this.popupOpened = false;
                        }
                    });
                    if (pointAnchor) {
                        this.popupOpened = true;
                    }
                    this.open.emit(this.popupRef);
                });
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupComponent, deps: [{ token: PopupService }, { token: i0.Renderer2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: PopupComponent, selector: "mona-popup", inputs: { anchor: "anchor", closeOnEscape: "closeOnEscape", height: "height", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", offset: "offset", popupClass: "popupClass", trigger: "trigger", width: "width" }, outputs: { close: "close", open: "open" }, queries: [{ propertyName: "contentTemplate", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: "<ng-content></ng-content>\n", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-popup", template: "<ng-content></ng-content>\n" }]
        }], ctorParameters: function () { return [{ type: PopupService }, { type: i0.Renderer2 }, { type: i0.NgZone }]; }, propDecorators: { anchor: [{
                type: Input
            }], close: [{
                type: Output
            }], closeOnEscape: [{
                type: Input
            }], contentTemplate: [{
                type: ContentChild,
                args: [TemplateRef]
            }], height: [{
                type: Input
            }], maxHeight: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], offset: [{
                type: Input
            }], open: [{
                type: Output
            }], popupClass: [{
                type: Input
            }], trigger: [{
                type: Input
            }], width: [{
                type: Input
            }] } });

class PopupModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, declarations: [PopupAnchorDirective, PopupComponent], imports: [CommonModule, OverlayModule], exports: [PopupComponent, PopupAnchorDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, imports: [CommonModule, OverlayModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PopupAnchorDirective, PopupComponent],
                    imports: [CommonModule, OverlayModule],
                    exports: [PopupComponent, PopupAnchorDirective]
                }]
        }] });

class SharedMenuModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, declarations: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective], imports: [CommonModule, PopupModule], exports: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, imports: [CommonModule, PopupModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective],
                    imports: [CommonModule, PopupModule],
                    exports: [MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective]
                }]
        }] });

class ContextMenuModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuModule, declarations: [ContextMenuComponent, ContextMenuContentComponent, ContextMenuItemComponent], imports: [CommonModule, FontAwesomeModule, SharedMenuModule], exports: [ContextMenuComponent, MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuModule, imports: [CommonModule, FontAwesomeModule, SharedMenuModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ContextMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ContextMenuComponent, ContextMenuContentComponent, ContextMenuItemComponent],
                    imports: [CommonModule, FontAwesomeModule, SharedMenuModule],
                    exports: [ContextMenuComponent, MenuItemComponent, MenuItemTextTemplateDirective, MenuItemIconTemplateDirective]
                }]
        }] });

class SplitButtonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonModule, declarations: [SplitButtonComponent, SplitButtonTextTemplateDirective], imports: [CommonModule, PopupModule, ContextMenuModule, ButtonModule, FontAwesomeModule], exports: [SplitButtonComponent, SplitButtonTextTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonModule, imports: [CommonModule, PopupModule, ContextMenuModule, ButtonModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SplitButtonComponent, SplitButtonTextTemplateDirective],
                    imports: [CommonModule, PopupModule, ContextMenuModule, ButtonModule, FontAwesomeModule],
                    exports: [SplitButtonComponent, SplitButtonTextTemplateDirective]
                }]
        }] });

class ButtonsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ButtonsModule, exports: [ButtonModule, ButtonGroupModule, SplitButtonModule, ChipModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonsModule, imports: [ButtonModule, ButtonGroupModule, SplitButtonModule, ChipModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ButtonsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [],
                    exports: [ButtonModule, ButtonGroupModule, SplitButtonModule, ChipModule]
                }]
        }] });

class AbstractDateInputComponent {
    #value;
    #propagateChange;
    set value(date) {
        this.#value = date;
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        }
        else {
            this.currentDateString = "";
        }
    }
    get value() {
        return this.#value;
    }
    constructor(cdr) {
        this.cdr = cdr;
        this.#value = null;
        this.#propagateChange = null;
        this.componentDestroy$ = new Subject();
        this.popupRef = null;
        this.currentDateString = "";
        this.navigatedDate = new Date();
        this.disabled = false;
        this.disabledDates = [];
        this.format = "HH:mm";
        this.max = null;
        this.min = null;
        this.readonly = false;
        this.valueChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes["hourFormat"] && this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.setDateValues();
    }
    registerOnChange(fn) {
        this.#propagateChange = fn;
    }
    registerOnTouched(fn) { }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    writeValue(obj) {
        if (obj == null) {
            this.value = null;
        }
        else if (obj instanceof Date) {
            this.value = obj;
        }
        this.setDateValues();
    }
    setCurrentDate(date) {
        this.#value = date;
        if (date) {
            this.currentDateString = DateTime.fromJSDate(date).toFormat(this.format);
        }
        else {
            this.currentDateString = "";
        }
        this.valueChange.emit(date);
        this.#propagateChange?.(date);
        this.cdr.markForCheck();
    }
    dateStringEquals(date1, date2) {
        if (date1 && date2) {
            return (DateTime.fromJSDate(date1).toFormat(this.format) === DateTime.fromJSDate(date2).toFormat(this.format));
        }
        return date1 === date2;
    }
    setDateValues() {
        this.navigatedDate = this.value ?? DateTime.now().toJSDate();
        if (this.value) {
            this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDateInputComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractDateInputComponent, isStandalone: true, selector: "ng-component", inputs: { disabled: "disabled", disabledDates: "disabledDates", format: "format", max: "max", min: "min", readonly: "readonly", value: "value" }, outputs: { valueChange: "valueChange" }, viewQueries: [{ propertyName: "popupAnchor", first: true, predicate: ["popupAnchor"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "", isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDateInputComponent, decorators: [{
            type: Component,
            args: [{ standalone: true, imports: [CommonModule], template: "", changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], disabledDates: [{
                type: Input
            }], format: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], popupAnchor: [{
                type: ViewChild,
                args: ["popupAnchor"]
            }], readonly: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class SlicePipe {
    transform(value, start, end) {
        return Enumerable.from(value)
            .skip(start)
            .take(end - start)
            .toArray();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SlicePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SlicePipe, isStandalone: true, name: "monaSlice" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SlicePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "monaSlice",
                    standalone: true
                }]
        }] });

class DateComparerPipe {
    transform(value, other, operator) {
        if (value === null || other === null) {
            return false;
        }
        switch (operator) {
            case "==":
                return (value.getDate() === other.getDate() &&
                    value.getMonth() === other.getMonth() &&
                    value.getFullYear() === other.getFullYear());
            case "!=":
                return (value.getDate() !== other.getDate() ||
                    value.getMonth() !== other.getMonth() ||
                    value.getFullYear() !== other.getFullYear());
            case "<":
                return (value.getFullYear() < other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() < other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() < other.getDate()));
            case "<=":
                return (value.getFullYear() < other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() < other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() <= other.getDate()));
            case ">":
                return (value.getFullYear() > other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() > other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() > other.getDate()));
            case ">=":
                return (value.getFullYear() > other.getFullYear() ||
                    (value.getFullYear() === other.getFullYear() && value.getMonth() > other.getMonth()) ||
                    (value.getFullYear() === other.getFullYear() &&
                        value.getMonth() === other.getMonth() &&
                        value.getDate() >= other.getDate()));
            default:
                return false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateComparerPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DateComparerPipe, isStandalone: true, name: "monaDateComparer" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateComparerPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "monaDateComparer",
                    standalone: true
                }]
        }] });

class DateIncludePipe {
    transform(value, dates) {
        const valueDateTime = DateTime.fromJSDate(value);
        return Enumerable.from(dates)
            .select(d => DateTime.fromJSDate(d))
            .any(d => d.hasSame(valueDateTime, "day") &&
            d.hasSame(valueDateTime, "month") &&
            d.hasSame(valueDateTime, "year"));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateIncludePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DateIncludePipe, isStandalone: true, name: "monaDateInclude" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateIncludePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "monaDateInclude",
                    standalone: true
                }]
        }] });

class CalendarComponent extends AbstractDateInputComponent {
    constructor(cdr) {
        super(cdr);
        this.cdr = cdr;
        this.nextMonthIcon = faChevronRight;
        this.prevMonthIcon = faChevronLeft;
        this.calendarView = "month";
        this.decadeYears = [];
        this.monthBounds = { start: new Date(), end: new Date() };
        this.monthlyViewDict = new Dictionary();
    }
    ngOnInit() {
        super.ngOnInit();
        const date = this.value ?? DateTime.now().toJSDate();
        this.prepareMonthlyViewDictionary(date);
        this.navigatedDate = date;
    }
    onDayClick(date) {
        if (this.value) {
            const oldMonth = DateTime.fromJSDate(this.value).month;
            const date1 = DateTime.fromJSDate(date);
            const newDate = DateTime.fromJSDate(this.value)
                .set({ day: date1.day, month: date1.month, year: date1.year })
                .toJSDate();
            this.setCurrentDate(newDate);
            this.navigatedDate = newDate;
            if (oldMonth !== DateTime.fromJSDate(newDate).month) {
                this.prepareMonthlyViewDictionary(newDate);
            }
        }
        else {
            this.setCurrentDate(date);
            this.navigatedDate = date;
            this.prepareMonthlyViewDictionary(date);
        }
        this.cdr.markForCheck();
    }
    onMonthClick(month) {
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ month }).toJSDate();
        this.prepareMonthlyViewDictionary(this.navigatedDate);
        this.calendarView = "month";
    }
    onNavigationClick(direction) {
        if (this.calendarView === "month") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ months: 1 }).toJSDate() : date.plus({ months: 1 }).toJSDate();
            this.prepareMonthlyViewDictionary(this.navigatedDate);
        }
        else if (this.calendarView === "year") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ years: 1 }).toJSDate() : date.plus({ years: 1 }).toJSDate();
        }
        else if (this.calendarView === "decade") {
            const date = DateTime.fromJSDate(this.navigatedDate);
            this.navigatedDate =
                direction === "prev" ? date.minus({ years: 10 }).toJSDate() : date.plus({ years: 10 }).toJSDate();
            this.prepareDecadeYears();
        }
        this.cdr.markForCheck();
    }
    onViewChangeClick(view) {
        if (view === "decade") {
            this.prepareDecadeYears();
        }
        this.calendarView = view;
    }
    onYearClick(year) {
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ year }).toJSDate();
        this.calendarView = "year";
    }
    prepareDecadeYears() {
        const date = DateTime.fromJSDate(this.navigatedDate);
        const year = date.year;
        const decadeStart = year - (year % 10);
        this.decadeYears = Array.from({ length: 10 }, (_, i) => decadeStart + i);
    }
    prepareMonthlyViewDictionary(day) {
        const firstDayOfMonth = DateTime.fromJSDate(day).startOf("month");
        const lastDayOfMonth = DateTime.fromJSDate(day).endOf("month");
        const firstDayOfCalendar = firstDayOfMonth.startOf("week");
        const lastDayOfCalendar = lastDayOfMonth.endOf("week");
        const dictionary = new Dictionary();
        for (let i = firstDayOfCalendar; i <= lastDayOfCalendar; i = i.plus({ days: 1 })) {
            dictionary.add(i.toJSDate(), i.day);
        }
        if (lastDayOfMonth.weekday === 7) {
            for (let i = 0; i < 7; i++) {
                dictionary.add(lastDayOfMonth.plus({ days: i + 1 }).toJSDate(), i + 1);
            }
        }
        this.monthlyViewDict = dictionary;
        this.monthBounds = { start: firstDayOfMonth.toJSDate(), end: lastDayOfMonth.toJSDate() };
        this.cdr.markForCheck();
    }
    get timezone() {
        return DateTime.local().zoneName;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: CalendarComponent, selector: "mona-calendar", usesInheritance: true, ngImport: i0, template: "<div class=\"mona-calendar\">\n    <div class=\"mona-calendar-header\">\n        <div>\n            <button monaButton (click)=\"onNavigationClick('prev')\">\n                <fa-icon [icon]=\"prevMonthIcon\"></fa-icon>\n            </button>\n        </div>\n        <div>\n            <button monaButton *ngIf=\"calendarView==='month'\" (click)=\"onViewChangeClick('year')\">{{navigatedDate|date:'MMMM yyyy':timezone}}</button>\n            <button monaButton *ngIf=\"calendarView==='year'\" (click)=\"onViewChangeClick('decade')\">{{navigatedDate|date:'yyyy':timezone}}</button>\n            <button monaButton *ngIf=\"calendarView==='decade'\">{{decadeYears[0]}} - {{decadeYears[decadeYears.length-1]}}</button>\n        </div>\n        <div>\n            <button monaButton (click)=\"onNavigationClick('next')\">\n                <fa-icon [icon]=\"nextMonthIcon\"></fa-icon>\n            </button>\n        </div>\n    </div>\n    <div class=\"mona-calendar-month-view\" *ngIf=\"calendarView==='month'\" style=\"width: 100%;\">\n        <table class=\"mona-calendar-month-view-table\">\n            <thead>\n            <tr>\n                <th>Mon</th>\n                <th>Tue</th>\n                <th>Wed</th>\n                <th>Thu</th>\n                <th>Fri</th>\n                <th>Sat</th>\n                <th>Sun</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:0:7\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-calendar-other-month': entry.key|monaDateComparer:monthBounds.start:'<',\n                        'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:7:14\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:14:21\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:21:28\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:28:35\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-calendar-other-month':entry.key|monaDateComparer:monthBounds.end:'>',\n                        'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:35:monthlyViewDict.length\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-calendar-other-month': entry.key|monaDateComparer:monthBounds.end:'>',\n                        'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n    <div class=\"mona-calendar-year-view\" *ngIf=\"calendarView==='year'\">\n        <table class=\"mona-calendar-year-view-table\">\n            <tr>\n                <td (click)=\"onMonthClick(1)\">Jan</td>\n                <td (click)=\"onMonthClick(2)\">Feb</td>\n                <td (click)=\"onMonthClick(3)\">Mar</td>\n            </tr>\n            <tr>\n                <td (click)=\"onMonthClick(4)\">Apr</td>\n                <td (click)=\"onMonthClick(5)\">May</td>\n                <td (click)=\"onMonthClick(6)\">Jun</td>\n            </tr>\n            <tr>\n                <td (click)=\"onMonthClick(7)\">Jul</td>\n                <td (click)=\"onMonthClick(8)\">Aug</td>\n                <td (click)=\"onMonthClick(9)\">Sep</td>\n            </tr>\n            <tr>\n                <td (click)=\"onMonthClick(10)\">Oct</td>\n                <td (click)=\"onMonthClick(11)\">Nov</td>\n                <td (click)=\"onMonthClick(12)\">Dec</td>\n            </tr>\n        </table>\n    </div>\n    <div class=\"mona-calendar-decade-view\" *ngIf=\"calendarView==='decade'\">\n        <table class=\"mona-calendar-decade-view-table\">\n            <tr>\n                <td (click)=\"onYearClick(decadeYears[0])\">{{decadeYears[0]}}</td>\n                <td (click)=\"onYearClick(decadeYears[1])\">{{decadeYears[1]}}</td>\n                <td (click)=\"onYearClick(decadeYears[2])\">{{decadeYears[2]}}</td>\n                <td (click)=\"onYearClick(decadeYears[3])\">{{decadeYears[3]}}</td>\n            </tr>\n            <tr>\n                <td (click)=\"onYearClick(decadeYears[4])\">{{decadeYears[4]}}</td>\n                <td (click)=\"onYearClick(decadeYears[5])\">{{decadeYears[5]}}</td>\n                <td (click)=\"onYearClick(decadeYears[6])\">{{decadeYears[6]}}</td>\n                <td (click)=\"onYearClick(decadeYears[7])\">{{decadeYears[7]}}</td>\n            </tr>\n            <tr>\n                <td (click)=\"onYearClick(decadeYears[8])\">{{decadeYears[8]}}</td>\n                <td (click)=\"onYearClick(decadeYears[9])\">{{decadeYears[9]}}</td>\n            </tr>\n        </table>\n    </div>\n</div>\n", styles: ["table.mona-calendar-month-view-table{width:100%;border-collapse:collapse}table.mona-calendar-month-view-table td,table.mona-calendar-month-view-table th{text-align:center;width:40px;height:32px}table.mona-calendar-month-view-table thead{pointer-events:none}table.mona-calendar-month-view-table thead th{text-transform:uppercase;padding:0 0 4px;font-weight:600;box-shadow:inset 0 -1px 0 var(--mona-text);color:var(--mona-text)}table.mona-calendar-month-view-table tbody td{padding:4px 0;cursor:pointer}table.mona-calendar-month-view-table tbody td.mona-calendar-other-month{color:var(--mona-text);opacity:.35}table.mona-calendar-month-view-table tbody tr:first-child td{margin-top:4px}table.mona-calendar-year-view-table{width:100%;border-collapse:collapse;margin-top:10px}table.mona-calendar-year-view-table td,table.mona-calendar-year-view-table th{text-align:center;height:48px;font-weight:600;cursor:pointer}table.mona-calendar-decade-view-table{width:100%;border-collapse:collapse;margin-top:10px}table.mona-calendar-decade-view-table td,table.mona-calendar-decade-view-table th{text-align:center;height:48px;font-weight:600;cursor:pointer}div.mona-calendar-header{display:flex}div.mona-calendar-header>div:first-child,div.mona-calendar-header>div:last-child{display:flex;align-items:center;justify-content:center;cursor:pointer}div.mona-calendar-header>div:nth-child(2){flex:1}div.mona-calendar-header>div:nth-child(2) button{border-left:none;border-right:none;width:100%}div.mona-calendar-month-view,div.mona-calendar-year-view,div.mona-calendar-decade-view{border-left:1px solid var(--mona-border-color);border-right:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "pipe", type: i1.DatePipe, name: "date" }, { kind: "pipe", type: SlicePipe, name: "monaSlice" }, { kind: "pipe", type: DateComparerPipe, name: "monaDateComparer" }, { kind: "pipe", type: DateIncludePipe, name: "monaDateInclude" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-calendar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-calendar\">\n    <div class=\"mona-calendar-header\">\n        <div>\n            <button monaButton (click)=\"onNavigationClick('prev')\">\n                <fa-icon [icon]=\"prevMonthIcon\"></fa-icon>\n            </button>\n        </div>\n        <div>\n            <button monaButton *ngIf=\"calendarView==='month'\" (click)=\"onViewChangeClick('year')\">{{navigatedDate|date:'MMMM yyyy':timezone}}</button>\n            <button monaButton *ngIf=\"calendarView==='year'\" (click)=\"onViewChangeClick('decade')\">{{navigatedDate|date:'yyyy':timezone}}</button>\n            <button monaButton *ngIf=\"calendarView==='decade'\">{{decadeYears[0]}} - {{decadeYears[decadeYears.length-1]}}</button>\n        </div>\n        <div>\n            <button monaButton (click)=\"onNavigationClick('next')\">\n                <fa-icon [icon]=\"nextMonthIcon\"></fa-icon>\n            </button>\n        </div>\n    </div>\n    <div class=\"mona-calendar-month-view\" *ngIf=\"calendarView==='month'\" style=\"width: 100%;\">\n        <table class=\"mona-calendar-month-view-table\">\n            <thead>\n            <tr>\n                <th>Mon</th>\n                <th>Tue</th>\n                <th>Wed</th>\n                <th>Thu</th>\n                <th>Fri</th>\n                <th>Sat</th>\n                <th>Sun</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:0:7\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-calendar-other-month': entry.key|monaDateComparer:monthBounds.start:'<',\n                        'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:7:14\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:14:21\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:21:28\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:28:35\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-calendar-other-month':entry.key|monaDateComparer:monthBounds.end:'>',\n                        'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            <tr>\n                <td *ngFor=\"let entry of monthlyViewDict | monaSlice:35:monthlyViewDict.length\" (click)=\"onDayClick(entry.key)\"\n                    [ngClass]=\"{'mona-calendar-other-month': entry.key|monaDateComparer:monthBounds.end:'>',\n                        'mona-selected':entry.key|monaDateComparer:value:'==',\n                        'mona-disabled': (entry.key|monaDateInclude:disabledDates)||(min !== null && (entry.key|monaDateComparer:min:'<'))||(max !== null && (entry.key|monaDateComparer:max:'>'))}\">\n                    <span>{{entry.value}}</span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n    <div class=\"mona-calendar-year-view\" *ngIf=\"calendarView==='year'\">\n        <table class=\"mona-calendar-year-view-table\">\n            <tr>\n                <td (click)=\"onMonthClick(1)\">Jan</td>\n                <td (click)=\"onMonthClick(2)\">Feb</td>\n                <td (click)=\"onMonthClick(3)\">Mar</td>\n            </tr>\n            <tr>\n                <td (click)=\"onMonthClick(4)\">Apr</td>\n                <td (click)=\"onMonthClick(5)\">May</td>\n                <td (click)=\"onMonthClick(6)\">Jun</td>\n            </tr>\n            <tr>\n                <td (click)=\"onMonthClick(7)\">Jul</td>\n                <td (click)=\"onMonthClick(8)\">Aug</td>\n                <td (click)=\"onMonthClick(9)\">Sep</td>\n            </tr>\n            <tr>\n                <td (click)=\"onMonthClick(10)\">Oct</td>\n                <td (click)=\"onMonthClick(11)\">Nov</td>\n                <td (click)=\"onMonthClick(12)\">Dec</td>\n            </tr>\n        </table>\n    </div>\n    <div class=\"mona-calendar-decade-view\" *ngIf=\"calendarView==='decade'\">\n        <table class=\"mona-calendar-decade-view-table\">\n            <tr>\n                <td (click)=\"onYearClick(decadeYears[0])\">{{decadeYears[0]}}</td>\n                <td (click)=\"onYearClick(decadeYears[1])\">{{decadeYears[1]}}</td>\n                <td (click)=\"onYearClick(decadeYears[2])\">{{decadeYears[2]}}</td>\n                <td (click)=\"onYearClick(decadeYears[3])\">{{decadeYears[3]}}</td>\n            </tr>\n            <tr>\n                <td (click)=\"onYearClick(decadeYears[4])\">{{decadeYears[4]}}</td>\n                <td (click)=\"onYearClick(decadeYears[5])\">{{decadeYears[5]}}</td>\n                <td (click)=\"onYearClick(decadeYears[6])\">{{decadeYears[6]}}</td>\n                <td (click)=\"onYearClick(decadeYears[7])\">{{decadeYears[7]}}</td>\n            </tr>\n            <tr>\n                <td (click)=\"onYearClick(decadeYears[8])\">{{decadeYears[8]}}</td>\n                <td (click)=\"onYearClick(decadeYears[9])\">{{decadeYears[9]}}</td>\n            </tr>\n        </table>\n    </div>\n</div>\n", styles: ["table.mona-calendar-month-view-table{width:100%;border-collapse:collapse}table.mona-calendar-month-view-table td,table.mona-calendar-month-view-table th{text-align:center;width:40px;height:32px}table.mona-calendar-month-view-table thead{pointer-events:none}table.mona-calendar-month-view-table thead th{text-transform:uppercase;padding:0 0 4px;font-weight:600;box-shadow:inset 0 -1px 0 var(--mona-text);color:var(--mona-text)}table.mona-calendar-month-view-table tbody td{padding:4px 0;cursor:pointer}table.mona-calendar-month-view-table tbody td.mona-calendar-other-month{color:var(--mona-text);opacity:.35}table.mona-calendar-month-view-table tbody tr:first-child td{margin-top:4px}table.mona-calendar-year-view-table{width:100%;border-collapse:collapse;margin-top:10px}table.mona-calendar-year-view-table td,table.mona-calendar-year-view-table th{text-align:center;height:48px;font-weight:600;cursor:pointer}table.mona-calendar-decade-view-table{width:100%;border-collapse:collapse;margin-top:10px}table.mona-calendar-decade-view-table td,table.mona-calendar-decade-view-table th{text-align:center;height:48px;font-weight:600;cursor:pointer}div.mona-calendar-header{display:flex}div.mona-calendar-header>div:first-child,div.mona-calendar-header>div:last-child{display:flex;align-items:center;justify-content:center;cursor:pointer}div.mona-calendar-header>div:nth-child(2){flex:1}div.mona-calendar-header>div:nth-child(2) button{border-left:none;border-right:none;width:100%}div.mona-calendar-month-view,div.mona-calendar-year-view,div.mona-calendar-decade-view{border-left:1px solid var(--mona-border-color);border-right:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; } });

class CalendarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, declarations: [CalendarComponent], imports: [CommonModule, SlicePipe, DateComparerPipe, FontAwesomeModule, ButtonModule, DateIncludePipe], exports: [CalendarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, imports: [CommonModule, FontAwesomeModule, ButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CalendarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CalendarComponent],
                    imports: [CommonModule, SlicePipe, DateComparerPipe, FontAwesomeModule, ButtonModule, DateIncludePipe],
                    exports: [CalendarComponent]
                }]
        }] });

class AbstractDatePickerComponent extends AbstractDateInputComponent {
    constructor(cdr, elementRef, focusMonitor, popupService) {
        super(cdr);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.popupService = popupService;
        this.dateIcon = faCalendar;
    }
    onCalendarValueChange(date) {
        this.setCurrentDate(date);
        this.popupRef?.close();
    }
    onDateInputBlur() {
        if (this.popupRef) {
            return;
        }
        if (!this.currentDateString && this.value) {
            this.setCurrentDate(null);
            return;
        }
        const dateTime = DateTime.fromFormat(this.currentDateString, this.format);
        if (this.dateStringEquals(this.value, dateTime.toJSDate())) {
            return;
        }
        if (dateTime.isValid) {
            if (this.value && DateTime.fromJSDate(this.value).equals(dateTime)) {
                return;
            }
            if (this.min && dateTime.startOf("day") < DateTime.fromJSDate(this.min).startOf("day")) {
                this.setCurrentDate(this.min);
                return;
            }
            if (this.max && dateTime.startOf("day") > DateTime.fromJSDate(this.max).startOf("day")) {
                this.setCurrentDate(this.max);
                return;
            }
            this.setCurrentDate(dateTime.toJSDate());
        }
        else {
            if (this.value) {
                this.currentDateString = DateTime.fromJSDate(this.value).toFormat(this.format);
            }
            else {
                this.currentDateString = "";
            }
        }
        this.cdr.detectChanges();
    }
    onDateInputButtonClick() {
        if (!this.datePopupTemplateRef || this.readonly) {
            return;
        }
        const input = this.elementRef.nativeElement.querySelector("input");
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.datePopupTemplateRef,
            width: this.elementRef.nativeElement.offsetWidth,
            minWidth: 200,
            popupClass: "mona-date-input-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(input, "program");
        });
    }
    onDateStringEdit(dateString) {
        this.currentDateString = dateString;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDatePickerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1$2.FocusMonitor }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractDatePickerComponent, isStandalone: true, selector: "mona-abstract-date-picker", viewQueries: [{ propertyName: "datePopupTemplateRef", first: true, predicate: ["datePopupTemplate"], descendants: true }], usesInheritance: true, ngImport: i0, template: "", isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-abstract-date-picker", standalone: true, imports: [CommonModule], template: "", changeDetection: ChangeDetectionStrategy.OnPush }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1$2.FocusMonitor }, { type: PopupService }]; }, propDecorators: { datePopupTemplateRef: [{
                type: ViewChild,
                args: ["datePopupTemplate"]
            }] } });

class TextBoxPrefixTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxPrefixTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TextBoxPrefixTemplateDirective, selector: "ng-template[monaTextBoxPrefixTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxPrefixTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaTextBoxPrefixTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class TextBoxSuffixTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxSuffixTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TextBoxSuffixTemplateDirective, selector: "ng-template[monaTextBoxSuffixTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxSuffixTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaTextBoxSuffixTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class TextBoxDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TextBoxDirective, selector: "input[monaTextBox]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "input[monaTextBox]"
                }]
        }], ctorParameters: function () { return []; } });

class TextBoxComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.propagateChange = null;
        this.value = "";
        this.disabled = false;
        this.inputBlur = new EventEmitter();
        this.inputFocus = new EventEmitter();
        this.prefixTemplateList = new QueryList();
        this.readonly = false;
        this.suffixTemplateList = new QueryList();
    }
    ngOnInit() { }
    onValueChange(value) {
        this.value = value;
        this.propagateChange?.(value);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        if (obj != null) {
            this.value = obj;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TextBoxComponent, selector: "mona-text-box", inputs: { disabled: "disabled", readonly: "readonly" }, outputs: { inputBlur: "inputBlur", inputFocus: "inputFocus" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TextBoxComponent),
                multi: true
            }
        ], queries: [{ propertyName: "prefixTemplateList", predicate: TextBoxPrefixTemplateDirective, read: TemplateRef }, { propertyName: "suffixTemplateList", predicate: TextBoxSuffixTemplateDirective, read: TemplateRef }], ngImport: i0, template: "<div class=\"mona-text-box\">\n    <ng-container *ngFor=\"let prefixTemplate of prefixTemplateList\">\n        <span class=\"mona-text-box-prefix\">\n            <ng-container *ngTemplateOutlet=\"prefixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n    <input [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"value\" (ngModelChange)=\"onValueChange($event)\" (blur)=\"inputBlur.emit($event)\" (focus)=\"inputFocus.emit($event)\" monaTextBox />\n    <ng-container *ngFor=\"let suffixTemplate of suffixTemplateList\">\n        <span class=\"mona-text-box-suffix\">\n            <ng-container *ngTemplateOutlet=\"suffixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n</div>\n", styles: ["div.mona-text-box{height:var(--mona-input-height);display:flex}div.mona-text-box>[monaTextBox]{border:none;height:100%;width:100%}div.mona-text-box>[monaTextBox]:active,div.mona-text-box>[monaTextBox]:focus,div.mona-text-box>[monaTextBox]:focus-within{box-shadow:none}span.mona-text-box-prefix,span.mona-text-box-suffix{min-width:var(--mona-input-height);max-width:var(--mona-input-height);height:100%;display:inline-flex;align-items:center;justify-content:center}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i5$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: TextBoxDirective, selector: "input[monaTextBox]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-text-box", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TextBoxComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-text-box\">\n    <ng-container *ngFor=\"let prefixTemplate of prefixTemplateList\">\n        <span class=\"mona-text-box-prefix\">\n            <ng-container *ngTemplateOutlet=\"prefixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n    <input [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"value\" (ngModelChange)=\"onValueChange($event)\" (blur)=\"inputBlur.emit($event)\" (focus)=\"inputFocus.emit($event)\" monaTextBox />\n    <ng-container *ngFor=\"let suffixTemplate of suffixTemplateList\">\n        <span class=\"mona-text-box-suffix\">\n            <ng-container *ngTemplateOutlet=\"suffixTemplate\"></ng-container>\n        </span>\n    </ng-container>\n</div>\n", styles: ["div.mona-text-box{height:var(--mona-input-height);display:flex}div.mona-text-box>[monaTextBox]{border:none;height:100%;width:100%}div.mona-text-box>[monaTextBox]:active,div.mona-text-box>[monaTextBox]:focus,div.mona-text-box>[monaTextBox]:focus-within{box-shadow:none}span.mona-text-box-prefix,span.mona-text-box-suffix{min-width:var(--mona-input-height);max-width:var(--mona-input-height);height:100%;display:inline-flex;align-items:center;justify-content:center}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], inputBlur: [{
                type: Output
            }], inputFocus: [{
                type: Output
            }], prefixTemplateList: [{
                type: ContentChildren,
                args: [TextBoxPrefixTemplateDirective, { read: TemplateRef }]
            }], readonly: [{
                type: Input
            }], suffixTemplateList: [{
                type: ContentChildren,
                args: [TextBoxSuffixTemplateDirective, { read: TemplateRef }]
            }] } });

class DatePickerComponent extends AbstractDatePickerComponent {
    constructor(cdr, elementRef, focusMonitor, popupService) {
        super(cdr, elementRef, focusMonitor, popupService);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.popupService = popupService;
        this.format = "dd/MM/yyyy";
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1$2.FocusMonitor }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: DatePickerComponent, selector: "mona-date-picker", inputs: { format: "format" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DatePickerComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-date-picker\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onDateInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onDateInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"dateIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #datePopupTemplate>\n    <mona-calendar [disabledDates]=\"disabledDates\" [min]=\"min\" [max]=\"max\" [value]=\"value\" (valueChange)=\"onCalendarValueChange($event)\"></mona-calendar>\n</ng-template>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: TextBoxSuffixTemplateDirective, selector: "ng-template[monaTextBoxSuffixTemplate]" }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: CalendarComponent, selector: "mona-calendar" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-date-picker", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DatePickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-date-picker\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onDateInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onDateInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"dateIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #datePopupTemplate>\n    <mona-calendar [disabledDates]=\"disabledDates\" [min]=\"min\" [max]=\"max\" [value]=\"value\" (valueChange)=\"onCalendarValueChange($event)\"></mona-calendar>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1$2.FocusMonitor }, { type: PopupService }]; }, propDecorators: { format: [{
                type: Input
            }] } });

class TextBoxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TextBoxModule, declarations: [TextBoxDirective, TextBoxComponent, TextBoxPrefixTemplateDirective, TextBoxSuffixTemplateDirective], imports: [CommonModule, FormsModule], exports: [TextBoxDirective, TextBoxComponent, TextBoxPrefixTemplateDirective, TextBoxSuffixTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxModule, imports: [CommonModule, FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextBoxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TextBoxDirective, TextBoxComponent, TextBoxPrefixTemplateDirective, TextBoxSuffixTemplateDirective],
                    imports: [CommonModule, FormsModule],
                    exports: [TextBoxDirective, TextBoxComponent, TextBoxPrefixTemplateDirective, TextBoxSuffixTemplateDirective]
                }]
        }] });

class DatePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, declarations: [DatePickerComponent], imports: [CommonModule,
            SlicePipe,
            DateComparerPipe,
            TextBoxModule,
            FormsModule,
            FontAwesomeModule,
            ButtonModule,
            CalendarModule], exports: [DatePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, imports: [CommonModule,
            TextBoxModule,
            FormsModule,
            FontAwesomeModule,
            ButtonModule,
            CalendarModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DatePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DatePickerComponent],
                    imports: [
                        CommonModule,
                        SlicePipe,
                        DateComparerPipe,
                        TextBoxModule,
                        FormsModule,
                        FontAwesomeModule,
                        ButtonModule,
                        CalendarModule
                    ],
                    exports: [DatePickerComponent]
                }]
        }] });

class TimeSelectorComponent extends AbstractDateInputComponent {
    constructor(cdr, elementRef) {
        super(cdr);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.hour = null;
        this.hours = [];
        this.meridiem = "AM";
        this.minute = null;
        this.minutes = [];
        this.second = null;
        this.seconds = [];
        this.format = "HH:mm";
        this.hourFormat = "24";
        this.showSeconds = false;
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            const lists = this.elementRef.nativeElement.querySelectorAll("ol");
            for (const list of lists) {
                this.scrollList(list);
            }
        }, 0);
    }
    ngOnInit() {
        super.ngOnInit();
        this.hours = this.hourFormat === "24" ? Enumerable.range(0, 24).toArray() : Enumerable.range(1, 12).toArray();
        this.minutes = Enumerable.range(0, 60).toArray();
        this.seconds = Enumerable.range(0, 60).toArray();
        if (this.value) {
            this.navigatedDate = this.value;
            this.meridiem = this.navigatedDate.getHours() >= 12 ? "PM" : "AM";
            this.updateHour();
            this.updateMinute();
            this.updateSecond();
        }
    }
    onHourChange(value) {
        this.hour = value;
        if (!this.navigatedDate) {
            const now = this.minute != null ? DateTime.now().set({ minute: this.minute }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        if (this.hour < 0) {
            this.hour = 23;
        }
        let newHour;
        if (this.hourFormat === "24") {
            newHour = this.hour % 24;
        }
        else {
            newHour = this.hour % 12;
            if (this.meridiem === "PM") {
                newHour += 12;
            }
        }
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ hour: newHour }).toJSDate();
        if (this.hourFormat === "12") {
            this.hour = newHour % 12 || 12;
        }
        this.setCurrentDate(this.navigatedDate);
        this.scrollList(this.hoursListElement.nativeElement, newHour);
    }
    onMeridiemClick(meridiem) {
        if (this.readonly && this.meridiem === meridiem) {
            return;
        }
        const date = DateTime.now().toJSDate();
        this.meridiem = meridiem;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate ?? date)
            .set({ hour: (this.navigatedDate ?? date).getHours() + (meridiem === "AM" ? -12 : 12) })
            .toJSDate();
        this.updateHour();
        this.updateMinute();
        this.updateSecond();
        this.setCurrentDate(this.navigatedDate);
    }
    onMinuteChange(value) {
        this.minute = value;
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const minute = +this.minute > 59 ? 0 : +this.minute < 0 ? 59 : +this.minute;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ minute }).toJSDate();
        this.minute = minute;
        this.setCurrentDate(this.navigatedDate);
        this.scrollList(this.minutesListElement.nativeElement, minute);
    }
    onSecondChange(value) {
        this.second = value;
        if (!this.navigatedDate) {
            const now = this.hour != null ? DateTime.now().set({ hour: this.hour }) : DateTime.now();
            this.navigatedDate = now.toJSDate();
        }
        const second = +this.second > 59 ? 0 : +this.second < 0 ? 59 : +this.second;
        this.navigatedDate = DateTime.fromJSDate(this.navigatedDate).set({ second }).toJSDate();
        this.second = second;
        this.scrollList(this.secondsListElement.nativeElement, second);
        this.setCurrentDate(this.navigatedDate);
    }
    scrollList(list, value) {
        if (value == null) {
            window.setTimeout(() => {
                const selectedElement = list.querySelector(".mona-selected");
                if (selectedElement) {
                    selectedElement.scrollIntoView({ behavior: "auto", block: "center" });
                }
            }, 0);
        }
        else {
            const element = list.querySelector(`[data-value="${value}"]`);
            if (element) {
                element.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }
    updateHour() {
        if (this.navigatedDate) {
            this.hour =
                this.hourFormat === "12" ? this.navigatedDate.getHours() % 12 || 12 : this.navigatedDate.getHours();
        }
    }
    updateMinute() {
        if (this.navigatedDate) {
            this.minute = this.navigatedDate.getMinutes();
        }
    }
    updateSecond() {
        if (this.navigatedDate) {
            this.second = this.navigatedDate.getSeconds();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TimeSelectorComponent, selector: "mona-time-selector", inputs: { format: "format", hourFormat: "hourFormat", showSeconds: "showSeconds" }, viewQueries: [{ propertyName: "hoursListElement", first: true, predicate: ["hoursListElement"], descendants: true }, { propertyName: "minutesListElement", first: true, predicate: ["minutesListElement"], descendants: true }, { propertyName: "secondsListElement", first: true, predicate: ["secondsListElement"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-time-selector\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <ol #hoursListElement>\n        <li *ngFor=\"let h of hours\" [ngClass]=\"{'mona-selected':h===hour}\" (click)=\"onHourChange(h)\" [attr.data-value]=\"h\">{{h | number:'2.0'}}</li>\n    </ol>\n    <ol #minutesListElement>\n        <li *ngFor=\"let m of minutes\" [ngClass]=\"{'mona-selected':m===minute}\" (click)=\"onMinuteChange(m)\"  [attr.data-value]=\"m\">{{m | number:'2.0'}}</li>\n    </ol>\n    <ol #secondsListElement *ngIf=\"showSeconds\">\n        <li *ngFor=\"let s of seconds\" [ngClass]=\"{'mona-selected':s===second}\" (click)=\"onSecondChange(s)\" [attr.data-value]=\"s\">{{s | number:'2.0'}}</li>\n    </ol>\n    <ol *ngIf=\"hourFormat==='12'\">\n        <li [ngClass]=\"{'mona-selected': meridiem==='AM'}\" (click)=\"onMeridiemClick('AM')\">AM</li>\n        <li [ngClass]=\"{'mona-selected': meridiem==='PM'}\" (click)=\"onMeridiemClick('PM')\">PM</li>\n    </ol>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-time-selector{display:flex;width:100%;height:250px;overflow:hidden}div.mona-time-selector ol{flex:1;display:flex;list-style:none;flex-direction:column;overflow:hidden auto}div.mona-time-selector ol li{display:flex;align-items:center;justify-content:center;padding:8px 0;font-weight:700}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "pipe", type: i1.DecimalPipe, name: "number" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-time-selector", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-time-selector\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <ol #hoursListElement>\n        <li *ngFor=\"let h of hours\" [ngClass]=\"{'mona-selected':h===hour}\" (click)=\"onHourChange(h)\" [attr.data-value]=\"h\">{{h | number:'2.0'}}</li>\n    </ol>\n    <ol #minutesListElement>\n        <li *ngFor=\"let m of minutes\" [ngClass]=\"{'mona-selected':m===minute}\" (click)=\"onMinuteChange(m)\"  [attr.data-value]=\"m\">{{m | number:'2.0'}}</li>\n    </ol>\n    <ol #secondsListElement *ngIf=\"showSeconds\">\n        <li *ngFor=\"let s of seconds\" [ngClass]=\"{'mona-selected':s===second}\" (click)=\"onSecondChange(s)\" [attr.data-value]=\"s\">{{s | number:'2.0'}}</li>\n    </ol>\n    <ol *ngIf=\"hourFormat==='12'\">\n        <li [ngClass]=\"{'mona-selected': meridiem==='AM'}\" (click)=\"onMeridiemClick('AM')\">AM</li>\n        <li [ngClass]=\"{'mona-selected': meridiem==='PM'}\" (click)=\"onMeridiemClick('PM')\">PM</li>\n    </ol>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-time-selector{display:flex;width:100%;height:250px;overflow:hidden}div.mona-time-selector ol{flex:1;display:flex;list-style:none;flex-direction:column;overflow:hidden auto}div.mona-time-selector ol li{display:flex;align-items:center;justify-content:center;padding:8px 0;font-weight:700}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { format: [{
                type: Input
            }], hourFormat: [{
                type: Input
            }], hoursListElement: [{
                type: ViewChild,
                args: ["hoursListElement"]
            }], minutesListElement: [{
                type: ViewChild,
                args: ["minutesListElement"]
            }], secondsListElement: [{
                type: ViewChild,
                args: ["secondsListElement"]
            }], showSeconds: [{
                type: Input
            }] } });

class DateTimePickerComponent extends AbstractDatePickerComponent {
    constructor(cdr, elementRef, focusMonitor, popupService) {
        super(cdr, elementRef, focusMonitor, popupService);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.popupService = popupService;
        this.timeIcon = faClock;
        this.format = "dd/MM/yyyy HH:mm";
        this.hourFormat = "24";
        this.showSeconds = false;
    }
    onTimeInputButtonClick() {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.popupAnchor,
            content: this.timePopupTemplateRef,
            width: this.elementRef.nativeElement.clientWidth,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            withPush: false,
            closeOnOutsideClick: true
        });
    }
    onTimeSelectorValueChange(date) {
        this.setCurrentDate(date);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1$2.FocusMonitor }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: DateTimePickerComponent, selector: "mona-date-time-picker", inputs: { format: "format", hourFormat: "hourFormat", showSeconds: "showSeconds" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => DateTimePickerComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "timePopupTemplateRef", first: true, predicate: ["timePopupTemplate"], descendants: true }], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-date-time-picker\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onDateInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onDateInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"dateIcon\"></fa-icon>\n            </button>\n        </ng-template>\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onTimeInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"timeIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #datePopupTemplate>\n    <mona-calendar [disabledDates]=\"disabledDates\" [min]=\"min\" [max]=\"max\" [value]=\"value\" (valueChange)=\"onCalendarValueChange($event)\"></mona-calendar>\n</ng-template>\n\n<ng-template #timePopupTemplate>\n    <mona-time-selector [value]=\"value\" (valueChange)=\"onTimeSelectorValueChange($event)\"\n                        [hourFormat]=\"hourFormat\" [showSeconds]=\"showSeconds\"></mona-time-selector>\n</ng-template>\n", styles: ["div.mona-date-time-picker-times{display:flex;flex-direction:column;width:100%;align-items:center;justify-content:center;-webkit-user-select:none;user-select:none}div.mona-date-time-picker-times>div:first-child{display:flex}div.mona-date-time-picker-times>div:first-child>div{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 4px}div.mona-date-time-picker-times>div:first-child>div>span{font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center}div.mona-date-time-picker-times>div:first-child>div mona-numeric-text-box{width:64px}div.mona-date-time-picker-times>div:last-child{padding:16px 0 0}div.mona-date-time-picker-times>div:last-child>button:not(:last-child){margin-right:4px}div.mona-date-time-picker-times fa-icon{font-size:18px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: TextBoxSuffixTemplateDirective, selector: "ng-template[monaTextBoxSuffixTemplate]" }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: CalendarComponent, selector: "mona-calendar" }, { kind: "component", type: TimeSelectorComponent, selector: "mona-time-selector", inputs: ["format", "hourFormat", "showSeconds"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-date-time-picker", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => DateTimePickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-date-time-picker\" [ngClass]=\"{'mona-disabled': disabled}\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onDateInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onDateInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"dateIcon\"></fa-icon>\n            </button>\n        </ng-template>\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onTimeInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"timeIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #datePopupTemplate>\n    <mona-calendar [disabledDates]=\"disabledDates\" [min]=\"min\" [max]=\"max\" [value]=\"value\" (valueChange)=\"onCalendarValueChange($event)\"></mona-calendar>\n</ng-template>\n\n<ng-template #timePopupTemplate>\n    <mona-time-selector [value]=\"value\" (valueChange)=\"onTimeSelectorValueChange($event)\"\n                        [hourFormat]=\"hourFormat\" [showSeconds]=\"showSeconds\"></mona-time-selector>\n</ng-template>\n", styles: ["div.mona-date-time-picker-times{display:flex;flex-direction:column;width:100%;align-items:center;justify-content:center;-webkit-user-select:none;user-select:none}div.mona-date-time-picker-times>div:first-child{display:flex}div.mona-date-time-picker-times>div:first-child>div{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 4px}div.mona-date-time-picker-times>div:first-child>div>span{font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center}div.mona-date-time-picker-times>div:first-child>div mona-numeric-text-box{width:64px}div.mona-date-time-picker-times>div:last-child{padding:16px 0 0}div.mona-date-time-picker-times>div:last-child>button:not(:last-child){margin-right:4px}div.mona-date-time-picker-times fa-icon{font-size:18px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1$2.FocusMonitor }, { type: PopupService }]; }, propDecorators: { format: [{
                type: Input
            }], hourFormat: [{
                type: Input
            }], showSeconds: [{
                type: Input
            }], timePopupTemplateRef: [{
                type: ViewChild,
                args: ["timePopupTemplate"]
            }] } });

class NumericTextBoxComponent {
    set value(value) {
        this.updateValue(value == null ? null : String(value), false);
    }
    get value() {
        return this.componentValue;
    }
    constructor(elementRef, focusMonitor) {
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.componentDestroy$ = new Subject();
        this.specialKeys = [
            "Backspace",
            "Tab",
            "End",
            "Home",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Delete",
            "Escaped"
        ];
        this.propagateChange = null;
        this.decreaseIcon = faChevronDown;
        this.increaseIcon = faChevronUp;
        this.componentValue = null;
        this.spin$ = new Subject();
        this.spinStop$ = new Subject();
        this.value$ = new Subject();
        this.visibleValue = "";
        this.decimals = 0;
        this.disabled = false;
        this.formatter = (value) => value?.toFixed(this.decimals ?? 2) ?? "";
        this.inputBlur = new EventEmitter();
        this.inputFocus = new EventEmitter();
        this.readonly = false;
        this.spinners = true;
        this.step = 1;
        this.valueChange = new EventEmitter();
    }
    static calculate(value, step, type) {
        const precision = Math.max(NumericTextBoxComponent.getPrecision(value), NumericTextBoxComponent.getPrecision(step));
        const factor = Math.pow(10, precision);
        const signFactor = type === "+" ? 1 : -1;
        const newValue = (value * factor + signFactor * step * factor) / factor;
        return precision > 0 ? parseFloat(newValue.toFixed(precision)) : newValue;
    }
    static getPrecision(value) {
        const valueString = value.toString();
        if (valueString.includes(".")) {
            const parts = valueString.split(".");
            return parts[1].length;
        }
        return 0;
    }
    static isNumeric(value) {
        return ((typeof value === "number" || (typeof value === "string" && value.trim() !== "")) && !isNaN(value));
    }
    decrease() {
        if (this.componentValue == null) {
            this.value$.next("0");
        }
        else {
            let result = NumericTextBoxComponent.calculate(this.componentValue, this.step, "-");
            if (this.min != null && result < this.min) {
                result = this.min;
            }
            this.value$.next(result.toString());
        }
        this.focus();
    }
    increase() {
        if (this.componentValue == null) {
            this.value$.next("0");
        }
        else {
            let result = NumericTextBoxComponent.calculate(this.componentValue, this.step, "+");
            if (this.max != null && result > this.max) {
                result = this.max;
            }
            this.value$.next(result.toString());
        }
        this.focus();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.spinStop$.next();
        this.spinStop$.complete();
        this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
    }
    ngOnInit() {
        this.setSubscriptions();
        this.focusMonitor
            .monitor(this.elementRef, true)
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((focusOrigin) => {
            if (!focusOrigin) {
                this.visibleValue = this.formatter(this.componentValue) ?? "";
            }
            else {
                this.visibleValue = this.componentValue ?? "";
            }
        });
    }
    onKeydown(event) {
        if (event.ctrlKey) {
            return;
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            this.increase();
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            this.decrease();
            return;
        }
        if (!this.specialKeys.includes(event.key)) {
            if (this.preventInvalidMinusSign(event)) {
                return;
            }
            if (!event.key.match(/[0-9.,\-]/)) {
                event.preventDefault();
                return;
            }
            if (this.containsExcessiveDecimalPlaces(event)) {
                event.preventDefault();
            }
        }
    }
    onMouseWheel(event) {
        event.preventDefault();
        if (event.deltaY < 0) {
            this.increase();
        }
        else {
            this.decrease();
        }
    }
    onPaste(event) {
        const pastedData = event.clipboardData?.getData("Text");
        if (!pastedData || !NumericTextBoxComponent.isNumeric(pastedData)) {
            event.preventDefault();
        }
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) { }
    writeValue(obj) {
        if (obj == null) {
            this.componentValue = null;
            this.visibleValue = this.formatter(this.componentValue) ?? "";
            return;
        }
        if (typeof obj === "string" && !NumericTextBoxComponent.isNumeric(obj)) {
            throw new Error("Value must be a number.");
        }
        this.componentValue = +obj;
        this.visibleValue = this.formatter(this.componentValue) ?? "";
    }
    containsExcessiveDecimalPlaces(event) {
        const target = event.target;
        if (this.componentValue != null) {
            if (event.key === ".") {
                return this.decimals === 0;
            }
            const valueStr = this.componentValue.toString();
            if (!valueStr.includes(".")) {
                return false;
            }
            const valueParts = valueStr.split(".");
            if (this.decimals != null &&
                valueParts[1].length >= this.decimals &&
                target.selectionStart &&
                target.selectionStart > valueParts[0].length) {
                return true;
            }
        }
        return false;
    }
    focus() {
        this.focusMonitor.focusVia(this.valueTextBoxRef, "keyboard");
    }
    preventInvalidMinusSign(event) {
        const target = event.target;
        if (event.key === "-") {
            if (target.selectionStart !== 0) {
                event.preventDefault();
                return true;
            }
            if (target.selectionStart === 0 && this.componentValue?.toString().charAt(0) === "-") {
                event.preventDefault();
                return true;
            }
        }
        return false;
    }
    setSubscriptions() {
        this.value$.pipe(takeUntil(this.componentDestroy$)).subscribe((value) => {
            this.updateValue(value);
        });
        this.spin$.pipe(takeUntil(this.componentDestroy$)).subscribe((sign) => {
            if (sign === "-") {
                this.decrease();
            }
            else {
                this.increase();
            }
            interval(100)
                .pipe(delay(300), takeUntil(this.spinStop$))
                .subscribe(() => {
                if (sign === "-") {
                    this.decrease();
                }
                else {
                    this.increase();
                }
            });
        });
    }
    updateValue(value, emit = true) {
        if (this.readonly) {
            return;
        }
        this.componentValue =
            value == null ? null : NumericTextBoxComponent.isNumeric(value) ? parseFloat(value) : null;
        this.visibleValue = this.componentValue == null ? "" : this.componentValue;
        if (emit) {
            this.valueChange.emit(this.componentValue);
            this.propagateChange?.(this.componentValue);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxComponent, deps: [{ token: i0.ElementRef }, { token: i1$2.FocusMonitor }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: NumericTextBoxComponent, selector: "mona-numeric-text-box", inputs: { decimals: "decimals", disabled: "disabled", formatter: "formatter", max: "max", min: "min", readonly: "readonly", spinners: "spinners", step: "step", value: "value" }, outputs: { inputBlur: "inputBlur", inputFocus: "inputFocus", valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => NumericTextBoxComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "valueTextBoxRef", first: true, predicate: ["valueTextBox"], descendants: true }], ngImport: i0, template: "<div class=\"mona-numeric-text-box\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <input monaTextBox [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"visibleValue\" (ngModelChange)=\"value$.next($event)\"\n           (keydown)=\"onKeydown($event)\" (paste)=\"onPaste($event)\" (wheel)=\"onMouseWheel($event)\" (focus)=\"inputFocus.emit($event)\"\n           (blur)=\"inputBlur.emit($event)\"\n           autocomplete=\"off\" tabindex=\"0\" #valueTextBox>\n    <div class=\"mona-numeric-text-box-spinners\" *ngIf=\"spinners\">\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('+')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"increaseIcon\"></fa-icon>\n        </button>\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('-')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"decreaseIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n", styles: ["div.mona-numeric-text-box{height:var(--mona-input-height);display:flex}div.mona-numeric-text-box>[monaTextBox]{width:100%;height:100%;border:none}div.mona-numeric-text-box-spinners{display:flex;flex-direction:column;flex-wrap:nowrap;border-left:1px solid var(--mona-border-color)}div.mona-numeric-text-box-spinners>[monaButton]{min-height:0;display:flex;align-items:center;justify-content:center;border-right:none;border-left:none;flex:1 1 50%;font-size:10px;cursor:pointer}div.mona-numeric-text-box-spinners>[monaButton] fa-icon{display:flex}div.mona-numeric-text-box-spinners>[monaButton]:first-child{border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:first-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:last-child{border-bottom:none;border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:last-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:active,div.mona-numeric-text-box-spinners>[monaButton]:focus,div.mona-numeric-text-box-spinners>[monaButton]:focus-within{box-shadow:none}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "directive", type: TextBoxDirective, selector: "input[monaTextBox]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-numeric-text-box", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => NumericTextBoxComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-numeric-text-box\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <input monaTextBox [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"visibleValue\" (ngModelChange)=\"value$.next($event)\"\n           (keydown)=\"onKeydown($event)\" (paste)=\"onPaste($event)\" (wheel)=\"onMouseWheel($event)\" (focus)=\"inputFocus.emit($event)\"\n           (blur)=\"inputBlur.emit($event)\"\n           autocomplete=\"off\" tabindex=\"0\" #valueTextBox>\n    <div class=\"mona-numeric-text-box-spinners\" *ngIf=\"spinners\">\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('+')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"increaseIcon\"></fa-icon>\n        </button>\n        <button monaButton [disabled]=\"disabled\" [tabIndex]=\"-1\" (mousedown)=\"spin$.next('-')\" (mouseup)=\"spinStop$.next()\">\n            <fa-icon [icon]=\"decreaseIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n", styles: ["div.mona-numeric-text-box{height:var(--mona-input-height);display:flex}div.mona-numeric-text-box>[monaTextBox]{width:100%;height:100%;border:none}div.mona-numeric-text-box-spinners{display:flex;flex-direction:column;flex-wrap:nowrap;border-left:1px solid var(--mona-border-color)}div.mona-numeric-text-box-spinners>[monaButton]{min-height:0;display:flex;align-items:center;justify-content:center;border-right:none;border-left:none;flex:1 1 50%;font-size:10px;cursor:pointer}div.mona-numeric-text-box-spinners>[monaButton] fa-icon{display:flex}div.mona-numeric-text-box-spinners>[monaButton]:first-child{border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:first-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:last-child{border-bottom:none;border-top:none}div.mona-numeric-text-box-spinners>[monaButton]:last-child>span{transform:rotate(270deg)}div.mona-numeric-text-box-spinners>[monaButton]:active,div.mona-numeric-text-box-spinners>[monaButton]:focus,div.mona-numeric-text-box-spinners>[monaButton]:focus-within{box-shadow:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1$2.FocusMonitor }]; }, propDecorators: { decimals: [{
                type: Input
            }], disabled: [{
                type: Input
            }], formatter: [{
                type: Input
            }], inputBlur: [{
                type: Output
            }], inputFocus: [{
                type: Output
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], readonly: [{
                type: Input
            }], spinners: [{
                type: Input
            }], step: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], valueTextBoxRef: [{
                type: ViewChild,
                args: ["valueTextBox"]
            }] } });

class NumericTextBoxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, declarations: [NumericTextBoxComponent], imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule, TextBoxModule], exports: [NumericTextBoxComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule, TextBoxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: NumericTextBoxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NumericTextBoxComponent],
                    imports: [CommonModule, FormsModule, FontAwesomeModule, ButtonModule, TextBoxModule],
                    exports: [NumericTextBoxComponent]
                }]
        }] });

class TimeSelectorModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, declarations: [TimeSelectorComponent], imports: [CommonModule, NumericTextBoxModule, FormsModule, ButtonGroupModule, ButtonModule], exports: [TimeSelectorComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, imports: [CommonModule, NumericTextBoxModule, FormsModule, ButtonGroupModule, ButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimeSelectorModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimeSelectorComponent],
                    imports: [CommonModule, NumericTextBoxModule, FormsModule, ButtonGroupModule, ButtonModule],
                    exports: [TimeSelectorComponent]
                }]
        }] });

class DateTimePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, declarations: [DateTimePickerComponent], imports: [CommonModule,
            TextBoxModule,
            PopupModule,
            FontAwesomeModule,
            ButtonModule,
            SlicePipe,
            FormsModule,
            DateComparerPipe,
            ButtonGroupModule,
            NumericTextBoxModule,
            CalendarModule,
            TimeSelectorModule], exports: [DateTimePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, imports: [CommonModule,
            TextBoxModule,
            PopupModule,
            FontAwesomeModule,
            ButtonModule,
            FormsModule,
            ButtonGroupModule,
            NumericTextBoxModule,
            CalendarModule,
            TimeSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateTimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [DateTimePickerComponent],
                    imports: [
                        CommonModule,
                        TextBoxModule,
                        PopupModule,
                        FontAwesomeModule,
                        ButtonModule,
                        SlicePipe,
                        FormsModule,
                        DateComparerPipe,
                        ButtonGroupModule,
                        NumericTextBoxModule,
                        CalendarModule,
                        TimeSelectorModule
                    ],
                    exports: [DateTimePickerComponent]
                }]
        }] });

class TimePickerComponent extends AbstractDateInputComponent {
    constructor(cdr, elementRef, focusMonitor, popupService) {
        super(cdr);
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.popupService = popupService;
        this.timeIcon = faClock;
        this.hourFormat = "24";
        this.showSeconds = false;
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
    }
    ngOnInit() {
        super.ngOnInit();
    }
    onDateStringEdit(dateString) {
        this.currentDateString = dateString;
    }
    onTimeInputBlur() {
        if (this.popupRef) {
            return;
        }
        const dateTime = DateTime.fromFormat(this.currentDateString, this.format);
        if (this.dateStringEquals(dateTime.toJSDate(), this.value)) {
            return;
        }
        if (dateTime.isValid) {
            this.setCurrentDate(dateTime.toJSDate());
        }
        else {
            this.setCurrentDate(null);
        }
    }
    onTimeInputButtonClick() {
        if (!this.timePopupTemplateRef || this.readonly) {
            return;
        }
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: this.timePopupTemplateRef,
            width: this.popupAnchor.nativeElement.clientWidth,
            popupClass: "mona-time-picker-popup",
            hasBackdrop: false,
            closeOnOutsideClick: true
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.focusMonitor.focusVia(this.elementRef.nativeElement.querySelector("input"), "program");
        });
    }
    onTimeSelectorValueChange(date) {
        this.setCurrentDate(date);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1$2.FocusMonitor }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TimePickerComponent, selector: "mona-time-picker", inputs: { hourFormat: "hourFormat", showSeconds: "showSeconds" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => TimePickerComponent),
                multi: true
            }
        ], viewQueries: [{ propertyName: "timePopupTemplateRef", first: true, predicate: ["timePopupTemplate"], descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-time-picker\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onTimeInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onTimeInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"timeIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #timePopupTemplate>\n    <mona-time-selector [value]=\"value\" (valueChange)=\"onTimeSelectorValueChange($event)\" [hourFormat]=\"hourFormat\" [showSeconds]=\"showSeconds\"></mona-time-selector>\n</ng-template>\n", styles: ["div.mona-time-picker{display:flex;position:relative}ol{list-style:none;margin:0;background-color:var(--mona-background-dark);height:150px;overflow-y:scroll;scrollbar-width:none;padding:75px 5px}ol::-webkit-scrollbar{display:none}ol li{display:flex;align-items:center;justify-content:center;padding:2px 8px;color:var(--mona-text)}span.mona-time-picker-highlight{display:block;position:absolute;height:var(--mona-input-height);background-color:var(--mona-background-light);border:1px solid var(--mona-border-color);top:calc(50% + 10px);width:100%}\n"], dependencies: [{ kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: TextBoxSuffixTemplateDirective, selector: "ng-template[monaTextBoxSuffixTemplate]" }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: TimeSelectorComponent, selector: "mona-time-selector", inputs: ["format", "hourFormat", "showSeconds"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-time-picker", changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => TimePickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-time-picker\" #popupAnchor>\n    <mona-text-box [disabled]=\"disabled\" [readonly]=\"readonly\" [ngModel]=\"currentDateString\" (ngModelChange)=\"onDateStringEdit($event)\" (inputBlur)=\"onTimeInputBlur()\">\n        <ng-template monaTextBoxSuffixTemplate>\n            <button monaButton [flat]=\"true\" (click)=\"onTimeInputButtonClick()\" [disabled]=\"disabled\" [tabIndex]=\"-1\">\n                <fa-icon [icon]=\"timeIcon\"></fa-icon>\n            </button>\n        </ng-template>\n    </mona-text-box>\n</div>\n\n<ng-template #timePopupTemplate>\n    <mona-time-selector [value]=\"value\" (valueChange)=\"onTimeSelectorValueChange($event)\" [hourFormat]=\"hourFormat\" [showSeconds]=\"showSeconds\"></mona-time-selector>\n</ng-template>\n", styles: ["div.mona-time-picker{display:flex;position:relative}ol{list-style:none;margin:0;background-color:var(--mona-background-dark);height:150px;overflow-y:scroll;scrollbar-width:none;padding:75px 5px}ol::-webkit-scrollbar{display:none}ol li{display:flex;align-items:center;justify-content:center;padding:2px 8px;color:var(--mona-text)}span.mona-time-picker-highlight{display:block;position:absolute;height:var(--mona-input-height);background-color:var(--mona-background-light);border:1px solid var(--mona-border-color);top:calc(50% + 10px);width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1$2.FocusMonitor }, { type: PopupService }]; }, propDecorators: { hourFormat: [{
                type: Input
            }], showSeconds: [{
                type: Input
            }], timePopupTemplateRef: [{
                type: ViewChild,
                args: ["timePopupTemplate"]
            }] } });

class PopupListItem {
    constructor(options) {
        this.highlighted = false;
        this.selected = false;
        this.data = options.data;
        this.text = options.text;
        this.textField = options.textField;
        this.value = options.value;
        this.valueField = options.valueField;
        this.disabled = options.disabled ?? false;
    }
    dataEquals(other) {
        if (!other) {
            return false;
        }
        if (this.valueField) {
            return this.data[this.valueField] === other[this.valueField];
        }
        return this.value === other;
    }
}

class PopupListService {
    constructor() {
        this.scrollToListItem$ = new Subject();
        this.filterModeActive = false;
        this.sourceListData = new List();
        this.viewListData = new List();
    }
    static findFirstSelectedItem(items) {
        return items.selectMany(g => g.source).firstOrDefault(i => i.selected);
    }
    static findLastSelectedItem(items) {
        return items.selectMany(g => g.source).lastOrDefault(i => i.selected);
    }
    static findNextSelectableItem(items, item) {
        return (items
            .selectMany(g => g.source)
            .skipWhile(i => !i.dataEquals(item.data))
            .skip(1)
            .firstOrDefault(i => !i.disabled) ?? null);
    }
    static findPreviousSelectableItem(items, item) {
        return (items
            .selectMany(g => g.source)
            .reverse()
            .skipWhile(i => !i.dataEquals(item.data))
            .skip(1)
            .firstOrDefault(i => !i.disabled) ?? null);
    }
    static getItemDisablerAction(disabler) {
        if (typeof disabler === "string") {
            return (item) => !!item?.[disabler] ?? false;
        }
        return disabler;
    }
    static isFirstSelectableItem(items, item) {
        return PopupListService.findPreviousSelectableItem(items, item) === null;
    }
    static isLastSelectableItem(items, item) {
        return PopupListService.findNextSelectableItem(items, item) === null;
    }
    clearFilters() {
        this.viewListData = this.sourceListData.toList();
        this.viewListData.selectMany(g => g.source).forEach(i => (i.highlighted = false));
        this.filterModeActive = false;
    }
    filterItems(filter, selectionMode) {
        if (!filter) {
            this.clearFilters();
            return;
        }
        this.viewListData = this.sourceListData
            .select(g => {
            const filteredItems = g.source.where(i => i.text.toLowerCase().includes(filter.toLowerCase()));
            return new Group(g.key, filteredItems.toList());
        })
            .toList();
        if (selectionMode === "single") {
            const selectedItem = this.viewListData
                .selectMany(g => g.source)
                .where(i => i.selected)
                .firstOrDefault();
            if (selectedItem) {
                selectedItem.highlighted = true;
            }
            else {
                const firstItem = this.viewListData
                    .selectMany(g => g.source)
                    .where(i => !i.disabled)
                    .firstOrDefault();
                if (firstItem) {
                    firstItem.highlighted = true;
                }
            }
        }
        else {
            this.viewListData.selectMany(g => g.source).forEach(i => (i.highlighted = false));
            const firstItem = this.viewListData
                .selectMany(g => g.source)
                .where(i => !i.disabled)
                .firstOrDefault();
            if (firstItem) {
                firstItem.highlighted = true;
            }
        }
        this.filterModeActive = true;
    }
    getListItemsOfValues(values) {
        const popupListItems = [];
        values.forEach(v => {
            const item = this.sourceListData.selectMany(g => g.source).firstOrDefault(i => i.dataEquals(v));
            if (item) {
                popupListItems.push(item);
            }
        });
        return popupListItems;
    }
    initializeListData(params) {
        let listItems = new List();
        const createListItem = (item) => {
            return new PopupListItem({
                data: item,
                text: params.textField ? item[params.textField] : item,
                textField: params.textField,
                value: params.valueField ? item[params.valueField] : item,
                valueField: params.valueField
            });
        };
        if (params.groupField) {
            listItems = Enumerable.from(params.data)
                .groupBy(d => d[params.groupField])
                .select(g => new Group(g.key, g.select(d => createListItem(d)).toList()))
                .orderBy(g => g.key)
                .toList();
        }
        else {
            const items = Enumerable.from(params.data)
                .select(d => createListItem(d))
                .toList();
            listItems.add(new Group("", items));
        }
        const selectedItems = this.sourceListData
            .selectMany(g => g.source)
            .where(i => i.selected)
            .toList();
        this.sourceListData = listItems;
        this.viewListData = this.sourceListData.toList();
        this.sourceListData
            .selectMany(g => g.source)
            .forEach(i => {
            i.selected = selectedItems.any(s => s.dataEquals(i.data));
        });
        if (params.disabler) {
            const disablerAction = PopupListService.getItemDisablerAction(params.disabler);
            this.updateDisabledItems(disablerAction);
        }
        return listItems;
    }
    navigate(event, selectionMode) {
        const selectedItem = this.viewListData.selectMany(g => g.source).firstOrDefault(i => i.selected);
        const highlightedItem = this.viewListData.selectMany(g => g.source).firstOrDefault(i => i.highlighted);
        const firstItem = this.viewListData.selectMany(g => g.source).firstOrDefault(i => !i.disabled);
        const focusedItem = highlightedItem ?? selectedItem ?? null;
        let newItem = null;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (focusedItem && PopupListService.isLastSelectableItem(this.viewListData, focusedItem)) {
                if (this.filterModeActive && focusedItem.highlighted && !focusedItem.selected) {
                    focusedItem.highlighted = false;
                    focusedItem.selected = true;
                }
                return focusedItem;
            }
            const nextItem = !focusedItem
                ? firstItem
                : PopupListService.findNextSelectableItem(this.viewListData, focusedItem);
            if (nextItem) {
                if (selectionMode === "single") {
                    if (this.filterModeActive) {
                        if (focusedItem && focusedItem.highlighted && !focusedItem.selected) {
                            focusedItem.highlighted = false;
                            focusedItem.selected = true;
                            newItem = focusedItem;
                            return newItem;
                        }
                        else {
                            if (focusedItem) {
                                focusedItem.selected = false;
                                focusedItem.highlighted = false;
                                nextItem.selected = true;
                            }
                        }
                    }
                    else {
                        if (focusedItem) {
                            if (focusedItem.highlighted && !focusedItem.selected) {
                                focusedItem.highlighted = false;
                                focusedItem.selected = true;
                                newItem = focusedItem;
                                return newItem;
                            }
                            else {
                                focusedItem.selected = false;
                                focusedItem.highlighted = false;
                            }
                        }
                        nextItem.selected = true;
                    }
                }
                else {
                    nextItem.highlighted = true;
                    if (focusedItem) {
                        focusedItem.highlighted = false;
                    }
                }
                newItem = nextItem;
            }
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (focusedItem) {
                if (PopupListService.isFirstSelectableItem(this.viewListData, focusedItem)) {
                    return focusedItem;
                }
                const previousItem = PopupListService.findPreviousSelectableItem(this.viewListData, focusedItem);
                if (previousItem) {
                    if (selectionMode === "single") {
                        if (this.filterModeActive) {
                            if (focusedItem.highlighted && !focusedItem.selected) {
                                focusedItem.highlighted = false;
                                focusedItem.selected = true;
                                newItem = focusedItem;
                                return newItem;
                            }
                            else {
                                focusedItem.selected = false;
                                focusedItem.highlighted = false;
                                previousItem.selected = true;
                            }
                        }
                        else {
                            if (focusedItem.highlighted && !focusedItem.selected) {
                                focusedItem.highlighted = false;
                                focusedItem.selected = true;
                                newItem = focusedItem;
                                return newItem;
                            }
                            else {
                                focusedItem.selected = false;
                                previousItem.selected = true;
                            }
                        }
                    }
                    else {
                        focusedItem.highlighted = false;
                        previousItem.highlighted = true;
                    }
                    newItem = previousItem;
                }
            }
        }
        return newItem;
    }
    selectItem(item, selectionMode) {
        if (selectionMode === "single") {
            this.viewListData.selectMany(g => g.source).forEach(i => (i.selected = false));
            item.selected = true;
        }
        else {
            item.selected = !item.selected;
        }
    }
    updateDisabledItems(disablerAction) {
        this.sourceListData.selectMany(g => g.source).forEach(i => (i.disabled = disablerAction(i.data)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService) {
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.componentDestroy$ = new Subject();
        this.navigateWhileClosed = true;
        this.openOnEnter = false;
        this.clearIcon = faTimes;
        this.dropdownIcon = faChevronDown;
        this.popupRef = null;
        this.data = [];
        this.disabled = false;
        this.showClearButton = false;
    }
    close() {
        this.popupRef?.close();
        this.popupRef = null;
    }
    ngOnChanges(changes) {
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.popupListService.initializeListData({
                data: this.data,
                disabler: this.itemDisabler,
                textField: this.textField,
                valueField: this.valueField,
                groupField: this.groupField
            });
            this.updateValuePopupListItems();
        }
        if (changes["value"] && !changes["value"].isFirstChange()) {
            this.updateValuePopupListItems();
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.popupListService.initializeListData({
            data: this.data,
            disabler: this.itemDisabler,
            textField: this.textField,
            valueField: this.valueField,
            groupField: this.groupField
        });
        if (this.value) {
            if (this.selectionMode === "single") {
                this.valuePopupListItem = this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .singleOrDefault(d => d.dataEquals(this.value));
                if (this.valuePopupListItem) {
                    this.valuePopupListItem.selected = true;
                }
            }
            else {
                this.valuePopupListItem = this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .where(d => this.value.some(v => d.dataEquals(v)))
                    .toArray();
                this.valuePopupListItem.forEach(d => (d.selected = true));
            }
        }
        this.setEvents();
    }
    open(options = {}) {
        if (this.popupRef) {
            return this.popupRef;
        }
        this.dropdownWrapper.nativeElement.focus();
        this.popupRef = this.popupService.create({
            anchor: this.dropdownWrapper,
            content: this.popupTemplate,
            hasBackdrop: true,
            withPush: false,
            width: this.elementRef.nativeElement.offsetWidth,
            popupClass: ["mona-dropdown-popup-content"],
            positions: [
                new ConnectionPositionPair({ originX: "start", originY: "bottom" }, { overlayX: "start", overlayY: "top" })
            ],
            ...options
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            this.popupRef = null;
            this.elementRef.nativeElement.firstElementChild?.focus();
            this.popupListService.clearFilters();
        });
        return this.popupRef;
    }
    setEvents() {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            if (event.key === "Enter") {
                if (this.popupRef) {
                    if (this.selectionMode === "single") {
                        this.close();
                    }
                    return;
                }
                if (this.openOnEnter) {
                    this.open();
                }
            }
            else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                if (!this.navigateWhileClosed) {
                    return;
                }
                if (this.popupRef) {
                    return;
                }
                const listItem = this.popupListService.navigate(event, this.selectionMode);
                if (listItem) {
                    if (this.selectionMode === "single") {
                        if (listItem.dataEquals(this.value)) {
                            return;
                        }
                        this.updateValue(listItem);
                    }
                }
            }
            else if (event.key === "Escape") {
                this.close();
            }
        });
    }
    updateValue(listItem) {
        if (this.selectionMode === "single") {
            if (!listItem) {
                this.value = undefined;
                this.valuePopupListItem = undefined;
                this.valueChange.emit(undefined);
                return;
            }
            const item = listItem;
            if (item.dataEquals(this.value)) {
                return;
            }
            this.value = item.data;
            this.valuePopupListItem = item;
            this.valueChange.emit(item.data);
        }
        else {
            if (!listItem) {
                this.value = [];
                this.valuePopupListItem = [];
                this.valueChange.emit([]);
                return;
            }
            const items = listItem;
            this.valuePopupListItem = [...items];
            const values = items.map(v => v.data);
            this.value = values;
            this.valueChange.emit(values);
        }
    }
    updateValuePopupListItems() {
        if (this.selectionMode === "single") {
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .singleOrDefault(d => d.dataEquals(this.value));
        }
        else if (this.selectionMode === "multiple") {
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .where(d => this.value.some(v => d.dataEquals(v)))
                .toArray();
        }
    }
    setValue(value) {
        this.value = value;
        this.updateValuePopupListItems();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDropDownListComponent, deps: [{ token: i0.ElementRef }, { token: PopupListService }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractDropDownListComponent, isStandalone: true, selector: "mona-abstract-drop-down-list", inputs: { data: "data", disabled: "disabled", groupField: "groupField", itemDisabler: "itemDisabler", placeholder: "placeholder", showClearButton: "showClearButton", textField: "textField", valueField: "valueField" }, providers: [PopupListService], viewQueries: [{ propertyName: "dropdownWrapper", first: true, predicate: ["dropdownWrapper"], descendants: true }, { propertyName: "popupTemplate", first: true, predicate: ["popupTemplate"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "", isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractDropDownListComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-abstract-drop-down-list", standalone: true, imports: [CommonModule], template: "", providers: [PopupListService] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: PopupListService }, { type: PopupService }]; }, propDecorators: { data: [{
                type: Input
            }], disabled: [{
                type: Input
            }], dropdownWrapper: [{
                type: ViewChild,
                args: ["dropdownWrapper"]
            }], groupField: [{
                type: Input
            }], itemDisabler: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], popupTemplate: [{
                type: ViewChild,
                args: ["popupTemplate"]
            }], showClearButton: [{
                type: Input
            }], textField: [{
                type: Input
            }], valueField: [{
                type: Input
            }] } });

class ComboBoxGroupTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxGroupTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ComboBoxGroupTemplateDirective, selector: "ng-template[monaComboBoxGroupTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxGroupTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaComboBoxGroupTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class ComboBoxItemTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxItemTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ComboBoxItemTemplateDirective, selector: "ng-template[monaComboBoxItemTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxItemTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaComboBoxItemTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class PopupListItemComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.item = null;
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListItemComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: PopupListItemComponent, isStandalone: true, selector: "mona-popup-list-item", inputs: { item: "item", itemTemplate: "itemTemplate" }, ngImport: i0, template: "<ng-container *ngIf=\"!itemTemplate\">{{item?.text}}</ng-container>\n<ng-container *ngIf=\"itemTemplate\" [ngTemplateOutlet]=\"itemTemplate\" [ngTemplateOutletContext]=\"{$implicit: item?.data, listItem: item}\"></ng-container>\n", styles: [":host{overflow:hidden;text-overflow:ellipsis}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListItemComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-popup-list-item", standalone: true, imports: [CommonModule], template: "<ng-container *ngIf=\"!itemTemplate\">{{item?.text}}</ng-container>\n<ng-container *ngIf=\"itemTemplate\" [ngTemplateOutlet]=\"itemTemplate\" [ngTemplateOutletContext]=\"{$implicit: item?.data, listItem: item}\"></ng-container>\n", styles: [":host{overflow:hidden;text-overflow:ellipsis}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { item: [{
                type: Input
            }], itemTemplate: [{
                type: Input
            }] } });

class ListItemTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ListItemTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ListItemTemplateDirective, isStandalone: true, selector: "ng-template[monaListItemTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ListItemTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaListItemTemplate]",
                    standalone: true
                }]
        }], ctorParameters: function () { return []; } });

class ListGroupTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ListGroupTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ListGroupTemplateDirective, isStandalone: true, selector: "ng-template[monaListGroupTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ListGroupTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaListGroupTemplate]",
                    standalone: true
                }]
        }], ctorParameters: function () { return []; } });

class PopupListComponent {
    set highlightedValues(values) {
        this.updateHighlightedValues(values);
    }
    constructor(popupListService, cdr) {
        this.popupListService = popupListService;
        this.cdr = cdr;
        this.componentDestroy$ = new Subject();
        this.filterIcon = faSearch;
        this.filter$ = new Subject();
        this.filterable = false;
        this.navigable = true;
        this.popupListItemComponents = new QueryList();
        this.selectionMode = "single";
        this.value = [];
        this.valueChange = new EventEmitter();
    }
    ngAfterViewInit() {
        const firstSelectedItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .firstOrDefault(i => i.selected || i.highlighted);
        if (firstSelectedItem) {
            window.setTimeout(() => this.scrollToItem(firstSelectedItem), 0);
        }
    }
    ngOnChanges(changes) {
        if (changes["highlightedValues"] && changes["highlightedValues"].isFirstChange()) {
            window.setTimeout(() => this.updateHighlightedValues(changes["highlightedValues"].currentValue));
        }
        if (changes["value"]) {
            window.setTimeout(() => {
                this.updateSelectedValues(changes["value"].currentValue);
                if (changes["value"].isFirstChange() || this.selectionMode === "single") {
                    const firstSelectedItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(i => i.selected || i.highlighted);
                    if (firstSelectedItem) {
                        window.setTimeout(() => this.scrollToItem(firstSelectedItem), 0);
                    }
                }
            });
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.popupListService.viewListData.selectMany(g => g.source).forEach(i => (i.selected = false));
    }
    ngOnInit() {
        const selectedItem = this.popupListService.viewListData
            .selectMany(g => g.source)
            .firstOrDefault(i => i.dataEquals(this.value));
        if (selectedItem) {
            selectedItem.selected = true;
        }
        this.setEvents();
        this.setSubscriptions();
    }
    onListItemClick(item, event) {
        if (item.disabled) {
            return;
        }
        if (this.selectionMode === "single") {
            this.updateSelectedValues([item.data]);
            this.value = [item.data];
            this.valueChange.emit({
                value: [item],
                via: "selection"
            });
        }
        else if (this.selectionMode === "multiple") {
            item.selected = !item.selected;
            let values = [...this.value];
            let items = [];
            if (item.selected) {
                values.push(item.data);
                items = this.popupListService.getListItemsOfValues(values);
            }
            else {
                const valueItems = this.popupListService.getListItemsOfValues(values);
                items = valueItems.filter(i => !i.dataEquals(item));
            }
            this.valueChange.emit({
                via: "selection",
                value: items
            });
        }
    }
    findListItemComponent(item) {
        const component = this.popupListItemComponents.find(c => c.item?.dataEquals(item.data) ?? false);
        return component ?? null;
    }
    scrollToItem(item) {
        const component = this.findListItemComponent(item);
        if (component) {
            component.elementRef.nativeElement.scrollIntoView({ behavior: "auto", block: "center" });
        }
    }
    setEvents() {
        fromEvent(document, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                if (!this.navigable) {
                    return;
                }
                event.stopImmediatePropagation();
                event.preventDefault();
                const listItem = this.popupListService.navigate(event, this.selectionMode);
                if (listItem) {
                    this.scrollToItem(listItem);
                    if (this.selectionMode === "single") {
                        this.valueChange.emit({
                            via: "navigation",
                            value: [listItem]
                        });
                    }
                }
            }
            else if (event.key === "Enter") {
                if (this.selectionMode === "multiple") {
                    const highlightedItem = this.popupListService.viewListData
                        .selectMany(g => g.source)
                        .firstOrDefault(i => i.highlighted);
                    if (highlightedItem) {
                        if (highlightedItem.selected) {
                            highlightedItem.selected = false;
                            const values = this.value.filter(v => !highlightedItem.dataEquals(v));
                            const items = this.popupListService.getListItemsOfValues(values);
                            this.valueChange.emit({
                                via: "selection",
                                value: items
                            });
                        }
                        else {
                            highlightedItem.selected = true;
                            const values = [...this.value, highlightedItem.data];
                            const items = this.popupListService.getListItemsOfValues(values);
                            this.valueChange.emit({
                                via: "selection",
                                value: items
                            });
                        }
                    }
                }
                else {
                    if (this.popupListService.filterModeActive) {
                        const selectedItem = this.popupListService.viewListData
                            .selectMany(g => g.source)
                            .firstOrDefault(i => i.selected);
                        if (selectedItem) {
                            this.valueChange.emit({
                                value: [selectedItem],
                                via: "selection"
                            });
                        }
                    }
                }
            }
        });
    }
    setSubscriptions() {
        this.filter$
            .pipe(takeUntil(this.componentDestroy$), debounceTime(200))
            .subscribe(filter => this.popupListService.filterItems(filter, this.selectionMode));
        this.popupListService.scrollToListItem$
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(item => this.scrollToItem(item));
    }
    updateHighlightedValues(values) {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.highlighted = values.length === 0 ? false : values.some(v => i.dataEquals(v));
            });
        });
    }
    updateSelectedValues(values) {
        this.popupListService.viewListData.forEach(g => {
            g.source.forEach(i => {
                i.selected = values.length === 0 ? false : values.some(v => i.dataEquals(v));
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListComponent, deps: [{ token: PopupListService, skipSelf: true }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: PopupListComponent, isStandalone: true, selector: "mona-popup-list", inputs: { filterable: "filterable", groupField: "groupField", highlightedValues: "highlightedValues", navigable: "navigable", selectionMode: "selectionMode", textField: "textField", value: "value", valueField: "valueField" }, outputs: { valueChange: "valueChange" }, queries: [{ propertyName: "groupTemplate", first: true, predicate: ListGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: ListItemTemplateDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "popupListItemComponents", predicate: PopupListItemComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<ul class=\"mona-list\" [attr.tabindex]=\"-1\">\n    <ng-container *ngIf=\"popupListService.viewListData.length !== 0; else empty;\">\n        <ng-container *ngIf=\"filterable\">\n            <mona-text-box class=\"filter-box\" [ngModel]=\"filter$|async\" (ngModelChange)=\"filter$.next($event)\">\n                <ng-template monaTextBoxPrefixTemplate>\n                    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n                </ng-template>\n            </mona-text-box>\n        </ng-container>\n        <ng-container *ngFor=\"let group of popupListService.viewListData\">\n            <ng-container *ngIf=\"$any(group.source).length !== 0\">\n                <ng-container *ngIf=\"!groupTemplate\">\n                    <li class=\"mona-list-group-header\" *ngIf=\"group.key\">{{group.key}}</li>\n                </ng-container>\n                <ng-container *ngIf=\"groupTemplate && group.key\">\n                    <li class=\"mona-list-group-header\">\n                        <ng-container [ngTemplateOutlet]=\"groupTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: group.key}\"></ng-container>\n                    </li>\n                </ng-container>\n            </ng-container>\n            <li class=\"mona-list-item\" *ngFor=\"let item of group.source\" (click)=\"onListItemClick(item, $event)\"\n                [ngClass]=\"{'mona-selected': item.selected, 'mona-highlighted': item.highlighted, 'mona-disabled': item.disabled}\">\n                <mona-popup-list-item [item]=\"item\" [itemTemplate]=\"itemTemplate\"></mona-popup-list-item>\n            </li>\n        </ng-container>\n    </ng-container>\n    <ng-template #empty>\n        <div class=\"mona-list-no-data\">No data.</div>\n    </ng-template>\n</ul>\n", styles: [":host{width:100%;height:100%}ul.mona-list{list-style:none;-webkit-user-select:none;user-select:none;width:100%;outline:none}ul.mona-list li{display:flex;align-items:center;justify-content:flex-start;padding:4px 8px;line-height:1.42857143;white-space:nowrap;overflow:hidden;cursor:pointer}li.mona-list-group-header{pointer-events:none;font-weight:700}mona-text-box.filter-box{border:none}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "pipe", type: i1.AsyncPipe, name: "async" }, { kind: "component", type: PopupListItemComponent, selector: "mona-popup-list-item", inputs: ["item", "itemTemplate"] }, { kind: "ngmodule", type: TextBoxModule }, { kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: TextBoxPrefixTemplateDirective, selector: "ng-template[monaTextBoxPrefixTemplate]" }, { kind: "ngmodule", type: FontAwesomeModule }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], changeDetection: i0.ChangeDetectionStrategy.Default }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PopupListComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-popup-list", standalone: true, imports: [CommonModule, PopupListItemComponent, TextBoxModule, FontAwesomeModule, FormsModule], changeDetection: ChangeDetectionStrategy.Default, template: "<ul class=\"mona-list\" [attr.tabindex]=\"-1\">\n    <ng-container *ngIf=\"popupListService.viewListData.length !== 0; else empty;\">\n        <ng-container *ngIf=\"filterable\">\n            <mona-text-box class=\"filter-box\" [ngModel]=\"filter$|async\" (ngModelChange)=\"filter$.next($event)\">\n                <ng-template monaTextBoxPrefixTemplate>\n                    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n                </ng-template>\n            </mona-text-box>\n        </ng-container>\n        <ng-container *ngFor=\"let group of popupListService.viewListData\">\n            <ng-container *ngIf=\"$any(group.source).length !== 0\">\n                <ng-container *ngIf=\"!groupTemplate\">\n                    <li class=\"mona-list-group-header\" *ngIf=\"group.key\">{{group.key}}</li>\n                </ng-container>\n                <ng-container *ngIf=\"groupTemplate && group.key\">\n                    <li class=\"mona-list-group-header\">\n                        <ng-container [ngTemplateOutlet]=\"groupTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: group.key}\"></ng-container>\n                    </li>\n                </ng-container>\n            </ng-container>\n            <li class=\"mona-list-item\" *ngFor=\"let item of group.source\" (click)=\"onListItemClick(item, $event)\"\n                [ngClass]=\"{'mona-selected': item.selected, 'mona-highlighted': item.highlighted, 'mona-disabled': item.disabled}\">\n                <mona-popup-list-item [item]=\"item\" [itemTemplate]=\"itemTemplate\"></mona-popup-list-item>\n            </li>\n        </ng-container>\n    </ng-container>\n    <ng-template #empty>\n        <div class=\"mona-list-no-data\">No data.</div>\n    </ng-template>\n</ul>\n", styles: [":host{width:100%;height:100%}ul.mona-list{list-style:none;-webkit-user-select:none;user-select:none;width:100%;outline:none}ul.mona-list li{display:flex;align-items:center;justify-content:flex-start;padding:4px 8px;line-height:1.42857143;white-space:nowrap;overflow:hidden;cursor:pointer}li.mona-list-group-header{pointer-events:none;font-weight:700}mona-text-box.filter-box{border:none}\n"] }]
        }], ctorParameters: function () { return [{ type: PopupListService, decorators: [{
                    type: SkipSelf
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { filterable: [{
                type: Input
            }], groupField: [{
                type: Input
            }], groupTemplate: [{
                type: ContentChild,
                args: [ListGroupTemplateDirective, { read: TemplateRef }]
            }], highlightedValues: [{
                type: Input
            }], itemTemplate: [{
                type: ContentChild,
                args: [ListItemTemplateDirective, { read: TemplateRef }]
            }], navigable: [{
                type: Input
            }], popupListItemComponents: [{
                type: ViewChildren,
                args: [PopupListItemComponent]
            }], selectionMode: [{
                type: Input
            }], textField: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], valueField: [{
                type: Input
            }] } });

class ComboBoxComponent extends AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService) {
        super(elementRef, popupListService, popupService);
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.selectionMode = "single";
        this.comboBoxValue$ = new Subject();
        this.comboBoxValue = "";
        this.allowCustomValue = true;
        this.filterable = false;
        this.valueChange = new EventEmitter();
        this.valueNormalizer = (text$) => text$.pipe(map(value => value));
    }
    clearValue(event) {
        event.stopImmediatePropagation();
        this.comboBoxValue = "";
        this.updateValue(undefined);
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
        if (changes["data"] && !changes["data"].isFirstChange()) {
            this.comboBoxValue = this.valuePopupListItem?.text ?? "";
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this.setEventListeners();
        this.setSubscriptions();
        this.comboBoxValue = this.valuePopupListItem?.text ?? "";
    }
    onKeydown(event) {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
            if (item) {
                this.popupListService.selectItem(item, this.selectionMode);
                this.updateValue(item);
            }
            else {
                if (this.allowCustomValue) {
                    this.valueNormalizer(of(this.comboBoxValue)).subscribe(normalizedValue => {
                        this.data = [...this.data, normalizedValue];
                        this.popupListService.initializeListData({
                            data: [...this.data],
                            valueField: this.valueField,
                            disabler: this.itemDisabler,
                            textField: this.textField,
                            groupField: this.groupField
                        });
                        const item = this.popupListService.viewListData
                            .selectMany(g => g.source)
                            .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
                        if (item) {
                            this.popupListService.selectItem(item, this.selectionMode);
                            this.updateValue(item);
                        }
                    });
                }
                else {
                    this.comboBoxValue = "";
                }
            }
        }
        else if (event.key === "Escape") {
            this.close();
        }
    }
    onPopupListValueChange(event) {
        if (!event.value || event.value.length === 0) {
            this.comboBoxValue = "";
            this.updateValue(undefined);
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.close();
        }
        this.updateValue(event.value[0]);
    }
    open(options = {}) {
        this.popupRef = super.open({
            ...options,
            hasBackdrop: false,
            closeOnOutsideClick: false
        });
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        this.popupRef?.closed.pipe(take(1)).subscribe(() => {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.text.toLowerCase() === this.comboBoxValue.toLowerCase());
            if (!item) {
                this.comboBoxValue = "";
            }
        });
        return this.popupRef;
    }
    updateValue(listItem) {
        super.updateValue(listItem);
        this.comboBoxValue = listItem?.text ?? "";
    }
    setEventListeners() {
        fromEvent(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(event => {
            const target = event.relatedTarget;
            if (target &&
                (this.elementRef.nativeElement.contains(target) ||
                    this.popupRef?.overlayRef.overlayElement.contains(target))) {
                return;
            }
            this.close();
        });
        fromEvent(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
    }
    setSubscriptions() {
        this.comboBoxValue$.pipe(takeUntil(this.componentDestroy$), distinctUntilChanged()).subscribe(value => {
            if (this.filterable) {
                if (!value) {
                    this.popupListService.viewListData = this.popupListService.sourceListData.toList();
                    this.popupListService.filterModeActive = false;
                }
                else {
                    this.popupListService.viewListData = this.popupListService.sourceListData
                        .select(g => {
                        const filteredItems = g.source.where(i => i.text.toLowerCase().includes(value.toLowerCase()));
                        return new Group(g.key, filteredItems.toList());
                    })
                        .toList();
                    this.popupListService.filterModeActive = true;
                }
            }
            this.popupListService.viewListData
                .selectMany(g => g.source)
                .forEach(i => (i.selected = i.highlighted = false));
            const popupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(item => !item.disabled && item.text.toLowerCase().includes(value.toLowerCase()));
            if (!this.popupRef) {
                this.open();
            }
            if (popupListItem) {
                popupListItem.highlighted = true;
                this.popupListService.scrollToListItem$.next(popupListItem);
            }
            this.comboBoxValue = value;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxComponent, deps: [{ token: i0.ElementRef }, { token: PopupListService }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ComboBoxComponent, selector: "mona-combo-box", inputs: { allowCustomValue: "allowCustomValue", filterable: "filterable", value: "value", valueNormalizer: "valueNormalizer" }, outputs: { valueChange: "valueChange" }, providers: [PopupListService], queries: [{ propertyName: "groupTemplate", first: true, predicate: ComboBoxGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: ComboBoxItemTemplateDirective, descendants: true, read: TemplateRef }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-dropdown mona-combo-box mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"comboBoxValue\" (ngModelChange)=\"comboBoxValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && valuePopupListItem\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n    <div class=\"mona-input-selector-icon\" (click)=\"open()\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: PopupListComponent, selector: "mona-popup-list", inputs: ["filterable", "groupField", "highlightedValues", "navigable", "selectionMode", "textField", "value", "valueField"], outputs: ["valueChange"] }, { kind: "directive", type: ListItemTemplateDirective, selector: "ng-template[monaListItemTemplate]" }, { kind: "directive", type: ListGroupTemplateDirective, selector: "ng-template[monaListGroupTemplate]" }, { kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-combo-box", providers: [PopupListService], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-dropdown mona-combo-box mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"comboBoxValue\" (ngModelChange)=\"comboBoxValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && valuePopupListItem\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n    <div class=\"mona-input-selector-icon\" (click)=\"open()\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: PopupListService }, { type: PopupService }]; }, propDecorators: { allowCustomValue: [{
                type: Input
            }], filterable: [{
                type: Input
            }], groupTemplate: [{
                type: ContentChild,
                args: [ComboBoxGroupTemplateDirective, { read: TemplateRef }]
            }], itemTemplate: [{
                type: ContentChild,
                args: [ComboBoxItemTemplateDirective, { read: TemplateRef }]
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], valueNormalizer: [{
                type: Input
            }] } });

class ComboBoxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, declarations: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective], imports: [CommonModule,
            FontAwesomeModule,
            ButtonModule,
            PopupListComponent,
            ListItemTemplateDirective,
            ListGroupTemplateDirective,
            TextBoxModule,
            FormsModule], exports: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, imports: [CommonModule,
            FontAwesomeModule,
            ButtonModule,
            PopupListComponent,
            TextBoxModule,
            FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ComboBoxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective],
                    imports: [
                        CommonModule,
                        FontAwesomeModule,
                        ButtonModule,
                        PopupListComponent,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective,
                        TextBoxModule,
                        FormsModule
                    ],
                    exports: [ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective]
                }]
        }] });

class DropDownListItemTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListItemTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: DropDownListItemTemplateDirective, selector: "ng-template[monaDropDownListItemTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListItemTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaDropDownListItemTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class DropDownListValueTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListValueTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: DropDownListValueTemplateDirective, selector: "ng-template[monaDropDownListValueTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListValueTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaDropDownListValueTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class DropDownListGroupTemplateDirective extends ListGroupTemplateDirective {
    constructor() {
        super();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListGroupTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: DropDownListGroupTemplateDirective, selector: "ng-template[monaDropDownListGroupTemplate]", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListGroupTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaDropDownListGroupTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class DropDownListComponent extends AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService) {
        super(elementRef, popupListService, popupService);
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.openOnEnter = true;
        this.selectionMode = "single";
        this.filterable = false;
        this.valueChange = new EventEmitter();
    }
    clearValue(event) {
        event.stopImmediatePropagation();
        this.updateValue(undefined);
    }
    ngOnInit() {
        super.ngOnInit();
    }
    onPopupListValueChange(event) {
        if (!event.value || event.value.length === 0) {
            this.updateValue(undefined);
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.close();
        }
        this.updateValue(event.value[0]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListComponent, deps: [{ token: i0.ElementRef }, { token: PopupListService }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: DropDownListComponent, selector: "mona-drop-down-list", inputs: { filterable: "filterable", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [PopupListService], queries: [{ propertyName: "groupTemplate", first: true, predicate: DropDownListGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: DropDownListItemTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "valueTemplate", first: true, predicate: DropDownListValueTemplateDirective, descendants: true, read: TemplateRef }], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-dropdown mona-dropdown-list mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" (click)=\"open()\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <ng-container *ngIf=\"!valueTemplate\">\n            <span *ngIf=\"valuePopupListItem\">{{valuePopupListItem?.text}}</span>\n            <span *ngIf=\"!valuePopupListItem\">{{placeholder}}</span>\n        </ng-container>\n        <ng-container *ngIf=\"valueTemplate\">\n            <ng-container [ngTemplateOutlet]=\"valueTemplate\" [ngTemplateOutletContext]=\"{$implicit: valuePopupListItem?.data, listItem: valuePopupListItem}\"></ng-container>\n        </ng-container>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && valuePopupListItem\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         [filterable]=\"filterable\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: [""], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: PopupListComponent, selector: "mona-popup-list", inputs: ["filterable", "groupField", "highlightedValues", "navigable", "selectionMode", "textField", "value", "valueField"], outputs: ["valueChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ListItemTemplateDirective, selector: "ng-template[monaListItemTemplate]" }, { kind: "directive", type: ListGroupTemplateDirective, selector: "ng-template[monaListGroupTemplate]" }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-drop-down-list", providers: [PopupListService], template: "<div class=\"mona-dropdown mona-dropdown-list mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" (click)=\"open()\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <ng-container *ngIf=\"!valueTemplate\">\n            <span *ngIf=\"valuePopupListItem\">{{valuePopupListItem?.text}}</span>\n            <span *ngIf=\"!valuePopupListItem\">{{placeholder}}</span>\n        </ng-container>\n        <ng-container *ngIf=\"valueTemplate\">\n            <ng-container [ngTemplateOutlet]=\"valueTemplate\" [ngTemplateOutletContext]=\"{$implicit: valuePopupListItem?.data, listItem: valuePopupListItem}\"></ng-container>\n        </ng-container>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && valuePopupListItem\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         [filterable]=\"filterable\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: PopupListService }, { type: PopupService }]; }, propDecorators: { filterable: [{
                type: Input
            }], groupTemplate: [{
                type: ContentChild,
                args: [DropDownListGroupTemplateDirective, { read: TemplateRef }]
            }], itemTemplate: [{
                type: ContentChild,
                args: [DropDownListItemTemplateDirective, { read: TemplateRef }]
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }], valueTemplate: [{
                type: ContentChild,
                args: [DropDownListValueTemplateDirective, { read: TemplateRef }]
            }] } });

class DropDownListModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, declarations: [DropDownListComponent,
            DropDownListItemTemplateDirective,
            DropDownListValueTemplateDirective,
            DropDownListGroupTemplateDirective], imports: [CommonModule,
            PopupListComponent,
            FontAwesomeModule,
            ListItemTemplateDirective,
            ListGroupTemplateDirective,
            ButtonModule], exports: [DropDownListComponent,
            DropDownListItemTemplateDirective,
            DropDownListValueTemplateDirective,
            DropDownListGroupTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, imports: [CommonModule,
            PopupListComponent,
            FontAwesomeModule,
            ButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownListModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        DropDownListComponent,
                        DropDownListItemTemplateDirective,
                        DropDownListValueTemplateDirective,
                        DropDownListGroupTemplateDirective
                    ],
                    imports: [
                        CommonModule,
                        PopupListComponent,
                        FontAwesomeModule,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective,
                        ButtonModule
                    ],
                    exports: [
                        DropDownListComponent,
                        DropDownListItemTemplateDirective,
                        DropDownListValueTemplateDirective,
                        DropDownListGroupTemplateDirective
                    ]
                }]
        }] });

class TimePickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, declarations: [TimePickerComponent], imports: [CommonModule,
            TextBoxModule,
            FontAwesomeModule,
            ButtonModule,
            FormsModule,
            ComboBoxModule,
            DropDownListModule,
            TimeSelectorModule], exports: [TimePickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, imports: [CommonModule,
            TextBoxModule,
            FontAwesomeModule,
            ButtonModule,
            FormsModule,
            ComboBoxModule,
            DropDownListModule,
            TimeSelectorModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TimePickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TimePickerComponent],
                    imports: [
                        CommonModule,
                        TextBoxModule,
                        FontAwesomeModule,
                        ButtonModule,
                        FormsModule,
                        ComboBoxModule,
                        DropDownListModule,
                        TimeSelectorModule
                    ],
                    exports: [TimePickerComponent]
                }]
        }] });

class DateInputsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, imports: [CommonModule], exports: [CalendarModule, DatePickerModule, DateTimePickerModule, TimePickerModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, imports: [CommonModule, CalendarModule, DatePickerModule, DateTimePickerModule, TimePickerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DateInputsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [CalendarModule, DatePickerModule, DateTimePickerModule, TimePickerModule]
                }]
        }] });

class AutoCompleteComponent extends AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService) {
        super(elementRef, popupListService, popupService);
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.navigateWhileClosed = false;
        this.selectionMode = "single";
        this.autoCompleteValue$ = new Subject();
        this.autoCompleteValue = "";
        this.filterable = false;
        this.valueChange = new EventEmitter();
    }
    clearValue(event) {
        event.stopImmediatePropagation();
        this.popupListService.sourceListData
            .selectMany(g => g.source)
            .forEach(i => (i.selected = i.highlighted = false));
        this.autoCompleteValue = "";
        this.value = "";
        this.valueChange.emit("");
    }
    ngOnInit() {
        super.ngOnInit();
        this.setEventListeners();
        this.setSubscriptions();
        this.autoCompleteValue = this.value ?? "";
    }
    onKeydown(event) {
        if (event.key === "Enter") {
            const item = this.popupListService.viewListData
                .selectMany(g => g.source)
                .firstOrDefault(i => i.selected || i.highlighted);
            if (item) {
                this.valuePopupListItem = item;
                this.autoCompleteValue = item.text;
                if (this.value !== item.text) {
                    this.value = item.text;
                    this.valueChange.emit(item.text);
                }
            }
            else {
                if (this.value !== this.autoCompleteValue) {
                    this.value = this.autoCompleteValue;
                    this.valuePopupListItem = undefined;
                    this.valueChange.emit(this.autoCompleteValue);
                }
            }
            this.close();
        }
        else if (event.key === "Escape") {
            this.close();
        }
    }
    onPopupListValueChange(event) {
        if (event?.via === "navigation") {
            return;
        }
        if (!event.value || event.value.length === 0) {
            this.value = "";
            this.valuePopupListItem = undefined;
            this.autoCompleteValue = "";
            this.valueChange.emit(this.autoCompleteValue);
            return;
        }
        if (this.value && event.value[0].dataEquals(this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection") {
            this.value = event.value[0].text;
            this.valuePopupListItem = event.value[0];
            this.autoCompleteValue = event.value[0].text;
            this.valueChange.emit(event.value[0].text);
            this.close();
        }
    }
    open(options = {}) {
        this.popupRef = super.open(options);
        window.setTimeout(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        this.popupRef.closed.pipe(take(1)).subscribe(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
            }
        });
        return this.popupRef;
    }
    setEventListeners() {
        fromEvent(this.elementRef.nativeElement, "focusin")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
            const input = this.elementRef.nativeElement.querySelector("input");
            if (input) {
                input.focus();
                input.setSelectionRange(-1, -1);
            }
        });
        fromEvent(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(event => {
            const target = event.relatedTarget;
            if (!(target &&
                (this.elementRef.nativeElement.contains(target) ||
                    this.popupRef?.overlayRef.overlayElement.contains(target)))) {
                if (this.value !== this.autoCompleteValue) {
                    this.value = this.autoCompleteValue;
                    this.valueChange.emit(this.autoCompleteValue);
                }
                this.valuePopupListItem = undefined;
            }
        });
    }
    setSubscriptions() {
        this.autoCompleteValue$
            .pipe(takeUntil(this.componentDestroy$), debounceTime(50), distinctUntilChanged())
            .subscribe((value) => {
            if (value) {
                if (this.filterable) {
                    this.popupListService.viewListData = this.popupListService.sourceListData
                        .select(g => {
                        const filteredItems = g.source.where(i => i.text.toLowerCase().startsWith(value.toLowerCase()));
                        return new Group(g.key, filteredItems.toList());
                    })
                        .toList();
                    this.popupListService.filterModeActive = true;
                }
                this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .forEach(i => (i.selected = i.highlighted = false));
                const popupListItem = this.popupListService.viewListData
                    .selectMany(g => g.source)
                    .firstOrDefault(item => !item.disabled && item.text.toLowerCase().startsWith(value.toLowerCase()));
                if (popupListItem) {
                    popupListItem.highlighted = true;
                    this.popupListService.scrollToListItem$.next(popupListItem);
                }
                if (!this.popupRef) {
                    this.open();
                }
                this.autoCompleteValue = value;
            }
            else {
                this.close();
                this.autoCompleteValue = value;
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteComponent, deps: [{ token: i0.ElementRef }, { token: PopupListService }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AutoCompleteComponent, selector: "mona-auto-complete", inputs: { filterable: "filterable", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [PopupListService], queries: [{ propertyName: "groupTemplate", first: true, predicate: ComboBoxGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: ComboBoxItemTemplateDirective, descendants: true, read: TemplateRef }], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-dropdown mona-auto-complete mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"autoCompleteValue\" (ngModelChange)=\"autoCompleteValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && value\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "component", type: PopupListComponent, selector: "mona-popup-list", inputs: ["filterable", "groupField", "highlightedValues", "navigable", "selectionMode", "textField", "value", "valueField"], outputs: ["valueChange"] }, { kind: "directive", type: ListItemTemplateDirective, selector: "ng-template[monaListItemTemplate]" }, { kind: "directive", type: ListGroupTemplateDirective, selector: "ng-template[monaListGroupTemplate]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-auto-complete", providers: [PopupListService], template: "<div class=\"mona-dropdown mona-auto-complete mona-input-selector\" [ngClass]=\"{'mona-disabled': disabled}\" [attr.tabindex]=\"disabled ? -1 : 0\" #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <mona-text-box [ngModel]=\"autoCompleteValue\" (ngModelChange)=\"autoCompleteValue$.next($event)\" (keydown)=\"onKeydown($event)\"></mona-text-box>\n    </div>\n    <div class=\"mona-input-selector-icon\" *ngIf=\"showClearButton && value\">\n        <button monaButton [flat]=\"true\" (click)=\"clearValue($event)\" class=\"mona-dropdown-clear-icon\" tabindex=\"-1\">\n            <fa-icon [icon]=\"clearIcon\"></fa-icon>\n        </button>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [value]=\"value ? [value] : []\"\n                         (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\" [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector-value{padding:0}div.mona-input-selector-value mona-text-box{width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: PopupListService }, { type: PopupService }]; }, propDecorators: { filterable: [{
                type: Input
            }], groupTemplate: [{
                type: ContentChild,
                args: [ComboBoxGroupTemplateDirective, { read: TemplateRef }]
            }], itemTemplate: [{
                type: ContentChild,
                args: [ComboBoxItemTemplateDirective, { read: TemplateRef }]
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class AutoCompleteModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, declarations: [AutoCompleteComponent], imports: [CommonModule,
            TextBoxModule,
            FormsModule,
            ButtonModule,
            FontAwesomeModule,
            PopupListComponent,
            ListItemTemplateDirective,
            ListGroupTemplateDirective], exports: [AutoCompleteComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, imports: [CommonModule,
            TextBoxModule,
            FormsModule,
            ButtonModule,
            FontAwesomeModule,
            PopupListComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AutoCompleteModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [AutoCompleteComponent],
                    imports: [
                        CommonModule,
                        TextBoxModule,
                        FormsModule,
                        ButtonModule,
                        FontAwesomeModule,
                        PopupListComponent,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective
                    ],
                    exports: [AutoCompleteComponent]
                }]
        }] });

class MultiSelectGroupTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectGroupTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MultiSelectGroupTemplateDirective, selector: "ng-template[monaMultiSelectGroupTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectGroupTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaMultiSelectGroupTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class MultiSelectItemTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectItemTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MultiSelectItemTemplateDirective, selector: "ng-template[monaMultiSelectItemTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectItemTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaMultiSelectItemTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class MultiSelectSummaryTagTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectSummaryTagTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MultiSelectSummaryTagTemplateDirective, selector: "ng-template[monaMultiSelectSummaryTagTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectSummaryTagTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaMultiSelectSummaryTagTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class MultiSelectTagTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectTagTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MultiSelectTagTemplateDirective, selector: "ng-template[monaMultiSelectTagTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectTagTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaMultiSelectTagTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class MultiSelectComponent extends AbstractDropDownListComponent {
    constructor(elementRef, popupListService, popupService, cdr) {
        super(elementRef, popupListService, popupService);
        this.elementRef = elementRef;
        this.popupListService = popupListService;
        this.popupService = popupService;
        this.cdr = cdr;
        this.resizeObserver = null;
        this.selectionMode = "multiple";
        this.popupListValues = [];
        this.summaryTagTemplate = null;
        this.tagCount = -1;
        this.valuePopupListItem = [];
        this.filterable = false;
        this.tagTemplate = null;
        this.value = [];
        this.valueChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        super.ngOnChanges(changes);
        if (changes["value"]) {
            this.popupListValues = this.value;
            this.valuePopupListItem = this.popupListService.viewListData
                .selectMany(g => g.source)
                .where(d => this.value.some(v => d.dataEquals(v)))
                .toArray();
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.resizeObserver?.disconnect();
    }
    ngOnInit() {
        super.ngOnInit();
        this.setEventListeners();
    }
    onPopupListValueChange(event) {
        if (this.value && this.containsValue(event.value, this.value)) {
            if (event.via === "selection") {
                this.close();
            }
            return;
        }
        if (event.via === "selection" && this.selectionMode === "single") {
            this.close();
        }
        this.updateValue(event.value);
        this.popupListValues = event.value;
    }
    onSelectedItemRemove(event, popupListItem) {
        event.stopImmediatePropagation();
        const remainingItems = this.valuePopupListItem.filter(item => !item.dataEquals(popupListItem.data)) ?? [];
        this.updateValue(remainingItems);
    }
    onSelectedItemGroupRemove(event) {
        event.stopImmediatePropagation();
        const remainingItems = this.valuePopupListItem.slice(0, this.visibleTagCount);
        this.updateValue(remainingItems);
    }
    containsValue(popupListItems, value) {
        return popupListItems.some(popupListItem => popupListItem.dataEquals(value));
    }
    setEventListeners() {
        this.resizeObserver = new ResizeObserver(() => {
            window.setTimeout(() => {
                this.popupRef?.overlayRef.updatePosition();
                this.popupRef?.overlayRef.updateSize({ width: this.elementRef.nativeElement.clientWidth });
            });
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
    }
    get summaryTagText() {
        return this.tagCount < 0
            ? ""
            : this.tagCount === 0
                ? `${this.valuePopupListItem.length} item${this.valuePopupListItem.length === 1 ? "" : "s"}`
                : `+${this.valuePopupListItem.length - this.tagCount} item${this.valuePopupListItem.length - this.tagCount > 1 ? "s" : ""}`;
    }
    get visibleTagCount() {
        return this.tagCount < 0 ? this.valuePopupListItem.length : this.tagCount === 0 ? 0 : this.tagCount;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectComponent, deps: [{ token: i0.ElementRef }, { token: PopupListService }, { token: PopupService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MultiSelectComponent, selector: "mona-multi-select", inputs: { filterable: "filterable", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [PopupListService], queries: [{ propertyName: "groupTemplate", first: true, predicate: MultiSelectGroupTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "itemTemplate", first: true, predicate: MultiSelectItemTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "tagTemplate", first: true, predicate: MultiSelectTagTemplateDirective, descendants: true, read: TemplateRef }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-dropdown mona-multi-select mona-input-selector\" [attr.tabindex]=\"disabled ? -1 : 0\"\n     [ngClass]=\"{'mona-disabled': disabled}\"  (click)=\"open()\"\n     #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <div>\n            <mona-chip *ngFor=\"let item of valuePopupListItem | slice:0:visibleTagCount\"\n                       [tabindex]=\"-1\" [removable]=\"true\" (remove)=\"onSelectedItemRemove($event, item)\">\n                <span *ngIf=\"!tagTemplate\">{{item.text}}</span>\n                <ng-container [ngTemplateOutlet]=\"tagTemplate\" [ngTemplateOutletContext]=\"{$implicit: item.data}\" *ngIf=\"tagTemplate\"></ng-container>\n            </mona-chip>\n            <mona-chip [tabindex]=\"-1\" [removable]=\"true\" (remove)=\"onSelectedItemGroupRemove($event)\"\n                       *ngIf=\"tagCount >= 0 && valuePopupListItem.length > tagCount\">\n                <span *ngIf=\"!summaryTagTemplate\">{{summaryTagText}}</span>\n                <ng-container [ngTemplateOutlet]=\"summaryTagTemplate\" [ngTemplateOutletContext]=\"{$implicit: valuePopupListItem}\"\n                              *ngIf=\"summaryTagTemplate\"></ng-container>\n            </mona-chip>\n        </div>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [filterable]=\"filterable\"\n                         [value]=\"popupListValues\" selectionMode=\"multiple\" (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\"\n                                  [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\"\n                                  [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector{height:auto;min-height:var(--mona-input-height)}div.mona-input-selector:hover,div.mona-input-selector:active{background-color:var(--mona-background)}div.mona-input-selector-value{padding:0 1px 1px}div.mona-input-selector-value>div:first-child{display:flex;flex-direction:row;flex-wrap:wrap;width:100%;height:100%}div.mona-input-selector-value mona-text-box{flex:1}div.mona-input-selector-value mona-chip:not(:last-child){margin:0 1px 0 0}div.mona-input-selector-icon{min-width:var(--mona-input-height);border-left:1px solid var(--mona-border-color)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: ChipComponent, selector: "mona-chip", inputs: ["disabled", "label", "removable", "tabindex"], outputs: ["remove"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "component", type: PopupListComponent, selector: "mona-popup-list", inputs: ["filterable", "groupField", "highlightedValues", "navigable", "selectionMode", "textField", "value", "valueField"], outputs: ["valueChange"] }, { kind: "directive", type: ListItemTemplateDirective, selector: "ng-template[monaListItemTemplate]" }, { kind: "directive", type: ListGroupTemplateDirective, selector: "ng-template[monaListGroupTemplate]" }, { kind: "pipe", type: i1.SlicePipe, name: "slice" }], changeDetection: i0.ChangeDetectionStrategy.Default }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-multi-select", providers: [PopupListService], changeDetection: ChangeDetectionStrategy.Default, template: "<div class=\"mona-dropdown mona-multi-select mona-input-selector\" [attr.tabindex]=\"disabled ? -1 : 0\"\n     [ngClass]=\"{'mona-disabled': disabled}\"  (click)=\"open()\"\n     #dropdownWrapper>\n    <div class=\"mona-input-selector-value\">\n        <div>\n            <mona-chip *ngFor=\"let item of valuePopupListItem | slice:0:visibleTagCount\"\n                       [tabindex]=\"-1\" [removable]=\"true\" (remove)=\"onSelectedItemRemove($event, item)\">\n                <span *ngIf=\"!tagTemplate\">{{item.text}}</span>\n                <ng-container [ngTemplateOutlet]=\"tagTemplate\" [ngTemplateOutletContext]=\"{$implicit: item.data}\" *ngIf=\"tagTemplate\"></ng-container>\n            </mona-chip>\n            <mona-chip [tabindex]=\"-1\" [removable]=\"true\" (remove)=\"onSelectedItemGroupRemove($event)\"\n                       *ngIf=\"tagCount >= 0 && valuePopupListItem.length > tagCount\">\n                <span *ngIf=\"!summaryTagTemplate\">{{summaryTagText}}</span>\n                <ng-container [ngTemplateOutlet]=\"summaryTagTemplate\" [ngTemplateOutletContext]=\"{$implicit: valuePopupListItem}\"\n                              *ngIf=\"summaryTagTemplate\"></ng-container>\n            </mona-chip>\n        </div>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<ng-template #popupTemplate>\n    <div *ngIf=\"!!popupRef\">\n        <mona-popup-list [textField]=\"textField\" [valueField]=\"valueField\" [groupField]=\"groupField\" [filterable]=\"filterable\"\n                         [value]=\"popupListValues\" selectionMode=\"multiple\" (valueChange)=\"onPopupListValueChange($event)\">\n            <ng-container *ngIf=\"itemTemplate\">\n                <ng-template monaListItemTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"itemTemplate ?? null\"\n                                  [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n            <ng-container *ngIf=\"groupTemplate\">\n                <ng-template monaListGroupTemplate let-dataItem let-listItem=\"listItem\">\n                    <ng-container [ngTemplateOutlet]=\"groupTemplate ?? null\"\n                                  [ngTemplateOutletContext]=\"{$implicit: dataItem, listItem}\"></ng-container>\n                </ng-template>\n            </ng-container>\n        </mona-popup-list>\n    </div>\n</ng-template>\n", styles: ["div.mona-input-selector{height:auto;min-height:var(--mona-input-height)}div.mona-input-selector:hover,div.mona-input-selector:active{background-color:var(--mona-background)}div.mona-input-selector-value{padding:0 1px 1px}div.mona-input-selector-value>div:first-child{display:flex;flex-direction:row;flex-wrap:wrap;width:100%;height:100%}div.mona-input-selector-value mona-text-box{flex:1}div.mona-input-selector-value mona-chip:not(:last-child){margin:0 1px 0 0}div.mona-input-selector-icon{min-width:var(--mona-input-height);border-left:1px solid var(--mona-border-color)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: PopupListService }, { type: PopupService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { filterable: [{
                type: Input
            }], groupTemplate: [{
                type: ContentChild,
                args: [MultiSelectGroupTemplateDirective, { read: TemplateRef }]
            }], itemTemplate: [{
                type: ContentChild,
                args: [MultiSelectItemTemplateDirective, { read: TemplateRef }]
            }], tagTemplate: [{
                type: ContentChild,
                args: [MultiSelectTagTemplateDirective, { read: TemplateRef }]
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class MultiSelectSummaryTagDirective {
    constructor(host) {
        this.host = host;
        this.summaryTagTemplate = null;
        this.tagCount = 0;
    }
    ngAfterContentInit() {
        this.host.summaryTagTemplate = this.summaryTagTemplate;
    }
    ngOnInit() {
        this.host.tagCount = this.tagCount;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectSummaryTagDirective, deps: [{ token: MultiSelectComponent }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MultiSelectSummaryTagDirective, selector: "[monaMultiSelectSummaryTag]", inputs: { tagCount: ["monaMultiSelectSummaryTag", "tagCount"] }, queries: [{ propertyName: "summaryTagTemplate", first: true, predicate: MultiSelectSummaryTagTemplateDirective, descendants: true, read: TemplateRef }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectSummaryTagDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaMultiSelectSummaryTag]"
                }]
        }], ctorParameters: function () { return [{ type: MultiSelectComponent }]; }, propDecorators: { summaryTagTemplate: [{
                type: ContentChild,
                args: [MultiSelectSummaryTagTemplateDirective, { read: TemplateRef }]
            }], tagCount: [{
                type: Input,
                args: ["monaMultiSelectSummaryTag"]
            }] } });

class MultiSelectModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, declarations: [MultiSelectComponent,
            MultiSelectGroupTemplateDirective,
            MultiSelectItemTemplateDirective,
            MultiSelectTagTemplateDirective,
            MultiSelectSummaryTagTemplateDirective,
            MultiSelectSummaryTagDirective], imports: [CommonModule,
            ChipModule,
            FontAwesomeModule,
            TextBoxModule,
            PopupListComponent,
            ListItemTemplateDirective,
            ListGroupTemplateDirective], exports: [MultiSelectComponent,
            MultiSelectGroupTemplateDirective,
            MultiSelectItemTemplateDirective,
            MultiSelectTagTemplateDirective,
            MultiSelectSummaryTagDirective,
            MultiSelectSummaryTagTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, imports: [CommonModule,
            ChipModule,
            FontAwesomeModule,
            TextBoxModule,
            PopupListComponent] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MultiSelectModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MultiSelectComponent,
                        MultiSelectGroupTemplateDirective,
                        MultiSelectItemTemplateDirective,
                        MultiSelectTagTemplateDirective,
                        MultiSelectSummaryTagTemplateDirective,
                        MultiSelectSummaryTagDirective
                    ],
                    imports: [
                        CommonModule,
                        ChipModule,
                        FontAwesomeModule,
                        TextBoxModule,
                        PopupListComponent,
                        ListItemTemplateDirective,
                        ListGroupTemplateDirective
                    ],
                    exports: [
                        MultiSelectComponent,
                        MultiSelectGroupTemplateDirective,
                        MultiSelectItemTemplateDirective,
                        MultiSelectTagTemplateDirective,
                        MultiSelectSummaryTagDirective,
                        MultiSelectSummaryTagTemplateDirective
                    ]
                }]
        }] });

class DropDownsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, imports: [CommonModule], exports: [AutoCompleteModule, ComboBoxModule, DropDownListModule, MultiSelectModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, imports: [CommonModule, AutoCompleteModule, ComboBoxModule, DropDownListModule, MultiSelectModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: DropDownsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [AutoCompleteModule, ComboBoxModule, DropDownListModule, MultiSelectModule]
                }]
        }] });

class FilterUtils {
    static compositeDescriptorToPredicate(descriptor, fieldSelector) {
        return (item) => {
            const filters = descriptor.filters;
            const logic = descriptor.logic;
            if (logic === "and") {
                return filters.every(f => {
                    if (f.hasOwnProperty("field")) {
                        return FilterUtils.descriptorToPredicate(f, fieldSelector)(item);
                    }
                    else {
                        return FilterUtils.compositeDescriptorToPredicate(f, fieldSelector)(item);
                    }
                });
            }
            else if (logic === "or") {
                return filters.some(f => {
                    if (f.hasOwnProperty("field")) {
                        return FilterUtils.descriptorToPredicate(f, fieldSelector)(item);
                    }
                    else {
                        return FilterUtils.compositeDescriptorToPredicate(f, fieldSelector)(item);
                    }
                });
            }
            else {
                return false;
            }
        };
    }
    static descriptorToPredicate(descriptor, fieldSelector) {
        return (item) => {
            const value = (fieldSelector ? fieldSelector(item) : item)[descriptor.field];
            switch (descriptor.operator) {
                case "eq":
                    return value == null && descriptor.value == null
                        ? true
                        : (value == null && descriptor.value != null) || (value != null && descriptor.value == null)
                            ? false
                            : value instanceof Date
                                ? DateTime.fromJSDate(value).equals(DateTime.fromJSDate(descriptor.value))
                                : value === descriptor.value;
                case "neq":
                    return value == null && descriptor.value == null
                        ? false
                        : (value == null && descriptor.value != null) || (value != null && descriptor.value == null)
                            ? true
                            : value instanceof Date
                                ? !DateTime.fromJSDate(value).equals(DateTime.fromJSDate(descriptor.value))
                                : value !== descriptor.value;
                case "gt":
                    return value == null || descriptor.value == null ? false : value > descriptor.value;
                case "gte":
                    return value == null || descriptor.value == null ? false : value >= descriptor.value;
                case "lt":
                    return value == null || descriptor.value == null ? false : value < descriptor.value;
                case "lte":
                    return value == null || descriptor.value == null ? false : value <= descriptor.value;
                case "startswith":
                    return value == null || descriptor.value == null ? false : value.startsWith(descriptor.value);
                case "endswith":
                    return value == null || descriptor.value == null ? false : value.endsWith(descriptor.value);
                case "contains":
                    return value == null || descriptor.value == null ? false : value.includes(descriptor.value);
                case "doesnotcontain":
                    return value == null || descriptor.value == null ? false : !value.includes(descriptor.value);
                case "isnull":
                    return value == null;
                case "isnotnull":
                    return value != null;
                case "isempty":
                    return value === "";
                case "isnotempty":
                    return value !== "";
                case "isnullorempty":
                    return value == null || value === "";
                case "isnotnullorempty":
                    return value != null && value !== "";
                case "in":
                    return descriptor.value.includes(value);
                case "notin":
                    return !descriptor.value.includes(value);
                case "function":
                    return descriptor.predicate(value);
                default:
                    return false;
            }
        };
    }
}

class Query {
    constructor(iterable) {
        this.iterable = iterable;
        this.enumerator = new QueryEnumerator(() => iterable);
    }
    *[Symbol.iterator]() {
        yield* this.iterable;
    }
    static from(iterable) {
        return new Query(iterable);
    }
    filter(filter, fieldSelector) {
        return this.enumerator.filter(filter, fieldSelector);
    }
    run() {
        return this.enumerator.toArray();
    }
    sort(descriptor, fieldSelector) {
        return this.enumerator.sort(descriptor, fieldSelector);
    }
}
class QueryEnumerator extends Enumerator {
    constructor(iterable) {
        super(iterable);
    }
    filter(filter, fieldSelector) {
        return new QueryEnumerator(() => this.filterGenerator(filter, fieldSelector));
    }
    run() {
        return Array.from(this);
    }
    sort(descriptor, fieldSelector) {
        return new QueryEnumerator(() => this.sortGenerator(descriptor, fieldSelector));
    }
    *filterGenerator(filter, fieldSelector) {
        const predicate = filter.hasOwnProperty("field")
            ? FilterUtils.descriptorToPredicate(filter, fieldSelector)
            : FilterUtils.compositeDescriptorToPredicate(filter, fieldSelector);
        yield* this.where(predicate);
    }
    *sortGenerator(descriptor, fieldSelector) {
        let result = descriptor[0].dir === "asc"
            ? this.orderBy(d => (fieldSelector ? fieldSelector(d) : d)[descriptor[0].field], descriptor[0].sort)
            : this.orderByDescending(d => (fieldSelector ? fieldSelector(d) : d)[descriptor[0].field], descriptor[0].sort);
        for (let i = 1; i < descriptor.length; i++) {
            result =
                descriptor[i].dir === "asc"
                    ? result.thenBy(d => (fieldSelector ? fieldSelector(d) : d)[descriptor[i].field], descriptor[i].sort)
                    : result.thenByDescending(d => (fieldSelector ? fieldSelector(d) : d)[descriptor[i].field], descriptor[i].sort);
        }
        yield* result;
    }
}

class ValuelessOperatorPipe {
    transform(value) {
        return (value === "isnull" ||
            value === "isnotnull" ||
            value === "isempty" ||
            value === "isnotempty" ||
            value === "isnullorempty" ||
            value === "isnotnullorempty");
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ValuelessOperatorPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ValuelessOperatorPipe, name: "valuelessOperator" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ValuelessOperatorPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "valuelessOperator"
                }]
        }] });

class OperatorFilterPipe {
    transform(value, visibleOperators) {
        if (!visibleOperators || visibleOperators.length === 0) {
            return value;
        }
        return value
            .filter(item => visibleOperators.includes(item.value))
            .sort((a, b) => {
            return visibleOperators.indexOf(a.value) - visibleOperators.indexOf(b.value);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: OperatorFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: OperatorFilterPipe, name: "operatorFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: OperatorFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "operatorFilter"
                }]
        }] });

class FilterMenuComponent {
    set value(value) {
        this.setFilterValues(value);
    }
    get value() {
        return this.getFilterValues();
    }
    constructor() {
        this.booleanFilterValues = [null, null];
        this.booleanFilterMenuDataItems = [
            { text: "Is true", value: "eq" },
            { text: "Is false", value: "neq" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" }
        ];
        this.connectorDataItems = [
            { text: "AND", value: "and" },
            { text: "OR", value: "or" }
        ];
        this.dateFilterMenuDataItems = [
            { text: "Is equal to", value: "eq" },
            { text: "Is not equal to", value: "neq" },
            { text: "Is after", value: "gt" },
            { text: "Is after or equal to", value: "gte" },
            { text: "Is before", value: "lt" },
            { text: "Is before or equal to", value: "lte" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" }
        ];
        // TODO: Add null and empty filter operators
        this.numericFilterMenuDataItems = [
            { text: "Is equal to", value: "eq" },
            { text: "Is not equal to", value: "neq" },
            { text: "Is greater than", value: "gt" },
            { text: "Is greater than or equal to", value: "gte" },
            { text: "Is less than", value: "lt" },
            { text: "Is less than or equal to", value: "lte" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" }
        ];
        this.stringFilterMenuDataItems = [
            { text: "Contains", value: "contains" },
            { text: "Does not contain", value: "doesnotcontain" },
            { text: "Ends with", value: "endswith" },
            { text: "Starts with", value: "startswith" },
            { text: "Is equal to", value: "eq" },
            { text: "Is not equal to", value: "neq" },
            { text: "Is empty", value: "isempty" },
            { text: "Is not empty", value: "isnotempty" },
            { text: "Is null", value: "isnull" },
            { text: "Is not null", value: "isnotnull" },
            { text: "Is null or empty", value: "isnullorempty" },
            { text: "Is not null or empty", value: "isnotnullorempty" }
        ];
        this.dateFilterValues = [null, null];
        this.numberFilterValues = [null, null];
        this.selectedConnectorItem = null;
        this.selectedFilterMenuDataItemList = [undefined, undefined];
        this.stringFilterValues = ["", ""];
        this.apply = new EventEmitter();
        this.dateOptions = {
            format: "dd/MM/yyyy",
            type: "date"
        };
        this.field = "";
        this.operators = [];
        this.type = "string";
    }
    ngOnInit() { }
    onConnectorChange(item) {
        if (item.value === this.selectedConnectorItem?.value) {
            this.selectedConnectorItem = null;
        }
        else {
            this.selectedConnectorItem = item;
        }
    }
    getBooleanDescriptor(operator) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else {
            return {
                field: this.field,
                operator: "eq",
                value: operator === "eq"
            };
        }
    }
    getDateDescriptor(operator, value) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }
    getNumberDescriptor(operator, value) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }
    getStringDescriptor(operator, value) {
        if (operator === "isnotnull" || operator === "isnull") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (operator === "isempty" || operator === "isnotempty") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (operator === "isnullorempty" || operator === "isnotnullorempty") {
            return {
                field: this.field,
                operator: operator
            };
        }
        else if (value != null) {
            return {
                field: this.field,
                operator: operator,
                value: value
            };
        }
        return null;
    }
    onFilterApply() {
        if (this.type === "string") {
            const value1 = this.stringFilterValues[0];
            const value2 = this.stringFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const stringDescriptors = [];
            const descriptor1 = this.getStringDescriptor(operator1, value1);
            if (descriptor1 != null) {
                stringDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getStringDescriptor(operator2, value2);
                if (descriptor2 != null) {
                    stringDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: stringDescriptors
            };
            this.apply.emit(descriptor);
        }
        else if (this.type === "number") {
            const value1 = this.numberFilterValues[0];
            const value2 = this.numberFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const numberDescriptors = [];
            const descriptor1 = this.getNumberDescriptor(operator1, value1);
            if (descriptor1 != null) {
                numberDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getNumberDescriptor(operator2, value2);
                if (descriptor2 != null) {
                    numberDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: numberDescriptors
            };
            this.apply.emit(descriptor);
        }
        else if (this.type === "date") {
            const value1 = this.dateFilterValues[0];
            const value2 = this.dateFilterValues[1];
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const dateDescriptors = [];
            const descriptor1 = this.getDateDescriptor(operator1, value1);
            if (descriptor1 != null) {
                dateDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getDateDescriptor(operator2, value2);
                if (descriptor2 != null) {
                    dateDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: dateDescriptors
            };
            this.apply.emit(descriptor);
        }
        else if (this.type === "boolean") {
            const operator1 = this.selectedFilterMenuDataItemList[0]?.value;
            const operator2 = this.selectedFilterMenuDataItemList[1]?.value;
            const booleanDescriptors = [];
            const descriptor1 = this.getBooleanDescriptor(operator1);
            if (descriptor1 != null) {
                booleanDescriptors.push(descriptor1);
            }
            if (this.selectedConnectorItem) {
                const descriptor2 = this.getBooleanDescriptor(operator2);
                if (descriptor2 != null) {
                    booleanDescriptors.push(descriptor2);
                }
            }
            const descriptor = {
                logic: this.selectedConnectorItem?.value ?? "and",
                filters: booleanDescriptors
            };
            this.apply.emit(descriptor);
        }
        else {
            console.log("Filter type not supported yet.");
        }
    }
    onFilterClear() {
        this.numberFilterValues = [null, null];
        this.stringFilterValues = ["", ""];
        this.dateFilterValues = [null, null];
        this.booleanFilterValues = [null, null];
        this.selectedFilterMenuDataItemList = [undefined, undefined];
        this.selectedConnectorItem = null;
        this.apply.emit({
            logic: "and",
            filters: []
        });
    }
    onFilterOperatorChange(index, item) {
        this.selectedFilterMenuDataItemList[index] = item;
    }
    get firstFilterValid() {
        const operator = this.selectedFilterMenuDataItemList[0]?.value;
        if (!operator) {
            return false;
        }
        if (operator === "isnull" || operator === "isnotnull") {
            return true;
        }
        switch (this.type) {
            case "string":
                if (operator === "isempty" ||
                    operator === "isnotempty" ||
                    operator === "isnullorempty" ||
                    operator === "isnotnullorempty") {
                    return true;
                }
                return this.stringFilterValues[0] !== "";
            case "number":
                return this.numberFilterValues[0] !== null;
            case "date":
                return this.dateFilterValues[0] !== null;
            case "boolean":
                return true;
            default:
                return false;
        }
    }
    get secondFilterValid() {
        const operator = this.selectedFilterMenuDataItemList[1]?.value;
        if (!operator) {
            return false;
        }
        if (operator === "isnull" || operator === "isnotnull") {
            return true;
        }
        switch (this.type) {
            case "string":
                if (operator === "isempty" ||
                    operator === "isnotempty" ||
                    operator === "isnullorempty" ||
                    operator === "isnotnullorempty") {
                    return true;
                }
                return this.stringFilterValues[1] !== "";
            case "number":
                return this.numberFilterValues[1] !== null;
            case "date":
                return this.dateFilterValues[1] !== null;
            case "boolean":
                return true;
            default:
                return false;
        }
    }
    getFilterValues() {
        switch (this.type) {
            case "string":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.stringFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.stringFilterValues[1]
                };
            case "number":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.numberFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.numberFilterValues[1]
                };
            case "date":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.dateFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.dateFilterValues[1]
                };
            case "boolean":
                return {
                    operator1: this.selectedFilterMenuDataItemList[0]?.value,
                    value1: this.booleanFilterValues[0],
                    logic: this.selectedConnectorItem?.value,
                    operator2: this.selectedFilterMenuDataItemList[1]?.value,
                    value2: this.booleanFilterValues[1]
                };
            default:
                return {
                    operator1: undefined,
                    value1: null,
                    logic: undefined,
                    operator2: undefined,
                    value2: null
                };
        }
    }
    setFilterValues(values) {
        switch (this.type) {
            case "string":
                this.selectedFilterMenuDataItemList = [
                    this.stringFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.stringFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.stringFilterValues = [values.value1 ?? "", values.value2 ?? ""];
                this.selectedConnectorItem = this.connectorDataItems.find(c => c.value === values.logic) ?? null;
                break;
            case "number":
                this.selectedFilterMenuDataItemList = [
                    this.numericFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.numericFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.numberFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            case "date":
                this.selectedFilterMenuDataItemList = [
                    this.dateFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.dateFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.dateFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            case "boolean":
                this.selectedFilterMenuDataItemList = [
                    this.booleanFilterMenuDataItems.find(f => f.value === values.operator1) ?? undefined,
                    this.booleanFilterMenuDataItems.find(f => f.value === values.operator2) ?? undefined
                ];
                this.booleanFilterValues = [values.value1 ?? null, values.value2 ?? null];
                break;
            default:
                break;
        }
        this.selectedConnectorItem = this.connectorDataItems.find(c => c.value === values.logic) ?? null;
    }
    get applyDisabled() {
        return !this.firstFilterValid || (!!this.selectedConnectorItem && !this.secondFilterValid);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: FilterMenuComponent, selector: "mona-filter-menu", inputs: { dateOptions: "dateOptions", field: "field", operators: "operators", value: "value", type: "type" }, outputs: { apply: "apply" }, ngImport: i0, template: "<div class=\"mona-filter-menu\">\n    <div class=\"mona-filter-menu-item\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"firstFilterValid\">\n        <mona-button-group selection=\"single\" [disabled]=\"!firstFilterValid\">\n            <button monaButton [selected]=\"item.value === selectedConnectorItem?.value\" (click)=\"onConnectorChange(item)\" *ngFor=\"let item of connectorDataItems\">{{item.text}}</button>\n        </mona-button-group>\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"!!selectedConnectorItem\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item mona-filter-menu-actions\">\n        <button monaButton (click)=\"onFilterApply()\" [disabled]=\"applyDisabled\">Apply</button>\n        <button monaButton (click)=\"onFilterClear()\">Clear</button>\n    </div>\n</div>\n", styles: ["div.mona-filter-menu{width:100%;padding:5px;display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-item{display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-actions{display:flex;flex-direction:row;align-items:center;justify-content:center;column-gap:5px}div.mona-filter-menu-actions>button{flex:1}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: DropDownListComponent, selector: "mona-drop-down-list", inputs: ["filterable", "value"], outputs: ["valueChange"] }, { kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: NumericTextBoxComponent, selector: "mona-numeric-text-box", inputs: ["decimals", "disabled", "formatter", "max", "min", "readonly", "spinners", "step", "value"], outputs: ["inputBlur", "inputFocus", "valueChange"] }, { kind: "component", type: DatePickerComponent, selector: "mona-date-picker", inputs: ["format"] }, { kind: "component", type: DateTimePickerComponent, selector: "mona-date-time-picker", inputs: ["format", "hourFormat", "showSeconds"] }, { kind: "component", type: TimePickerComponent, selector: "mona-time-picker", inputs: ["hourFormat", "showSeconds"] }, { kind: "component", type: ButtonGroupComponent, selector: "mona-button-group", inputs: ["disabled", "selection"] }, { kind: "pipe", type: ValuelessOperatorPipe, name: "valuelessOperator" }, { kind: "pipe", type: OperatorFilterPipe, name: "operatorFilter" }], changeDetection: i0.ChangeDetectionStrategy.Default }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-filter-menu", changeDetection: ChangeDetectionStrategy.Default, template: "<div class=\"mona-filter-menu\">\n    <div class=\"mona-filter-menu-item\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[0]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[0]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[0]\"\n                                 (valueChange)=\"onFilterOperatorChange(0, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"firstFilterValid\">\n        <mona-button-group selection=\"single\" [disabled]=\"!firstFilterValid\">\n            <button monaButton [selected]=\"item.value === selectedConnectorItem?.value\" (click)=\"onConnectorChange(item)\" *ngFor=\"let item of connectorDataItems\">{{item.text}}</button>\n        </mona-button-group>\n    </div>\n    <div class=\"mona-filter-menu-item\" *ngIf=\"!!selectedConnectorItem\">\n        <ng-container *ngIf=\"type==='string'\">\n            <mona-drop-down-list [data]=\"stringFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n            <mona-text-box [(ngModel)]=\"stringFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='number'\">\n            <mona-drop-down-list [data]=\"numericFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-numeric-text-box [(ngModel)]=\"numberFilterValues[1]\" [disabled]=\"selectedFilterMenuDataItemList[0]?.value|valuelessOperator\"></mona-numeric-text-box>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='date'\">\n            <mona-drop-down-list [data]=\"dateFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n\n            <mona-date-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='date'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-picker>\n\n            <mona-date-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='datetime'\"\n                                   [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-date-time-picker>\n\n            <mona-time-picker [(value)]=\"dateFilterValues[1]\" [format]=\"dateOptions.format\" *ngIf=\"dateOptions.type==='time'\"\n                              [disabled]=\"selectedFilterMenuDataItemList[1]?.value|valuelessOperator\"></mona-time-picker>\n        </ng-container>\n\n        <ng-container *ngIf=\"type==='boolean'\">\n            <mona-drop-down-list [data]=\"booleanFilterMenuDataItems|operatorFilter:operators\" textField=\"text\" valueField=\"value\" [value]=\"selectedFilterMenuDataItemList[1]\"\n                                 (valueChange)=\"onFilterOperatorChange(1, $event)\"></mona-drop-down-list>\n        </ng-container>\n\n    </div>\n    <div class=\"mona-filter-menu-item mona-filter-menu-actions\">\n        <button monaButton (click)=\"onFilterApply()\" [disabled]=\"applyDisabled\">Apply</button>\n        <button monaButton (click)=\"onFilterClear()\">Clear</button>\n    </div>\n</div>\n", styles: ["div.mona-filter-menu{width:100%;padding:5px;display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-item{display:flex;flex-direction:column;row-gap:5px}div.mona-filter-menu-actions{display:flex;flex-direction:row;align-items:center;justify-content:center;column-gap:5px}div.mona-filter-menu-actions>button{flex:1}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { apply: [{
                type: Output
            }], dateOptions: [{
                type: Input
            }], field: [{
                type: Input
            }], operators: [{
                type: Input
            }], value: [{
                type: Input
            }], type: [{
                type: Input
            }] } });

class FilterModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, declarations: [FilterMenuComponent, ValuelessOperatorPipe, OperatorFilterPipe], imports: [CommonModule,
            DropDownListModule,
            TextBoxModule,
            ButtonModule,
            FormsModule,
            NumericTextBoxModule,
            DatePickerModule,
            DateTimePickerModule,
            TimePickerModule,
            ButtonGroupModule], exports: [FilterMenuComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, imports: [CommonModule,
            DropDownListModule,
            TextBoxModule,
            ButtonModule,
            FormsModule,
            NumericTextBoxModule,
            DatePickerModule,
            DateTimePickerModule,
            TimePickerModule,
            ButtonGroupModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: FilterModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [FilterMenuComponent, ValuelessOperatorPipe, OperatorFilterPipe],
                    imports: [
                        CommonModule,
                        DropDownListModule,
                        TextBoxModule,
                        ButtonModule,
                        FormsModule,
                        NumericTextBoxModule,
                        DatePickerModule,
                        DateTimePickerModule,
                        TimePickerModule,
                        ButtonGroupModule
                    ],
                    exports: [FilterMenuComponent]
                }]
        }] });

class CellEditEvent extends PreventableEvent {
    #options;
    constructor(options) {
        super("cellEdit");
        this.#options = options;
    }
    get field() {
        return this.#options.field;
    }
    get newValue() {
        return this.#options.newValue;
    }
    get oldValue() {
        return this.#options.oldValue;
    }
    get rowData() {
        return this.#options.rowData;
    }
    setNewValue(value) {
        this.#options.setNewValue(value);
    }
}

class Row {
    #editFromDictionary;
    constructor(data) {
        this.#editFromDictionary = new Dictionary();
        this.uid = v4();
        this.data = {};
        this.selected = false;
        this.data = data;
    }
    getEditForm(key) {
        return this.#editFromDictionary.get(key);
    }
    setEditForm(key, form) {
        this.#editFromDictionary.put(key, form);
    }
}

class GridService {
    constructor() {
        this.cellEdit$ = new Subject();
        this.selectedRowsChange$ = new Subject();
        this.appliedFilters = new Dictionary();
        this.appliedSorts = new Dictionary();
        this.columns = [];
        this.editableOptions = { enabled: false };
        this.filterLoad$ = new Subject();
        this.groupColumns = [];
        this.gridGroupExpandState = new Dictionary();
        this.isInEditMode = false;
        this.pageState = { page: 1, skip: 0, take: 10 };
        this.rows = [];
        this.selectedKeys = new EnumerableSet();
        this.selectionKeyField = ""; // set by GridSelectableDirective
        this.selectableOptions = {
            enabled: false,
            mode: "single"
        };
        this.selectedKeysChange = new EventEmitter();
        this.selectedRows = [];
        this.sortLoad$ = new Subject();
        this.sortableOptions = {
            enabled: false,
            mode: "single",
            allowUnsort: false,
            showIndices: true
        };
    }
    loadFilters(filters) {
        const newAppliedFilters = new Dictionary();
        for (const filter of filters) {
            const filter1 = filter.filters[0];
            const filter2 = filter.filters[1];
            const column = this.columns.find(c => c.field === filter1.field);
            if (column != null) {
                newAppliedFilters.add(column.field, {
                    filter: filter,
                    filterMenuValue: {
                        value1: filter1 && "value" in filter1 ? filter1.value : undefined,
                        value2: filter2 && "value" in filter2 ? filter2.value : undefined,
                        operator1: filter1 ? filter1.operator : undefined,
                        operator2: filter2 ? filter2.operator : undefined,
                        logic: filter.logic || "and"
                    }
                });
            }
        }
        this.columns.forEach(c => (c.filtered = newAppliedFilters.containsKey(c.field)));
        this.appliedFilters = newAppliedFilters;
        this.filterLoad$.next();
    }
    loadSelectedKeys(selectedKeys) {
        this.selectedRows = [];
        this.selectedKeys = new EnumerableSet(selectedKeys);
        for (const row of this.rows) {
            const fieldData = this.selectionKeyField ? row.data[this.selectionKeyField] : row.data;
            if (fieldData == null) {
                continue;
            }
            row.selected = this.selectedKeys.contains(fieldData);
            if (row.selected) {
                this.selectedRows = [...this.selectedRows, row];
            }
        }
    }
    loadSorts(sorts) {
        const newAppliedSorts = new Dictionary();
        for (const [index, sort] of sorts.entries()) {
            const column = this.columns.find(c => c.field === sort.field);
            if (column != null) {
                newAppliedSorts.add(column.field, {
                    sort: sort
                });
                column.sortIndex = index + 1;
                column.sortDirection = sort.dir;
            }
        }
        this.appliedSorts = newAppliedSorts;
        this.sortLoad$.next();
    }
    setEditableOptions(options) {
        this.editableOptions = { ...this.editableOptions, ...options };
    }
    setRows(value) {
        this.rows = Enumerable.from(value)
            .select(r => new Row(r))
            .toArray();
    }
    setSelectableOptions(options) {
        this.selectableOptions = { ...this.selectableOptions, ...options };
    }
    setSortableOptions(options) {
        this.sortableOptions = { ...this.sortableOptions, ...options };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class GridEditableDirective {
    constructor(gridService) {
        this.gridService = gridService;
    }
    ngOnInit() {
        if (this.options) {
            this.gridService.setEditableOptions(this.options);
        }
        else if (this.options === "") {
            this.gridService.setEditableOptions({ enabled: true });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridEditableDirective, deps: [{ token: GridService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: GridEditableDirective, selector: "[monaGridEditable]", inputs: { options: ["monaGridEditable", "options"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridEditableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaGridEditable]"
                }]
        }], ctorParameters: function () { return [{ type: GridService }]; }, propDecorators: { options: [{
                type: Input,
                args: ["monaGridEditable"]
            }] } });

class Column {
    constructor() {
        this.field = "";
        this.filterType = "string";
        this.filtered = false;
        this.index = 0; // 0-based
        this.minWidth = 40;
        this.title = "";
    }
}

class GridCellTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridCellTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: GridCellTemplateDirective, selector: "ng-template[monaGridCellTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridCellTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaGridCellTemplate]"
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

class GridColumnComponent {
    set cellTemplate(value) {
        this.column.cellTemplate = value;
    }
    set field(value) {
        this.column.field = value;
    }
    set filterType(value) {
        this.column.filterType = value;
    }
    set maxWidth(value) {
        this.column.maxWidth = value;
    }
    set minWidth(value) {
        this.column.minWidth = value;
    }
    set title(value) {
        this.column.title = value;
    }
    set width(value) {
        this.column.width = value;
    }
    constructor() {
        this.column = new Column();
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridColumnComponent, selector: "mona-grid-column", inputs: { field: "field", filterType: "filterType", maxWidth: "maxWidth", minWidth: "minWidth", title: "title", width: "width" }, queries: [{ propertyName: "cellTemplate", first: true, predicate: GridCellTemplateDirective, descendants: true }], ngImport: i0, template: "", isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid-column", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { cellTemplate: [{
                type: ContentChild,
                args: [GridCellTemplateDirective]
            }], field: [{
                type: Input
            }], filterType: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], title: [{
                type: Input
            }], width: [{
                type: Input
            }] } });

class PageSizeChangeEvent extends PreventableEvent {
    constructor(newPageSize, oldPageSize) {
        super("pageSizeChange");
        this.newPageSize = newPageSize;
        this.oldPageSize = oldPageSize;
    }
}

class PagerComponent {
    set pageSizeValues(values) {
        if (values === false || (Array.isArray(values) && values.length === 0)) {
            this.pageSizeValueList = [];
        }
        else if (Array.isArray(values)) {
            this.pageSizeValueList = values;
        }
        else {
            this.pageSizeValueList = [10, 20, 50, 100];
        }
    }
    constructor() {
        this.previousPageSize = 10;
        this.ellipsisIcon = faEllipsis;
        this.firstPageIcon = faAngleDoubleLeft;
        this.lastPageIcon = faAngleDoubleRight;
        this.nextIcon = faAngleRight;
        this.previousIcon = faAngleLeft;
        this.inputValue = null;
        this.pageCount = 10;
        this.page = 1;
        this.pageSizeValueList = [];
        this.pages = [];
        this.firstLast = true;
        this.pageChange = new EventEmitter();
        this.pageInput = false;
        this.pageSize = 10;
        this.pageSizeChange = new EventEmitter();
        this.previousNext = true;
        this.skip = 0;
        this.total = 0;
        this.type = "numeric";
        this.visiblePages = 5;
    }
    ngOnChanges(changes) {
        if (changes["pageSize"] || changes["total"] || changes["visiblePages"] || changes["skip"]) {
            const pageSize = changes["pageSize"] ? changes["pageSize"].currentValue : this.pageSize;
            const total = changes["total"] ? changes["total"].currentValue : this.total;
            const visiblePages = changes["visiblePages"] ? changes["visiblePages"].currentValue : this.visiblePages;
            this.pageCount = Math.ceil(total / pageSize);
            if (changes["skip"] && changes["skip"].currentValue !== changes["skip"].previousValue) {
                const skip = changes["skip"].currentValue;
                this.page = Math.floor(skip / pageSize) + 1 ?? this.page;
                this.inputValue = this.page;
            }
            this.pageCount = Math.ceil(total / pageSize);
            this.preparePages(this.page, visiblePages, this.pageCount);
        }
    }
    ngOnInit() { }
    onJumpNextClick() {
        const page = Math.min(this.page + this.visiblePages, this.pageCount);
        this.setPage(page);
    }
    onJumpPreviousClick() {
        const page = Math.max(this.page - this.visiblePages, 1);
        this.setPage(page);
    }
    onNextPageClick() {
        const page = Math.min(this.page + 1, this.pageCount);
        this.setPage(page);
    }
    onPageClick(page) {
        if (page === this.page) {
            return;
        }
        this.setPage(page);
    }
    onPageInputBlur() {
        if (this.inputValue === null || this.inputValue === this.page) {
            this.inputValue = this.page;
            return;
        }
        if (this.inputValue < 1) {
            this.inputValue = 1;
        }
        else if (this.inputValue > this.pageCount) {
            this.inputValue = this.pageCount;
        }
        this.setPage(this.inputValue);
    }
    onPageSizeValueChange(value) {
        if (value === this.pageSize) {
            return;
        }
        const event = new PageSizeChangeEvent(value, this.pageSize);
        if (this.pageSizeDropdownList) {
            this.pageSizeDropdownList.setValue(this.previousPageSize);
        }
        this.pageSizeChange.emit(event);
        if (event.isDefaultPrevented()) {
            this.pageSize = this.previousPageSize;
            if (this.pageSizeDropdownList) {
                this.pageSizeDropdownList.setValue(this.previousPageSize);
            }
            return;
        }
        this.previousPageSize = value;
        if (this.pageSizeDropdownList) {
            this.pageSizeDropdownList.setValue(value);
        }
        this.pageCount = Math.ceil(this.total / this.pageSize);
        this.setPage(1);
    }
    onPreviousPageClick() {
        const page = Math.max(this.page - 1, 1);
        this.setPage(page);
    }
    preparePages(currentPage, visiblePages, maxPages) {
        const half = Math.floor(visiblePages / 2);
        let first = 1;
        let index = 0;
        this.pages = [];
        if (maxPages <= 10) {
            for (index = 1; index <= maxPages; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
        }
        else if (currentPage < visiblePages) {
            this.pages.push({ page: first, text: first.toString() });
            for (index = 2; index < (maxPages < visiblePages ? maxPages : visiblePages) + 1; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
            this.pages.push({ page: maxPages, text: maxPages.toString() });
        }
        else if (currentPage >= visiblePages && currentPage <= maxPages - visiblePages) {
            this.pages.push({ page: first, text: first.toString() });
            for (index = currentPage - half; index < currentPage + visiblePages - half; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
            this.pages.push({ page: maxPages, text: maxPages.toString() });
        }
        else if (currentPage >= maxPages - visiblePages) {
            this.pages.push({ page: first, text: first.toString() });
            index = maxPages - visiblePages < currentPage ? maxPages - visiblePages : currentPage;
            for (; index <= maxPages; index++) {
                this.pages.push({ page: index, text: index.toString() });
            }
        }
    }
    setPage(page) {
        const skip = (page - 1) * this.pageSize;
        this.pageChange.emit({ page, skip, take: this.pageSize });
    }
    get currentPageDataCountEnd() {
        return Math.min(this.page * this.pageSize, this.total);
    }
    get currentPageDataCountStart() {
        return (this.page - 1) * this.pageSize + 1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: PagerComponent, selector: "mona-pager", inputs: { firstLast: "firstLast", pageInput: "pageInput", pageSize: "pageSize", previousNext: "previousNext", pageSizeValues: "pageSizeValues", skip: "skip", total: "total", type: "type", visiblePages: "visiblePages" }, outputs: { pageChange: "pageChange", pageSizeChange: "pageSizeChange" }, viewQueries: [{ propertyName: "pageSizeDropdownList", first: true, predicate: ["pageSizeDropdownList"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-pager\">\n    <ng-container *ngIf=\"type==='numeric'\">\n        <ol class=\"mona-pager-list\">\n            <li *ngIf=\"firstLast\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(1)\" [disabled]=\"page===1\">\n                    <fa-icon [icon]=\"firstPageIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"previousNext\">\n                <button monaButton [flat]=\"true\" [disabled]=\"page<=1\" (click)=\"onPreviousPageClick()\">\n                    <fa-icon [icon]=\"previousIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"pages.length !== 0\" [ngClass]=\"{'mona-pager-active': page===1}\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(1)\">1</button>\n            </li>\n            <li *ngIf=\"pages.length > visiblePages && pages[1].page - 1 > 1\">\n                <button monaButton [flat]=\"true\" (click)=\"onJumpPreviousClick()\">\n                    <fa-icon [icon]=\"ellipsisIcon\"></fa-icon>\n                </button>\n            </li>\n            <ng-container *ngFor=\"let pageItem of pages|monaSlice:1:pages.length-1; let px = index;\">\n                <li [attr.data-page]=\"pageItem.page\" [ngClass]=\"{'mona-pager-active': page===pageItem.page}\">\n                    <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageItem.page)\">{{pageItem.text}}</button>\n                </li>\n            </ng-container>\n            <li *ngIf=\"pages.length > visiblePages && pages[pages.length-1].page - pages[pages.length-2].page > 1\">\n                <button monaButton [flat]=\"true\" (click)=\"onJumpNextClick()\">\n                    <fa-icon [icon]=\"ellipsisIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"pages.length > 1\" [ngClass]=\"{'mona-pager-active': page===pageCount}\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageCount)\">{{pageCount}}</button>\n            </li>\n            <li *ngIf=\"previousNext\">\n                <button monaButton [flat]=\"true\" [disabled]=\"page < 1 || page === pageCount\" (click)=\"onNextPageClick()\">\n                    <fa-icon [icon]=\"nextIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"firstLast\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageCount)\" [disabled]=\"page===pageCount\">\n                    <fa-icon [icon]=\"lastPageIcon\"></fa-icon>\n                </button>\n            </li>\n            <li>\n                <mona-numeric-text-box [spinners]=\"false\" [min]=\"1\" [max]=\"pageCount\" [(value)]=\"inputValue\"\n                                       (inputBlur)=\"onPageInputBlur()\" *ngIf=\"pageInput\"></mona-numeric-text-box>\n            </li>\n            <li *ngIf=\"pageSizeValueList.length !== 0\">\n                <mona-drop-down-list [data]=\"pageSizeValueList\" [value]=\"pageSize\"\n                                     (valueChange)=\"onPageSizeValueChange($event)\" #pageSizeDropdownList></mona-drop-down-list>\n                <span>items per page</span>\n            </li>\n        </ol>\n        <div class=\"mona-pager-info\">\n            <span>{{currentPageDataCountStart}} - {{currentPageDataCountEnd}} of {{total}} items</span>\n        </div>\n    </ng-container>\n    <ng-container *ngIf=\"type==='input'\">\n        <div class=\"mona-pager-input\">\n            <ol class=\"mona-pager-list\">\n                <li *ngIf=\"firstLast\">\n                    <button monaButton [flat]=\"true\" (click)=\"onPageClick(1)\" [disabled]=\"page===1\">\n                        <fa-icon [icon]=\"firstPageIcon\"></fa-icon>\n                    </button>\n                </li>\n                <li *ngIf=\"previousNext\">\n                    <button monaButton [flat]=\"true\" [disabled]=\"page<=1\" (click)=\"onPreviousPageClick()\">\n                        <fa-icon [icon]=\"previousIcon\"></fa-icon>\n                    </button>\n                </li>\n               <li>\n                   <span class=\"mona-pager-input-text\">Page</span>\n                   <mona-numeric-text-box [spinners]=\"false\" [min]=\"1\" [max]=\"pageCount\" [(value)]=\"inputValue\"\n                                          (inputBlur)=\"onPageInputBlur()\"></mona-numeric-text-box>\n                   <span class=\"mona-pager-input-text\">of</span>\n                   <span class=\"mona-pager-input-text\">{{pageCount}}</span>\n               </li>\n                <li *ngIf=\"previousNext\">\n                    <button monaButton [flat]=\"true\" [disabled]=\"page < 1 || page === pageCount\" (click)=\"onNextPageClick()\">\n                        <fa-icon [icon]=\"nextIcon\"></fa-icon>\n                    </button>\n                </li>\n                <li *ngIf=\"firstLast\">\n                    <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageCount)\" [disabled]=\"page===pageCount\">\n                        <fa-icon [icon]=\"lastPageIcon\"></fa-icon>\n                    </button>\n                </li>\n            </ol>\n        </div>\n        <div class=\"mona-pager-info\">\n            <span>{{(page-1)*pageSize+1}} - {{page*pageSize > total ? total : page*pageSize}} of {{total}} items</span>\n        </div>\n    </ng-container>\n</div>\n", styles: ["div.mona-pager{display:flex;padding:5px 10px}ol.mona-pager-list{display:flex}ol.mona-pager-list li{list-style:none;display:flex;align-items:center;justify-content:center}mona-numeric-text-box{margin-left:20px;width:50px}mona-drop-down-list{margin:0 5px}div.mona-pager-input{display:flex;align-items:center}div.mona-pager-input mona-numeric-text-box{width:50px;margin:0 5px}div.mona-pager-input span{margin:0 5px}div.mona-pager-info{display:flex;align-items:center;justify-content:flex-end;flex:1 1 0;padding-left:10px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "component", type: NumericTextBoxComponent, selector: "mona-numeric-text-box", inputs: ["decimals", "disabled", "formatter", "max", "min", "readonly", "spinners", "step", "value"], outputs: ["inputBlur", "inputFocus", "valueChange"] }, { kind: "component", type: DropDownListComponent, selector: "mona-drop-down-list", inputs: ["filterable", "value"], outputs: ["valueChange"] }, { kind: "pipe", type: SlicePipe, name: "monaSlice" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-pager", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-pager\">\n    <ng-container *ngIf=\"type==='numeric'\">\n        <ol class=\"mona-pager-list\">\n            <li *ngIf=\"firstLast\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(1)\" [disabled]=\"page===1\">\n                    <fa-icon [icon]=\"firstPageIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"previousNext\">\n                <button monaButton [flat]=\"true\" [disabled]=\"page<=1\" (click)=\"onPreviousPageClick()\">\n                    <fa-icon [icon]=\"previousIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"pages.length !== 0\" [ngClass]=\"{'mona-pager-active': page===1}\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(1)\">1</button>\n            </li>\n            <li *ngIf=\"pages.length > visiblePages && pages[1].page - 1 > 1\">\n                <button monaButton [flat]=\"true\" (click)=\"onJumpPreviousClick()\">\n                    <fa-icon [icon]=\"ellipsisIcon\"></fa-icon>\n                </button>\n            </li>\n            <ng-container *ngFor=\"let pageItem of pages|monaSlice:1:pages.length-1; let px = index;\">\n                <li [attr.data-page]=\"pageItem.page\" [ngClass]=\"{'mona-pager-active': page===pageItem.page}\">\n                    <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageItem.page)\">{{pageItem.text}}</button>\n                </li>\n            </ng-container>\n            <li *ngIf=\"pages.length > visiblePages && pages[pages.length-1].page - pages[pages.length-2].page > 1\">\n                <button monaButton [flat]=\"true\" (click)=\"onJumpNextClick()\">\n                    <fa-icon [icon]=\"ellipsisIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"pages.length > 1\" [ngClass]=\"{'mona-pager-active': page===pageCount}\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageCount)\">{{pageCount}}</button>\n            </li>\n            <li *ngIf=\"previousNext\">\n                <button monaButton [flat]=\"true\" [disabled]=\"page < 1 || page === pageCount\" (click)=\"onNextPageClick()\">\n                    <fa-icon [icon]=\"nextIcon\"></fa-icon>\n                </button>\n            </li>\n            <li *ngIf=\"firstLast\">\n                <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageCount)\" [disabled]=\"page===pageCount\">\n                    <fa-icon [icon]=\"lastPageIcon\"></fa-icon>\n                </button>\n            </li>\n            <li>\n                <mona-numeric-text-box [spinners]=\"false\" [min]=\"1\" [max]=\"pageCount\" [(value)]=\"inputValue\"\n                                       (inputBlur)=\"onPageInputBlur()\" *ngIf=\"pageInput\"></mona-numeric-text-box>\n            </li>\n            <li *ngIf=\"pageSizeValueList.length !== 0\">\n                <mona-drop-down-list [data]=\"pageSizeValueList\" [value]=\"pageSize\"\n                                     (valueChange)=\"onPageSizeValueChange($event)\" #pageSizeDropdownList></mona-drop-down-list>\n                <span>items per page</span>\n            </li>\n        </ol>\n        <div class=\"mona-pager-info\">\n            <span>{{currentPageDataCountStart}} - {{currentPageDataCountEnd}} of {{total}} items</span>\n        </div>\n    </ng-container>\n    <ng-container *ngIf=\"type==='input'\">\n        <div class=\"mona-pager-input\">\n            <ol class=\"mona-pager-list\">\n                <li *ngIf=\"firstLast\">\n                    <button monaButton [flat]=\"true\" (click)=\"onPageClick(1)\" [disabled]=\"page===1\">\n                        <fa-icon [icon]=\"firstPageIcon\"></fa-icon>\n                    </button>\n                </li>\n                <li *ngIf=\"previousNext\">\n                    <button monaButton [flat]=\"true\" [disabled]=\"page<=1\" (click)=\"onPreviousPageClick()\">\n                        <fa-icon [icon]=\"previousIcon\"></fa-icon>\n                    </button>\n                </li>\n               <li>\n                   <span class=\"mona-pager-input-text\">Page</span>\n                   <mona-numeric-text-box [spinners]=\"false\" [min]=\"1\" [max]=\"pageCount\" [(value)]=\"inputValue\"\n                                          (inputBlur)=\"onPageInputBlur()\"></mona-numeric-text-box>\n                   <span class=\"mona-pager-input-text\">of</span>\n                   <span class=\"mona-pager-input-text\">{{pageCount}}</span>\n               </li>\n                <li *ngIf=\"previousNext\">\n                    <button monaButton [flat]=\"true\" [disabled]=\"page < 1 || page === pageCount\" (click)=\"onNextPageClick()\">\n                        <fa-icon [icon]=\"nextIcon\"></fa-icon>\n                    </button>\n                </li>\n                <li *ngIf=\"firstLast\">\n                    <button monaButton [flat]=\"true\" (click)=\"onPageClick(pageCount)\" [disabled]=\"page===pageCount\">\n                        <fa-icon [icon]=\"lastPageIcon\"></fa-icon>\n                    </button>\n                </li>\n            </ol>\n        </div>\n        <div class=\"mona-pager-info\">\n            <span>{{(page-1)*pageSize+1}} - {{page*pageSize > total ? total : page*pageSize}} of {{total}} items</span>\n        </div>\n    </ng-container>\n</div>\n", styles: ["div.mona-pager{display:flex;padding:5px 10px}ol.mona-pager-list{display:flex}ol.mona-pager-list li{list-style:none;display:flex;align-items:center;justify-content:center}mona-numeric-text-box{margin-left:20px;width:50px}mona-drop-down-list{margin:0 5px}div.mona-pager-input{display:flex;align-items:center}div.mona-pager-input mona-numeric-text-box{width:50px;margin:0 5px}div.mona-pager-input span{margin:0 5px}div.mona-pager-info{display:flex;align-items:center;justify-content:flex-end;flex:1 1 0;padding-left:10px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { firstLast: [{
                type: Input
            }], pageChange: [{
                type: Output
            }], pageInput: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeChange: [{
                type: Output
            }], pageSizeDropdownList: [{
                type: ViewChild,
                args: ["pageSizeDropdownList"]
            }], previousNext: [{
                type: Input
            }], pageSizeValues: [{
                type: Input
            }], skip: [{
                type: Input
            }], total: [{
                type: Input
            }], type: [{
                type: Input
            }], visiblePages: [{
                type: Input
            }] } });

class CheckBoxDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CheckBoxDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: CheckBoxDirective, selector: "input[type='checkbox'][monaCheckBox]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CheckBoxDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "input[type='checkbox'][monaCheckBox]"
                }]
        }], ctorParameters: function () { return []; } });

class GridCellComponent {
    #destroy;
    constructor(cdr, elementRef, focusMonitor, gridService) {
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.focusMonitor = focusMonitor;
        this.gridService = gridService;
        this.#destroy = new Subject();
        this.focused = false;
        this.editing = false;
    }
    ngOnDestroy() {
        this.#destroy.next();
        this.#destroy.complete();
    }
    ngOnInit() {
        this.initializeForm();
        this.setSubscriptions();
    }
    initializeForm() {
        const form = this.row.getEditForm(this.column.field);
        if (form) {
            this.editForm = form;
        }
        else {
            this.editForm = new FormGroup({});
            this.editForm.addControl(this.column.field, new FormControl(this.row.data[this.column.field]));
            this.row.setEditForm(this.column.field, this.editForm);
        }
    }
    onDateChange(date) {
        this.editing = false;
        this.gridService.isInEditMode = false;
    }
    onFocusChange(origin) {
        if (!origin) {
            const duration = this.column.filterType === "date" ? 50 : 25;
            timer(duration)
                .pipe(take(1))
                .subscribe(() => {
                if (!this.gridEditable) {
                    return;
                }
                if (this.column.filterType !== "date") {
                    if (this.editing) {
                        this.editing = false;
                        this.updateCellValue();
                    }
                }
                else {
                    const datePopup = document.querySelector(".mona-date-input-popup");
                    if (!datePopup) {
                        this.editing = false;
                    }
                    if (this.editing) {
                        this.updateCellValue();
                    }
                }
                this.cdr.markForCheck();
            });
            this.focused = false;
        }
        else {
            this.focused = true;
            if (this.gridService.isInEditMode) {
                if (origin !== "mouse") {
                    this.editing = true;
                    asyncScheduler.schedule(() => {
                        this.focusCellInput();
                    });
                }
            }
        }
    }
    notifyCellEdit() {
        const event = new CellEditEvent({
            field: this.column.field,
            oldValue: this.row.data[this.column.field],
            newValue: this.editForm.value[this.column.field],
            rowData: this.row.data,
            setNewValue: (value) => {
                this.editForm.get(this.column.field)?.setValue(value);
                this.row.data[this.column.field] = value;
            }
        });
        if (event.oldValue !== event.newValue) {
            this.gridService.cellEdit$.next(event);
        }
        return event;
    }
    focus() {
        this.focusMonitor.focusVia(this.elementRef.nativeElement.firstElementChild, "program");
    }
    focusCellInput() {
        if (this.column.filterType === "string" || this.column.filterType === "number") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        }
        else if (this.column.filterType === "date") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        }
        else if (this.column.filterType === "boolean") {
            this.elementRef.nativeElement.querySelector("input")?.focus();
        }
    }
    setSubscriptions() {
        fromEvent(this.elementRef.nativeElement, "dblclick")
            .pipe(takeUntil(this.#destroy), tap(event => event.stopPropagation()))
            .subscribe(() => {
            if (!this.gridEditable) {
                return;
            }
            this.editing = true;
            this.gridService.isInEditMode = true;
            this.cdr.markForCheck();
            asyncScheduler.schedule(() => {
                this.focusCellInput();
            });
        });
        fromEvent(this.elementRef.nativeElement, "click")
            .pipe(takeUntil(this.#destroy), tap(event => event.stopPropagation()))
            .subscribe(() => {
            if (!this.editing && this.gridService.isInEditMode) {
                this.gridService.isInEditMode = false;
            }
        });
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.#destroy), tap(event => event.stopPropagation()), filter(event => event.key === "Enter" ||
            event.key === "Escape" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowDown" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "F2"))
            .subscribe(event => {
            if (event.key === "Enter") {
                if (this.editing) {
                    this.updateCellValue();
                }
                this.gridService.isInEditMode = false;
                this.editing = false;
                this.focus();
            }
            else if (event.key === "Escape") {
                this.editing = false;
                this.gridService.isInEditMode = false;
                this.focus();
            }
            else if (event.key === "ArrowUp") {
                if (!this.editing) {
                    const previousRowElement = document.querySelector(`tr[data-ruid='${this.row.uid}']`)?.previousElementSibling;
                    if (previousRowElement) {
                        const cell = previousRowElement.querySelector(`td .mona-grid-cell[data-field='${this.column.field}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                }
            }
            else if (event.key === "ArrowDown") {
                if (!this.editing) {
                    const nextRowElement = document.querySelector(`tr[data-ruid='${this.row.uid}']`)?.nextElementSibling;
                    if (nextRowElement) {
                        const cell = nextRowElement.querySelector(`td .mona-grid-cell[data-field='${this.column.field}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                }
            }
            else if (event.key === "ArrowLeft") {
                if (!this.editing) {
                    const row = document.querySelector(`tr[data-ruid='${this.row.uid}']`);
                    if (!row) {
                        return;
                    }
                    if (this.column.index > 0) {
                        const cell = row.querySelector(`td .mona-grid-cell[data-col-index='${this.column.index - 1}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                    else {
                        const previousRowElement = row.previousElementSibling;
                        if (previousRowElement) {
                            const cell = previousRowElement.querySelector("td:last-child .mona-grid-cell");
                            if (cell) {
                                cell.focus();
                            }
                        }
                    }
                }
            }
            else if (event.key === "ArrowRight") {
                if (!this.editing) {
                    const row = document.querySelector(`tr[data-ruid='${this.row.uid}']`);
                    if (!row) {
                        return;
                    }
                    if (this.column.index < this.gridService.columns.length - 1) {
                        const cell = row.querySelector(`td .mona-grid-cell[data-col-index='${this.column.index + 1}']`);
                        if (cell) {
                            cell.focus();
                        }
                    }
                    else {
                        const nextRowElement = row.nextElementSibling;
                        if (nextRowElement) {
                            const cell = nextRowElement.querySelector("td:first-child .mona-grid-cell");
                            if (cell) {
                                cell.focus();
                            }
                        }
                    }
                }
            }
            else if (event.key === "F2") {
                if (!this.gridEditable) {
                    return;
                }
                if (this.focused) {
                    this.editing = true;
                    this.gridService.isInEditMode = true;
                    asyncScheduler.schedule(() => {
                        this.focusCellInput();
                    });
                }
            }
            this.cdr.markForCheck();
        });
    }
    updateCellValue() {
        const event = this.notifyCellEdit();
        if (!event.isDefaultPrevented()) {
            this.row.data[this.column.field] = this.editForm.value[this.column.field];
            return;
        }
        this.editForm.patchValue({
            [this.column.field]: this.row.data[this.column.field]
        });
    }
    get gridEditable() {
        return !!this.gridService.editableOptions && !!this.gridService.editableOptions.enabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridCellComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1$2.FocusMonitor }, { token: GridService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridCellComponent, selector: "mona-grid-cell", inputs: { column: "column", row: "row" }, ngImport: i0, template: "<div class=\"mona-grid-cell\" [attr.tabindex]=\"editing ? -1 : 0\" cdkMonitorSubtreeFocus (cdkFocusChange)=\"onFocusChange($event)\"\n     [ngClass]=\"{'mona-grid-cell-editing': editing}\" [attr.data-ruid]=\"row.uid\" [attr.data-field]=\"column.field\" [attr.data-col-index]=\"column.index\">\n    <ng-container *ngIf=\"!editing\">\n        <ng-container *ngIf=\"!column.cellTemplate\">\n            <span class=\"mona-grid-cell-text\">{{row.data[column.field]}}</span>\n        </ng-container>\n        <ng-container [ngTemplateOutlet]=\"column.cellTemplate.templateRef ?? null\"\n                      *ngIf=\"column.cellTemplate\" [ngTemplateOutletContext]=\"{$implicit: row, column}\"></ng-container>\n    </ng-container>\n    <ng-container [ngTemplateOutlet]=\"cellEditTemplate\" *ngIf=\"editing\"></ng-container>\n</div>\n\n<ng-template #cellEditTemplate>\n    <form [formGroup]=\"editForm\">\n        <ng-container *ngIf=\"column.filterType==='string'\">\n            <mona-text-box [formControlName]=\"column.field\"></mona-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='number'\">\n            <mona-numeric-text-box [formControlName]=\"column.field\" [decimals]=\"3\"></mona-numeric-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='date'\">\n            <mona-date-picker [formControlName]=\"column.field\" (valueChange)=\"onDateChange($event)\"></mona-date-picker>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='boolean'\">\n            <input type=\"checkbox\" [formControlName]=\"column.field\" monaCheckBox />\n        </ng-container>\n    </form>\n</ng-template>\n", styles: [":host{display:block;height:100%}div.mona-grid-cell{padding:9px 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;outline:none;height:100%}div.mona-grid-cell-editing{padding:1px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: TextBoxComponent, selector: "mona-text-box", inputs: ["disabled", "readonly"], outputs: ["inputBlur", "inputFocus"] }, { kind: "directive", type: i5$1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i5$1.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i5$1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i5$1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: NumericTextBoxComponent, selector: "mona-numeric-text-box", inputs: ["decimals", "disabled", "formatter", "max", "min", "readonly", "spinners", "step", "value"], outputs: ["inputBlur", "inputFocus", "valueChange"] }, { kind: "directive", type: i1$2.CdkMonitorFocus, selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]", outputs: ["cdkFocusChange"], exportAs: ["cdkMonitorFocus"] }, { kind: "component", type: DatePickerComponent, selector: "mona-date-picker", inputs: ["format"] }, { kind: "directive", type: CheckBoxDirective, selector: "input[type='checkbox'][monaCheckBox]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridCellComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid-cell", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-grid-cell\" [attr.tabindex]=\"editing ? -1 : 0\" cdkMonitorSubtreeFocus (cdkFocusChange)=\"onFocusChange($event)\"\n     [ngClass]=\"{'mona-grid-cell-editing': editing}\" [attr.data-ruid]=\"row.uid\" [attr.data-field]=\"column.field\" [attr.data-col-index]=\"column.index\">\n    <ng-container *ngIf=\"!editing\">\n        <ng-container *ngIf=\"!column.cellTemplate\">\n            <span class=\"mona-grid-cell-text\">{{row.data[column.field]}}</span>\n        </ng-container>\n        <ng-container [ngTemplateOutlet]=\"column.cellTemplate.templateRef ?? null\"\n                      *ngIf=\"column.cellTemplate\" [ngTemplateOutletContext]=\"{$implicit: row, column}\"></ng-container>\n    </ng-container>\n    <ng-container [ngTemplateOutlet]=\"cellEditTemplate\" *ngIf=\"editing\"></ng-container>\n</div>\n\n<ng-template #cellEditTemplate>\n    <form [formGroup]=\"editForm\">\n        <ng-container *ngIf=\"column.filterType==='string'\">\n            <mona-text-box [formControlName]=\"column.field\"></mona-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='number'\">\n            <mona-numeric-text-box [formControlName]=\"column.field\" [decimals]=\"3\"></mona-numeric-text-box>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='date'\">\n            <mona-date-picker [formControlName]=\"column.field\" (valueChange)=\"onDateChange($event)\"></mona-date-picker>\n        </ng-container>\n        <ng-container *ngIf=\"column.filterType==='boolean'\">\n            <input type=\"checkbox\" [formControlName]=\"column.field\" monaCheckBox />\n        </ng-container>\n    </form>\n</ng-template>\n", styles: [":host{display:block;height:100%}div.mona-grid-cell{padding:9px 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;outline:none;height:100%}div.mona-grid-cell-editing{padding:1px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1$2.FocusMonitor }, { type: GridService }]; }, propDecorators: { column: [{
                type: Input
            }], row: [{
                type: Input
            }] } });

class GridGroupPipe {
    constructor(gridService) {
        this.gridService = gridService;
    }
    transform(value, column, page) {
        return Enumerable.from(value)
            .groupBy(d => d.data[column.field])
            .select(g => {
            const rows = g.source.toArray();
            const groupKey = `${column.field}-${rows[0].data[column.field]}`;
            const collapsed = this.gridService.gridGroupExpandState.get(groupKey)?.get(page) ?? false;
            return {
                column,
                rows,
                collapsed
            };
        })
            .toArray();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridGroupPipe, deps: [{ token: GridService }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridGroupPipe, name: "gridGroup" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridGroupPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "gridGroup"
                }]
        }], ctorParameters: function () { return [{ type: GridService }]; } });

class GridListComponent {
    #destroy;
    constructor(gridService, elementRef) {
        this.gridService = gridService;
        this.elementRef = elementRef;
        this.#destroy = new Subject();
        this.collapseIcon = faChevronDown;
        this.expandIcon = faChevronRight;
        this.columns = [];
        this.data = [];
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.synchronizeHorizontalScroll();
        }, 0);
    }
    ngOnDestroy() {
        this.#destroy.next();
        this.#destroy.complete();
    }
    ngOnInit() {
        this.setSubscriptions();
    }
    onGridRowClick(event, row) {
        if (this.gridService.selectableOptions == null || !this.gridService.selectableOptions.enabled) {
            return;
        }
        if (this.gridService.selectableOptions.mode === "single") {
            if (row.selected && (event.ctrlKey || event.metaKey)) {
                this.gridService.selectedRows = [];
                row.selected = false;
            }
            else {
                if (this.gridService.selectedRows.length !== 0) {
                    this.gridService.selectedRows.forEach(r => (r.selected = false));
                }
                this.gridService.selectedRows = [row];
                row.selected = true;
            }
        }
        else if (this.gridService.selectableOptions.mode === "multiple") {
            if (this.gridService.selectedRows.length === 0) {
                this.gridService.selectedRows = [row];
                row.selected = true;
            }
            else {
                const index = this.gridService.selectedRows.findIndex(r => r === row);
                if (index === -1) {
                    this.gridService.selectedRows = [...this.gridService.selectedRows, row];
                    row.selected = true;
                }
                else {
                    if (event.ctrlKey || event.metaKey) {
                        this.gridService.selectedRows.splice(index, 1);
                        row.selected = false;
                    }
                }
            }
        }
        this.gridService.selectedRowsChange$.next(this.gridService.selectedRows);
    }
    onGroupExpandChange(group) {
        group.collapsed = !group.collapsed;
        const groupKey = `${group.column.field}-${group.rows[0].data[group.column.field]}`;
        const state = this.gridService.gridGroupExpandState.get(groupKey);
        if (state == null) {
            this.gridService.gridGroupExpandState.add(groupKey, new Dictionary(undefined, [
                new KeyValuePair(this.gridService.pageState.page, group.collapsed)
            ]));
        }
        else {
            if (state.containsKey(this.gridService.pageState.page)) {
                const value = state.get(this.gridService.pageState.page);
                if (value != null) {
                    state.remove(this.gridService.pageState.page);
                    state.add(this.gridService.pageState.page, !value);
                }
            }
            else {
                state.add(this.gridService.pageState.page, group.collapsed);
            }
        }
    }
    setSubscriptions() {
        fromEvent(document, "click")
            .pipe(mergeWith(fromEvent(document, "keyup")), takeUntil(this.#destroy))
            .subscribe(e => {
            if (e.type === "click") {
                const event = e;
                const target = event.target;
                if (target.closest(".mona-grid-cell") == null) {
                    this.gridService.isInEditMode = false;
                }
            }
            if (e.type === "keyup") {
                const event = e;
                if (event.key === "Escape") {
                    this.gridService.isInEditMode = false;
                }
            }
        });
    }
    synchronizeHorizontalScroll() {
        const headerElement = this.gridService.gridHeaderElement;
        const gridElement = this.elementRef.nativeElement.querySelector(".mona-grid-list");
        if (headerElement == null || gridElement == null) {
            return;
        }
        fromEvent(gridElement, "scroll")
            .pipe(takeUntil(this.#destroy))
            .subscribe(() => {
            headerElement.scrollLeft = gridElement.scrollLeft;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridListComponent, deps: [{ token: GridService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridListComponent, selector: "mona-grid-list", inputs: { columns: "columns", data: "data" }, ngImport: i0, template: "<div class=\"mona-grid-list\">\n    <div class=\"mona-grid-list-wrap\">\n        <table>\n            <colgroup>\n                <col *ngFor=\"let _ of gridService.groupColumns\" style=\"width: 34px;\">\n                <col *ngFor=\"let column of gridService.columns\"\n                     [style.width.px]=\"column.calculatedWidth\" [style.min-width.px]=\"column.minWidth\">\n            </colgroup>\n            <tbody>\n                <ng-container *ngIf=\"gridService.groupColumns.length === 0\">\n                    <tr *ngFor=\"let row of data; let rx=index;\" (click)=\"onGridRowClick($event, row)\" [ngClass]=\"{'mona-selected': row.selected}\"\n                        [attr.data-ruid]=\"row.uid\" [attr.data-row-view-index]=\"rx\">\n                        <td *ngFor=\"let column of columns\">\n                            <mona-grid-cell [column]=\"column\" [row]=\"row\"></mona-grid-cell>\n                        </td>\n                    </tr>\n                </ng-container>\n                <ng-container *ngIf=\"gridService.groupColumns.length !== 0\">\n                    <ng-template #gridGroupTemplate let-groupData let-column=\"column\" let-cx=\"cx\" let-depth=\"depth\">\n                        <ng-container *ngIf=\"groupData|gridGroup:column:gridService.pageState.page as groupItem\">\n                            <ng-container *ngFor=\"let subGroup of groupItem\">\n                                <tr class=\"mona-grid-grouping-row\">\n                                    <td *ngFor=\"let _ of gridService.groupColumns|monaSlice:0:cx\"></td>\n                                    <td [colSpan]=\"columns.length + gridService.groupColumns.length\"\n                                        *ngIf=\"subGroup.rows.length > 0\">\n                                        <button monaButton [flat]=\"true\" style=\"width: 34px;\" (click)=\"onGroupExpandChange(subGroup)\">\n                                            <fa-icon [icon]=\"collapseIcon\" *ngIf=\"!subGroup.collapsed\"></fa-icon>\n                                            <fa-icon [icon]=\"expandIcon\" *ngIf=\"subGroup.collapsed\"></fa-icon>\n                                        </button>\n                                        <span class=\"mona-grid-grouping-row-text\">{{column.title}}: {{subGroup.rows[0].data[column.field]}}</span>\n                                    </td>\n                                </tr>\n\n                                <ng-container *ngIf=\"cx < gridService.groupColumns.length-1 && !subGroup.collapsed\">\n                                    <ng-container [ngTemplateOutlet]=\"gridGroupTemplate\"\n                                                  [ngTemplateOutletContext]=\"{$implicit: subGroup.rows, column: gridService.groupColumns[cx+1], cx: cx+1, depth:depth+1}\">\n                                    </ng-container>\n                                </ng-container>\n                                <ng-container *ngIf=\"depth===gridService.groupColumns.length-1 && !subGroup.collapsed\">\n                                    <tr *ngFor=\"let row of subGroup.rows; let rx=index;\" (click)=\"onGridRowClick($event, row)\" [ngClass]=\"{'mona-selected': row.selected}\"\n                                        [attr.data-ruid]=\"row.uid\" [attr.data-row-view-index]=\"rx\">\n                                        <td *ngFor=\"let _ of gridService.groupColumns\"></td>\n                                        <td *ngFor=\"let column of columns\">\n                                            <mona-grid-cell [column]=\"column\" [row]=\"row\"></mona-grid-cell>\n                                        </td>\n                                    </tr>\n                                </ng-container>\n                            </ng-container>\n                        </ng-container>\n                    </ng-template>\n\n                    <ng-container [ngTemplateOutlet]=\"gridGroupTemplate\"\n                                  [ngTemplateOutletContext]=\"{$implicit: data, column: gridService.groupColumns[0], cx: 0, depth: 0}\"></ng-container>\n                </ng-container>\n            </tbody>\n        </table>\n    </div>\n</div>\n", styles: [":host{overflow:hidden;height:100%;display:flex}div.mona-grid-list{overflow:auto scroll;width:100%}table{border-collapse:collapse;width:100%;height:100%;table-layout:fixed}table tbody{text-align:left}table tr:nth-child(even){background-color:var(--mona-background-dark)}table tr:nth-child(odd){background-color:var(--mona-background)}table tr:not(:last-child){border-bottom:1px solid var(--mona-border-color)}table td{position:relative}table td:not(:last-child){border-right:1px solid var(--mona-border-color)}tr.mona-grid-grouping-row>td:last-child{font-weight:bolder;padding:0}span.mona-grid-grouping-row-text{font-weight:bolder;margin-left:8px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "component", type: GridCellComponent, selector: "mona-grid-cell", inputs: ["column", "row"] }, { kind: "pipe", type: SlicePipe, name: "monaSlice" }, { kind: "pipe", type: GridGroupPipe, name: "gridGroup" }], changeDetection: i0.ChangeDetectionStrategy.Default }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridListComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid-list", changeDetection: ChangeDetectionStrategy.Default, template: "<div class=\"mona-grid-list\">\n    <div class=\"mona-grid-list-wrap\">\n        <table>\n            <colgroup>\n                <col *ngFor=\"let _ of gridService.groupColumns\" style=\"width: 34px;\">\n                <col *ngFor=\"let column of gridService.columns\"\n                     [style.width.px]=\"column.calculatedWidth\" [style.min-width.px]=\"column.minWidth\">\n            </colgroup>\n            <tbody>\n                <ng-container *ngIf=\"gridService.groupColumns.length === 0\">\n                    <tr *ngFor=\"let row of data; let rx=index;\" (click)=\"onGridRowClick($event, row)\" [ngClass]=\"{'mona-selected': row.selected}\"\n                        [attr.data-ruid]=\"row.uid\" [attr.data-row-view-index]=\"rx\">\n                        <td *ngFor=\"let column of columns\">\n                            <mona-grid-cell [column]=\"column\" [row]=\"row\"></mona-grid-cell>\n                        </td>\n                    </tr>\n                </ng-container>\n                <ng-container *ngIf=\"gridService.groupColumns.length !== 0\">\n                    <ng-template #gridGroupTemplate let-groupData let-column=\"column\" let-cx=\"cx\" let-depth=\"depth\">\n                        <ng-container *ngIf=\"groupData|gridGroup:column:gridService.pageState.page as groupItem\">\n                            <ng-container *ngFor=\"let subGroup of groupItem\">\n                                <tr class=\"mona-grid-grouping-row\">\n                                    <td *ngFor=\"let _ of gridService.groupColumns|monaSlice:0:cx\"></td>\n                                    <td [colSpan]=\"columns.length + gridService.groupColumns.length\"\n                                        *ngIf=\"subGroup.rows.length > 0\">\n                                        <button monaButton [flat]=\"true\" style=\"width: 34px;\" (click)=\"onGroupExpandChange(subGroup)\">\n                                            <fa-icon [icon]=\"collapseIcon\" *ngIf=\"!subGroup.collapsed\"></fa-icon>\n                                            <fa-icon [icon]=\"expandIcon\" *ngIf=\"subGroup.collapsed\"></fa-icon>\n                                        </button>\n                                        <span class=\"mona-grid-grouping-row-text\">{{column.title}}: {{subGroup.rows[0].data[column.field]}}</span>\n                                    </td>\n                                </tr>\n\n                                <ng-container *ngIf=\"cx < gridService.groupColumns.length-1 && !subGroup.collapsed\">\n                                    <ng-container [ngTemplateOutlet]=\"gridGroupTemplate\"\n                                                  [ngTemplateOutletContext]=\"{$implicit: subGroup.rows, column: gridService.groupColumns[cx+1], cx: cx+1, depth:depth+1}\">\n                                    </ng-container>\n                                </ng-container>\n                                <ng-container *ngIf=\"depth===gridService.groupColumns.length-1 && !subGroup.collapsed\">\n                                    <tr *ngFor=\"let row of subGroup.rows; let rx=index;\" (click)=\"onGridRowClick($event, row)\" [ngClass]=\"{'mona-selected': row.selected}\"\n                                        [attr.data-ruid]=\"row.uid\" [attr.data-row-view-index]=\"rx\">\n                                        <td *ngFor=\"let _ of gridService.groupColumns\"></td>\n                                        <td *ngFor=\"let column of columns\">\n                                            <mona-grid-cell [column]=\"column\" [row]=\"row\"></mona-grid-cell>\n                                        </td>\n                                    </tr>\n                                </ng-container>\n                            </ng-container>\n                        </ng-container>\n                    </ng-template>\n\n                    <ng-container [ngTemplateOutlet]=\"gridGroupTemplate\"\n                                  [ngTemplateOutletContext]=\"{$implicit: data, column: gridService.groupColumns[0], cx: 0, depth: 0}\"></ng-container>\n                </ng-container>\n            </tbody>\n        </table>\n    </div>\n</div>\n", styles: [":host{overflow:hidden;height:100%;display:flex}div.mona-grid-list{overflow:auto scroll;width:100%}table{border-collapse:collapse;width:100%;height:100%;table-layout:fixed}table tbody{text-align:left}table tr:nth-child(even){background-color:var(--mona-background-dark)}table tr:nth-child(odd){background-color:var(--mona-background)}table tr:not(:last-child){border-bottom:1px solid var(--mona-border-color)}table td{position:relative}table td:not(:last-child){border-right:1px solid var(--mona-border-color)}tr.mona-grid-grouping-row>td:last-child{font-weight:bolder;padding:0}span.mona-grid-grouping-row-text{font-weight:bolder;margin-left:8px}\n"] }]
        }], ctorParameters: function () { return [{ type: GridService }, { type: i0.ElementRef }]; }, propDecorators: { columns: [{
                type: Input
            }], data: [{
                type: Input
            }] } });

class GridColumnResizeHandlerDirective {
    constructor(elementRef, zone, cdr) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.cdr = cdr;
        this.destroy$ = new Subject();
        this.resizeEnd = new EventEmitter();
        this.resizeStart = new EventEmitter();
    }
    ngAfterViewInit() {
        this.setEvents();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onMouseDown(event) {
        const element = this.elementRef.nativeElement;
        const initialWidth = this.column.calculatedWidth ?? element.offsetWidth;
        const initialX = event.clientX;
        const oldSelectStart = document.onselectstart;
        const oldDragStart = document.ondragstart;
        const headerTableElement = element.closest("table");
        const bodyTableElement = document.querySelector(".mona-grid-list-wrap > table");
        document.onselectstart = () => false;
        // document.ondragstart = () => false;
        this.resizeStart.emit();
        const onMouseMove = (event) => {
            const deltaX = event.clientX - initialX;
            const minWidth = this.column.minWidth;
            const maxWidth = this.column.maxWidth ?? window.innerWidth;
            if (initialWidth + deltaX < minWidth) {
                return;
            }
            if (initialWidth + deltaX > maxWidth) {
                return;
            }
            const oldWidth = this.column.calculatedWidth ?? element.offsetWidth;
            this.column.calculatedWidth = initialWidth + deltaX;
            if (headerTableElement) {
                headerTableElement.style.width = `${headerTableElement.offsetWidth + (this.column.calculatedWidth - oldWidth)}px`;
            }
            if (bodyTableElement) {
                bodyTableElement.style.width = `${bodyTableElement.offsetWidth + (this.column.calculatedWidth - oldWidth)}px`;
            }
            this.cdr.detectChanges();
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.onselectstart = oldSelectStart;
            // document.ondragstart = oldDragStart;
            this.resizeEnd.emit();
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    setEvents() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.destroy$))
                .subscribe(event => {
                event.stopImmediatePropagation();
                this.onMouseDown(event);
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnResizeHandlerDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: GridColumnResizeHandlerDirective, selector: "[monaGridColumnResizeHandler]", inputs: { column: "column" }, outputs: { resizeEnd: "resizeEnd", resizeStart: "resizeStart" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridColumnResizeHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "[monaGridColumnResizeHandler]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { column: [{
                type: Input
            }], resizeEnd: [{
                type: Output
            }], resizeStart: [{
                type: Output
            }] } });

class GridFilterMenuComponent {
    #destroy;
    constructor(cdr, popupService, elementRef, gridService) {
        this.cdr = cdr;
        this.popupService = popupService;
        this.elementRef = elementRef;
        this.gridService = gridService;
        this.#destroy = new Subject();
        this.filterIcon = faFilter;
        this.apply = new EventEmitter();
        this.type = "string";
    }
    ngOnDestroy() {
        this.#destroy.next();
        this.#destroy.complete();
    }
    ngOnInit() {
        this.setSubscriptions();
    }
    openPopup() {
        this.popupRef = this.popupService.create({
            anchor: this.elementRef.nativeElement,
            content: FilterMenuComponent,
            popupClass: "mona-grid-filter-menu-popup-content",
            preventClose: event => {
                if (event.originalEvent instanceof MouseEvent) {
                    const target = event.originalEvent.target;
                    if (target.closest(".mona-popup-content")) {
                        return true;
                    }
                }
                return false;
            }
        });
        const filterState = this.gridService.appliedFilters.get(this.column.field);
        const componentRef = this.popupRef.component;
        componentRef.instance.type = this.type;
        componentRef.instance.field = this.column.field;
        if (filterState?.filterMenuValue) {
            componentRef.instance.value = filterState.filterMenuValue;
        }
        componentRef.changeDetectorRef.detectChanges();
        componentRef.instance.apply.pipe().subscribe(filter => {
            const filterState = {
                filter,
                filterMenuValue: componentRef.instance.value
            };
            this.popupRef?.close();
            this.apply.emit(filterState);
        });
    }
    setSubscriptions() {
        this.gridService.filterLoad$.pipe(takeUntil(this.#destroy)).subscribe(() => {
            this.cdr.detectChanges();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterMenuComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: PopupService }, { token: i0.ElementRef }, { token: GridService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridFilterMenuComponent, selector: "mona-grid-filter-menu", inputs: { column: "column", type: "type" }, outputs: { apply: "apply" }, ngImport: i0, template: "<button monaButton [flat]=\"true\" (click)=\"openPopup()\" [ngClass]=\"{'mona-grid-filtered': column.filtered}\">\n    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n</button>\n", styles: ["button.mona-grid-filtered{color:var(--mona-primary)}button fa-icon{font-size:12px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid-filter-menu", changeDetection: ChangeDetectionStrategy.OnPush, template: "<button monaButton [flat]=\"true\" (click)=\"openPopup()\" [ngClass]=\"{'mona-grid-filtered': column.filtered}\">\n    <fa-icon [icon]=\"filterIcon\"></fa-icon>\n</button>\n", styles: ["button.mona-grid-filtered{color:var(--mona-primary)}button fa-icon{font-size:12px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: PopupService }, { type: i0.ElementRef }, { type: GridService }]; }, propDecorators: { column: [{
                type: Input
            }], apply: [{
                type: Output
            }], type: [{
                type: Input
            }] } });

class GridFilterPipe {
    constructor() { }
    transform(value, filterStateDict, sortStateDict) {
        let queryEnumerable = Query.from(value);
        if (filterStateDict.length > 0) {
            for (const filterState of filterStateDict) {
                if (filterState.value.filter) {
                    queryEnumerable = queryEnumerable.filter(filterState.value.filter, r => r.data);
                }
            }
        }
        if (sortStateDict.length > 0) {
            queryEnumerable = queryEnumerable.sort(sortStateDict
                .values()
                .select(d => d.sort)
                .toArray(), r => r.data);
        }
        return queryEnumerable.run();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridFilterPipe, name: "gridFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridFilterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "gridFilter"
                }]
        }], ctorParameters: function () { return []; } });

class GridPagePipe {
    transform(value, skip, take) {
        if (!value) {
            return [];
        }
        if (value.length === 0) {
            return value;
        }
        if (skip >= value.length) {
            return [];
        }
        return Enumerable.from(value).skip(skip).take(take).toArray();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridPagePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridPagePipe, name: "gridPage" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridPagePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: "gridPage"
                }]
        }] });

class GridComponent {
    #destroy$;
    #filter;
    #sort;
    set data(value) {
        this.gridService.setRows(value);
    }
    set filter(value) {
        if (this.#filter !== value) {
            this.#filter = value;
            this.gridService.loadFilters(value);
        }
    }
    get filter() {
        return this.#filter;
    }
    set gridHeaderElement(value) {
        this.gridService.gridHeaderElement = value.nativeElement;
        window.setTimeout(() => this.setInitialCalculatedWidthOfColumns());
    }
    set pageSize(value) {
        this.gridService.pageState.take = value;
    }
    set sort(value) {
        if (this.#sort !== value) {
            this.#sort = value;
            this.gridService.loadSorts(value);
        }
    }
    get sort() {
        return this.#sort;
    }
    set sortable(options) {
        if (typeof options === "boolean") {
            this.gridService.setSortableOptions({ enabled: true });
        }
        else {
            this.gridService.setSortableOptions(options);
        }
    }
    constructor(gridService, cdr, elementRef) {
        this.gridService = gridService;
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.#destroy$ = new Subject();
        this.#filter = [];
        this.#sort = [];
        this.ascendingSortIcon = faArrowUpLong;
        this.descendingSortIcon = faArrowDownLong;
        this.columnDragging = false;
        this.gridColumns = [];
        this.groupPanelPlaceholderVisible = true;
        this.resizing = false;
        this.cellEdit = new EventEmitter();
        this.columns = new QueryList();
        this.filterable = false;
        this.filterChange = new EventEmitter();
        this.groupable = false;
        this.pageSizeValues = [];
        this.reorderable = false;
        this.resizable = false;
        this.sortChange = new EventEmitter();
    }
    ngAfterContentInit() {
        const processColumns = () => {
            this.gridColumns = this.columns.map(c => c.column);
            this.gridService.columns = this.gridColumns;
            this.gridService.columns.forEach((c, i) => (c.index = i));
            if (this.filter.length !== 0) {
                this.gridService.loadFilters(this.filter);
            }
            if (this.sort.length !== 0) {
                this.gridService.loadSorts(this.sort);
            }
        };
        processColumns();
        this.columns.changes.pipe(takeUntil(this.#destroy$)).subscribe(() => {
            processColumns();
        });
    }
    ngAfterViewInit() {
        this.cdr.detectChanges();
    }
    ngOnChanges(changes) { }
    ngOnDestroy() {
        this.#destroy$.next();
        this.#destroy$.complete();
    }
    ngOnInit() {
        this.setSubscriptions();
    }
    onColumnDragEnter(event, column) {
        this.groupPanelPlaceholderVisible = event.container !== this.groupColumnList;
    }
    onColumnDragStart(event) {
        if (this.resizing) {
            return;
        }
        this.columnDragging = true;
        this.dragColumn = event.source.data;
    }
    onColumnDrop(event) {
        if (!this.dropColumn || !this.dragColumn || !this.columnDragging || this.resizing || !this.reorderable) {
            return;
        }
        const dropColumnIndex = this.gridService.columns.findIndex(c => c.field === this.dropColumn?.field);
        const dragColumnIndex = this.gridService.columns.findIndex(c => c.field === this.dragColumn?.field);
        this.gridService.columns.splice(dropColumnIndex, 0, this.gridService.columns.splice(dragColumnIndex, 1)[0]);
        this.gridService.columns.forEach((c, i) => (c.index = i));
        this.gridService.columns = [...this.gridService.columns];
        this.columnDragging = false;
        this.dragColumn = undefined;
        this.dropColumn = undefined;
    }
    onColumnDropForGrouping(event) {
        if (!this.groupable) {
            return;
        }
        const column = event.item.data;
        this.gridService.groupColumns = [...this.gridService.groupColumns, column];
        if (!this.gridService.appliedSorts.containsKey(column.field)) {
            this.onColumnSort(column);
        }
        this.columnDragging = false;
        this.dragColumn = undefined;
        this.dropColumn = undefined;
    }
    onColumnFilter(column, state) {
        if (state.filter && state.filter.filters.length > 0) {
            this.gridService.appliedFilters.put(column.field, state);
            column.filtered = true;
        }
        else {
            this.gridService.appliedFilters.remove(column.field);
            column.filtered = false;
        }
        this.gridService.appliedFilters = this.gridService.appliedFilters.toDictionary(p => p.key, p => p.value);
        const allFilters = this.gridService.appliedFilters
            .values()
            .select(p => p.filter)
            .where(f => f != null);
        if (allFilters.any()) {
            this.#filter = allFilters.toArray();
        }
        else {
            this.#filter = [];
        }
        this.filterChange.emit(this.#filter);
    }
    onColumnMouseEnter(event, column) {
        if (!this.columnDragging || this.resizing) {
            return;
        }
        this.dropColumn = column;
    }
    onColumnSort(column) {
        if (!this.gridService.sortableOptions.enabled) {
            return;
        }
        if (column.sortDirection == null) {
            column.sortDirection = "asc";
        }
        else if (column.sortDirection === "asc") {
            column.sortDirection = "desc";
        }
        else {
            if (this.gridService.groupColumns.map(c => c.field).includes(column.field)) {
                column.sortDirection = "asc";
            }
            else {
                if (this.gridService.sortableOptions.allowUnsort) {
                    column.sortDirection = undefined;
                    column.sortIndex = undefined;
                }
                else {
                    column.sortDirection = "asc";
                }
            }
        }
        this.applyColumnSort(column, column.sortDirection);
        this.#sort = this.gridService.appliedSorts
            .values()
            .select(s => s.sort)
            .toArray();
        this.sortChange.emit(this.#sort);
    }
    onGroupingColumnRemove(event, column) {
        event.stopPropagation();
        this.gridService.groupColumns = this.gridService.groupColumns.filter(c => c.field !== column.field);
        this.gridService.gridGroupExpandState = this.gridService.gridGroupExpandState
            .where(p => !p.key.startsWith(column.field))
            .toDictionary(p => p.key, p => p.value);
        this.applyColumnSort(column, undefined);
        this.groupPanelPlaceholderVisible = this.gridService.groupColumns.length === 0;
    }
    onPageChange(event) {
        this.gridService.pageState = {
            page: event.page,
            skip: event.skip,
            take: event.take
        };
        const scrollableElement = this.elementRef.nativeElement.querySelector("div.mona-grid-list");
        if (scrollableElement) {
            scrollableElement.scrollTop = 0;
        }
        this.cdr.detectChanges();
    }
    onPageSizeChange(data) {
        this.gridService.pageState = {
            page: 1,
            skip: 0,
            take: data.newPageSize
        };
        this.cdr.detectChanges();
    }
    applyColumnSort(column, sortDirection) {
        column.sortDirection = sortDirection;
        if (this.gridService.sortableOptions.mode === "single") {
            Enumerable.from(this.gridService.columns)
                .where(c => c.field !== column.field)
                .forEach(c => {
                c.sortDirection = undefined;
                c.sortIndex = undefined;
                this.gridService.appliedSorts.remove(c.field);
            });
        }
        if (column.sortDirection != null) {
            const sortDescriptor = {
                field: column.field,
                dir: column.sortDirection
            };
            this.gridService.appliedSorts.put(column.field, { sort: sortDescriptor });
        }
        else {
            this.gridService.appliedSorts.remove(column.field);
            column.sortIndex = undefined;
        }
        this.gridService.appliedSorts.keys().forEach((field, fx) => {
            const col = this.gridService.columns.find(c => c.field === field);
            if (col) {
                col.sortIndex = fx + 1;
            }
        });
        this.gridService.appliedSorts = this.gridService.appliedSorts.toDictionary(p => p.key, p => p.value);
    }
    setInitialCalculatedWidthOfColumns() {
        if (this.gridService.gridHeaderElement) {
            const thList = this.gridService.gridHeaderElement?.querySelectorAll("th");
            for (const [cx, column] of Array.from(thList).entries()) {
                this.gridService.columns[cx].calculatedWidth = column.offsetWidth;
            }
        }
    }
    setSubscriptions() {
        this.gridService.cellEdit$
            .pipe(takeUntil(this.#destroy$))
            .subscribe((event) => this.cellEdit.emit(event));
    }
    get headerMargin() {
        const rightMargin = 12;
        return `0 ${rightMargin}px 0 0`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridComponent, deps: [{ token: GridService }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: GridComponent, selector: "mona-grid", inputs: { data: "data", filter: "filter", groupable: "groupable", pageSize: "pageSize", pageSizeValues: "pageSizeValues", reorderable: "reorderable", resizable: "resizable", sort: "sort", sortable: "sortable" }, outputs: { cellEdit: "cellEdit", filterChange: "filterChange", sortChange: "sortChange" }, providers: [GridService], queries: [{ propertyName: "columns", predicate: GridColumnComponent }], viewQueries: [{ propertyName: "gridHeaderElement", first: true, predicate: ["gridHeaderElement"], descendants: true }, { propertyName: "groupColumnList", first: true, predicate: ["groupColumnList"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-grid\">\n    <div class=\"mona-grid-group-panel\" cdkDropList #groupColumnList=\"cdkDropList\" cdkDropListOrientation=\"horizontal\"\n         (cdkDropListDropped)=\"onColumnDropForGrouping($event)\" *ngIf=\"groupable\">\n        <ng-container *ngIf=\"gridService.groupColumns.length !== 0; else noGroupColumnsTemplate;\">\n            <mona-chip *ngFor=\"let groupColumn of gridService.groupColumns\" [removable]=\"true\" (remove)=\"onGroupingColumnRemove($event, groupColumn)\">\n                <span>{{groupColumn.title}}</span>\n            </mona-chip>\n        </ng-container>\n        <ng-template #noGroupColumnsTemplate>\n            <span class=\"mona-grid-group-panel-placeholder\" *ngIf=\"groupPanelPlaceholderVisible\">Drag a column header here to group</span>\n        </ng-template>\n    </div>\n    <div class=\"mona-grid-header\" [ngStyle]=\"{'margin': headerMargin}\" #gridHeaderElement>\n        <div class=\"mona-grid-header-wrap\">\n            <table>\n                <colgroup>\n                    <col *ngFor=\"let _ of gridService.groupColumns\" style=\"width: 34px;\">\n                    <col *ngFor=\"let column of gridService.columns\" [style.width.px]=\"column.calculatedWidth\" [style.min-width.px]=\"column.minWidth\">\n                </colgroup>\n                <thead>\n                    <tr cdkDropList [cdkDropListConnectedTo]=\"groupable ? [groupColumnList!] : []\" (cdkDropListDropped)=\"onColumnDrop($event)\">\n                        <td *ngFor=\"let _ of gridService.groupColumns\"></td>\n                        <th *ngFor=\"let column of gridService.columns\" cdkDrag [cdkDragData]=\"column\" [cdkDragDisabled]=\"!reorderable && !groupable\"\n                            (mousemove)=\"onColumnMouseEnter($event, column)\" (cdkDragEntered)=\"onColumnDragEnter($event, column)\"\n                            (cdkDragStarted)=\"onColumnDragStart($event)\">\n                            <div class=\"mona-grid-column-wrap\">\n                                <span class=\"mona-grid-column-title\" (click)=\"onColumnSort(column)\">{{column.title}}</span>\n                                <div class=\"mona-grid-column-actions\">\n                                    <span *ngIf=\"gridService.sortableOptions.showIndices && column.sortIndex != null\">{{column.sortIndex}}</span>\n                                    <fa-icon [icon]=\"ascendingSortIcon\" *ngIf=\"column.sortDirection==='asc'\"></fa-icon>\n                                    <fa-icon [icon]=\"descendingSortIcon\" *ngIf=\"column.sortDirection==='desc'\"></fa-icon>\n                                    <mona-grid-filter-menu [column]=\"column\" [type]=\"column.filterType\" (apply)=\"onColumnFilter(column, $event)\"\n                                                           *ngIf=\"filterable\"></mona-grid-filter-menu>\n                                </div>\n                            </div>\n                            <span class=\"mona-grid-column-drop-hint\" *ngIf=\"dropColumn === column && dragColumn && reorderable\"\n                                  [ngStyle]=\"{'right': dragColumn.index < dropColumn.index ? '-1px': null, 'left': dragColumn.index > dropColumn.index ? '-1px': null}\"></span>\n                            <div monaGridColumnResizeHandler [column]=\"column\" class=\"mona-grid-column-resizer\" *ngIf=\"resizable && !columnDragging\"\n                                 (resizeStart)=\"resizing=true;\" (resizeEnd)=\"resizing=false;\"></div>\n                            <ng-template cdkDragPreview>\n                                <div class=\"mona-grid-column-drag-preview\">\n                                    <span class=\"mona-grid-column-title\">{{column.title}}</span>\n                                </div>\n                            </ng-template>\n                        </th>\n                    </tr>\n                </thead>\n            </table>\n        </div>\n    </div>\n    <ng-container *ngIf=\"(gridService.rows|gridFilter:gridService.appliedFilters:gridService.appliedSorts) as filteredData\">\n        <ng-container *ngIf=\"filteredData|gridPage:gridService.pageState.skip:gridService.pageState.take as viewData\">\n            <mona-grid-list [columns]=\"gridService.columns\" [data]=\"viewData\"></mona-grid-list>\n            <mona-pager [skip]=\"gridService.pageState.skip\" [pageSize]=\"gridService.pageState.take\" [total]=\"filteredData.length\"\n                        [pageInput]=\"true\" [pageSizeValues]=\"pageSizeValues\" (pageSizeChange)=\"onPageSizeChange($event)\"\n                        (pageChange)=\"onPageChange($event)\"></mona-pager>\n        </ng-container>\n    </ng-container>\n</div>\n", styles: [":host{position:relative;display:block;overflow:hidden}div.mona-grid{height:100%;display:flex;flex-direction:column;background:var(--mona-background-dark);border:1px solid var(--mona-border-color)}.mona-grid-group-panel{display:flex;align-items:center;padding:5px;height:40px;border-bottom:1px solid var(--mona-border-color)}.mona-grid-group-panel mona-chip{margin-right:5px}.mona-grid-group-panel-placeholder{opacity:.7}.mona-grid-header{background-color:var(--mona-background-dark);border-right:1px solid var(--mona-border-color);overflow:hidden;display:flex;flex-direction:row;flex:0 0 auto}.mona-grid-header table{border-collapse:collapse;table-layout:fixed;width:100%}.mona-grid-header table tr{position:relative}.mona-grid-header table th{white-space:nowrap;text-overflow:ellipsis;text-align:left;position:relative;-webkit-user-select:none;user-select:none}.mona-grid-header table th:not(:last-child){border-right:1px solid var(--mona-border-color)}mona-grid-list{border-top:1px solid var(--mona-border-color)}div.mona-grid-column-resizer{position:absolute;top:0;bottom:0;width:10px;background-color:transparent;cursor:col-resize;z-index:1;right:-5px}div.mona-grid-column-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;cursor:pointer}span.mona-grid-column-title{flex:1;padding:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:700}div.mona-grid-column-actions{display:flex;align-items:center;justify-content:center;padding:0 4px}span.mona-grid-column-drop-hint{position:absolute;display:flex;width:2px;height:100%;background:var(--mona-primary);z-index:1;top:0;bottom:0}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "component", type: PagerComponent, selector: "mona-pager", inputs: ["firstLast", "pageInput", "pageSize", "previousNext", "pageSizeValues", "skip", "total", "type", "visiblePages"], outputs: ["pageChange", "pageSizeChange"] }, { kind: "directive", type: i5$2.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i5$2.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "directive", type: i5$2.CdkDragPreview, selector: "ng-template[cdkDragPreview]", inputs: ["data", "matchSize"] }, { kind: "component", type: ChipComponent, selector: "mona-chip", inputs: ["disabled", "label", "removable", "tabindex"], outputs: ["remove"] }, { kind: "component", type: GridListComponent, selector: "mona-grid-list", inputs: ["columns", "data"] }, { kind: "directive", type: GridColumnResizeHandlerDirective, selector: "[monaGridColumnResizeHandler]", inputs: ["column"], outputs: ["resizeEnd", "resizeStart"] }, { kind: "component", type: GridFilterMenuComponent, selector: "mona-grid-filter-menu", inputs: ["column", "type"], outputs: ["apply"] }, { kind: "pipe", type: GridFilterPipe, name: "gridFilter" }, { kind: "pipe", type: GridPagePipe, name: "gridPage" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-grid", changeDetection: ChangeDetectionStrategy.OnPush, providers: [GridService], template: "<div class=\"mona-grid\">\n    <div class=\"mona-grid-group-panel\" cdkDropList #groupColumnList=\"cdkDropList\" cdkDropListOrientation=\"horizontal\"\n         (cdkDropListDropped)=\"onColumnDropForGrouping($event)\" *ngIf=\"groupable\">\n        <ng-container *ngIf=\"gridService.groupColumns.length !== 0; else noGroupColumnsTemplate;\">\n            <mona-chip *ngFor=\"let groupColumn of gridService.groupColumns\" [removable]=\"true\" (remove)=\"onGroupingColumnRemove($event, groupColumn)\">\n                <span>{{groupColumn.title}}</span>\n            </mona-chip>\n        </ng-container>\n        <ng-template #noGroupColumnsTemplate>\n            <span class=\"mona-grid-group-panel-placeholder\" *ngIf=\"groupPanelPlaceholderVisible\">Drag a column header here to group</span>\n        </ng-template>\n    </div>\n    <div class=\"mona-grid-header\" [ngStyle]=\"{'margin': headerMargin}\" #gridHeaderElement>\n        <div class=\"mona-grid-header-wrap\">\n            <table>\n                <colgroup>\n                    <col *ngFor=\"let _ of gridService.groupColumns\" style=\"width: 34px;\">\n                    <col *ngFor=\"let column of gridService.columns\" [style.width.px]=\"column.calculatedWidth\" [style.min-width.px]=\"column.minWidth\">\n                </colgroup>\n                <thead>\n                    <tr cdkDropList [cdkDropListConnectedTo]=\"groupable ? [groupColumnList!] : []\" (cdkDropListDropped)=\"onColumnDrop($event)\">\n                        <td *ngFor=\"let _ of gridService.groupColumns\"></td>\n                        <th *ngFor=\"let column of gridService.columns\" cdkDrag [cdkDragData]=\"column\" [cdkDragDisabled]=\"!reorderable && !groupable\"\n                            (mousemove)=\"onColumnMouseEnter($event, column)\" (cdkDragEntered)=\"onColumnDragEnter($event, column)\"\n                            (cdkDragStarted)=\"onColumnDragStart($event)\">\n                            <div class=\"mona-grid-column-wrap\">\n                                <span class=\"mona-grid-column-title\" (click)=\"onColumnSort(column)\">{{column.title}}</span>\n                                <div class=\"mona-grid-column-actions\">\n                                    <span *ngIf=\"gridService.sortableOptions.showIndices && column.sortIndex != null\">{{column.sortIndex}}</span>\n                                    <fa-icon [icon]=\"ascendingSortIcon\" *ngIf=\"column.sortDirection==='asc'\"></fa-icon>\n                                    <fa-icon [icon]=\"descendingSortIcon\" *ngIf=\"column.sortDirection==='desc'\"></fa-icon>\n                                    <mona-grid-filter-menu [column]=\"column\" [type]=\"column.filterType\" (apply)=\"onColumnFilter(column, $event)\"\n                                                           *ngIf=\"filterable\"></mona-grid-filter-menu>\n                                </div>\n                            </div>\n                            <span class=\"mona-grid-column-drop-hint\" *ngIf=\"dropColumn === column && dragColumn && reorderable\"\n                                  [ngStyle]=\"{'right': dragColumn.index < dropColumn.index ? '-1px': null, 'left': dragColumn.index > dropColumn.index ? '-1px': null}\"></span>\n                            <div monaGridColumnResizeHandler [column]=\"column\" class=\"mona-grid-column-resizer\" *ngIf=\"resizable && !columnDragging\"\n                                 (resizeStart)=\"resizing=true;\" (resizeEnd)=\"resizing=false;\"></div>\n                            <ng-template cdkDragPreview>\n                                <div class=\"mona-grid-column-drag-preview\">\n                                    <span class=\"mona-grid-column-title\">{{column.title}}</span>\n                                </div>\n                            </ng-template>\n                        </th>\n                    </tr>\n                </thead>\n            </table>\n        </div>\n    </div>\n    <ng-container *ngIf=\"(gridService.rows|gridFilter:gridService.appliedFilters:gridService.appliedSorts) as filteredData\">\n        <ng-container *ngIf=\"filteredData|gridPage:gridService.pageState.skip:gridService.pageState.take as viewData\">\n            <mona-grid-list [columns]=\"gridService.columns\" [data]=\"viewData\"></mona-grid-list>\n            <mona-pager [skip]=\"gridService.pageState.skip\" [pageSize]=\"gridService.pageState.take\" [total]=\"filteredData.length\"\n                        [pageInput]=\"true\" [pageSizeValues]=\"pageSizeValues\" (pageSizeChange)=\"onPageSizeChange($event)\"\n                        (pageChange)=\"onPageChange($event)\"></mona-pager>\n        </ng-container>\n    </ng-container>\n</div>\n", styles: [":host{position:relative;display:block;overflow:hidden}div.mona-grid{height:100%;display:flex;flex-direction:column;background:var(--mona-background-dark);border:1px solid var(--mona-border-color)}.mona-grid-group-panel{display:flex;align-items:center;padding:5px;height:40px;border-bottom:1px solid var(--mona-border-color)}.mona-grid-group-panel mona-chip{margin-right:5px}.mona-grid-group-panel-placeholder{opacity:.7}.mona-grid-header{background-color:var(--mona-background-dark);border-right:1px solid var(--mona-border-color);overflow:hidden;display:flex;flex-direction:row;flex:0 0 auto}.mona-grid-header table{border-collapse:collapse;table-layout:fixed;width:100%}.mona-grid-header table tr{position:relative}.mona-grid-header table th{white-space:nowrap;text-overflow:ellipsis;text-align:left;position:relative;-webkit-user-select:none;user-select:none}.mona-grid-header table th:not(:last-child){border-right:1px solid var(--mona-border-color)}mona-grid-list{border-top:1px solid var(--mona-border-color)}div.mona-grid-column-resizer{position:absolute;top:0;bottom:0;width:10px;background-color:transparent;cursor:col-resize;z-index:1;right:-5px}div.mona-grid-column-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;cursor:pointer}span.mona-grid-column-title{flex:1;padding:10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:700}div.mona-grid-column-actions{display:flex;align-items:center;justify-content:center;padding:0 4px}span.mona-grid-column-drop-hint{position:absolute;display:flex;width:2px;height:100%;background:var(--mona-primary);z-index:1;top:0;bottom:0}\n"] }]
        }], ctorParameters: function () { return [{ type: GridService }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { cellEdit: [{
                type: Output
            }], columns: [{
                type: ContentChildren,
                args: [GridColumnComponent]
            }], data: [{
                type: Input
            }], filter: [{
                type: Input
            }], filterChange: [{
                type: Output
            }], gridHeaderElement: [{
                type: ViewChild,
                args: ["gridHeaderElement"]
            }], groupColumnList: [{
                type: ViewChild,
                args: ["groupColumnList"]
            }], groupable: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeValues: [{
                type: Input
            }], reorderable: [{
                type: Input
            }], resizable: [{
                type: Input
            }], sort: [{
                type: Input
            }], sortChange: [{
                type: Output
            }], sortable: [{
                type: Input
            }] } });

class GridSelectableDirective {
    #destroy$;
    set selectedKeys(selectedKeys) {
        this.gridService.selectedKeys.clear();
        this.gridService.selectedKeys.addAll(selectedKeys);
    }
    set selectionKey(selectionKey) {
        this.gridService.selectionKeyField = selectionKey;
    }
    constructor(grid, gridService) {
        this.grid = grid;
        this.gridService = gridService;
        this.#destroy$ = new Subject();
        this.selectedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.gridService.loadSelectedKeys(this.gridService.selectedKeys);
        }
    }
    ngOnDestroy() {
        this.#destroy$.next();
        this.#destroy$.complete();
    }
    ngOnInit() {
        this.gridService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.gridService.setSelectableOptions(this.options);
        }
        else if (this.options === "") {
            this.gridService.setSelectableOptions({ enabled: true });
        }
        this.gridService.loadSelectedKeys(this.gridService.selectedKeys);
        this.setSubscriptions();
    }
    setSubscriptions() {
        this.gridService.selectedRowsChange$.pipe(takeUntil(this.#destroy$)).subscribe(selectedRows => {
            const selectedKeys = selectedRows.map(r => this.gridService.selectionKeyField ? r.data[this.gridService.selectionKeyField] : r.data);
            this.gridService.selectedKeys.clear();
            this.gridService.selectedKeys.addAll(selectedKeys);
            this.gridService.selectedKeysChange.next(selectedKeys);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridSelectableDirective, deps: [{ token: GridComponent }, { token: GridService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: GridSelectableDirective, selector: "mona-grid[monaGridSelectable]", inputs: { selectedKeys: "selectedKeys", selectionKey: "selectionKey", options: ["monaGridSelectable", "options"] }, outputs: { selectedKeysChange: "selectedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridSelectableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-grid[monaGridSelectable]"
                }]
        }], ctorParameters: function () { return [{ type: GridComponent }, { type: GridService }]; }, propDecorators: { selectedKeys: [{
                type: Input
            }], selectedKeysChange: [{
                type: Output
            }], selectionKey: [{
                type: Input
            }], options: [{
                type: Input,
                args: ["monaGridSelectable"]
            }] } });

class PagerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, declarations: [PagerComponent], imports: [CommonModule, ButtonModule, SlicePipe, FontAwesomeModule, NumericTextBoxModule, DropDownListModule], exports: [PagerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, imports: [CommonModule, ButtonModule, FontAwesomeModule, NumericTextBoxModule, DropDownListModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: PagerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [PagerComponent],
                    imports: [CommonModule, ButtonModule, SlicePipe, FontAwesomeModule, NumericTextBoxModule, DropDownListModule],
                    exports: [PagerComponent]
                }]
        }] });

class CheckBoxModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CheckBoxModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: CheckBoxModule, declarations: [CheckBoxDirective], exports: [CheckBoxDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CheckBoxModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CheckBoxModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CheckBoxDirective],
                    exports: [CheckBoxDirective]
                }]
        }] });

class GridModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: GridModule, declarations: [GridComponent,
            GridListComponent,
            GridColumnResizeHandlerDirective,
            GridFilterMenuComponent,
            GridFilterPipe,
            GridPagePipe,
            GridColumnComponent,
            GridCellTemplateDirective,
            GridGroupPipe,
            GridSelectableDirective,
            GridCellComponent,
            GridEditableDirective], imports: [CommonModule,
            ButtonModule,
            FontAwesomeModule,
            PagerModule,
            SlicePipe,
            DragDropModule,
            ChipModule,
            TextBoxModule,
            ReactiveFormsModule,
            NumericTextBoxModule,
            A11yModule,
            DatePickerModule,
            CheckBoxModule], exports: [GridComponent,
            GridColumnComponent,
            GridCellTemplateDirective,
            GridEditableDirective,
            GridSelectableDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridModule, imports: [CommonModule,
            ButtonModule,
            FontAwesomeModule,
            PagerModule,
            DragDropModule,
            ChipModule,
            TextBoxModule,
            ReactiveFormsModule,
            NumericTextBoxModule,
            A11yModule,
            DatePickerModule,
            CheckBoxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: GridModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        GridComponent,
                        GridListComponent,
                        GridColumnResizeHandlerDirective,
                        GridFilterMenuComponent,
                        GridFilterPipe,
                        GridPagePipe,
                        GridColumnComponent,
                        GridCellTemplateDirective,
                        GridGroupPipe,
                        GridSelectableDirective,
                        GridCellComponent,
                        GridEditableDirective
                    ],
                    imports: [
                        CommonModule,
                        ButtonModule,
                        FontAwesomeModule,
                        PagerModule,
                        SlicePipe,
                        DragDropModule,
                        ChipModule,
                        TextBoxModule,
                        ReactiveFormsModule,
                        NumericTextBoxModule,
                        A11yModule,
                        DatePickerModule,
                        CheckBoxModule
                    ],
                    exports: [
                        GridComponent,
                        GridColumnComponent,
                        GridCellTemplateDirective,
                        GridEditableDirective,
                        GridSelectableDirective
                    ]
                }]
        }] });

class ColorPaletteComponent {
    set palette(palette) {
        this.colors = Array.from(palette);
    }
    set value(value) {
        this.selectedColor = value ? this.colors.find(c => c === value) ?? null : null;
    }
    get value() {
        return this.selectedColor;
    }
    constructor() {
        this.propagateChange = null;
        this.colors = [];
        this.selectedColor = null;
        this.columns = 8;
        this.tileSize = 24;
        this.valueChange = new EventEmitter();
    }
    ngOnInit() { }
    onColorSelect(color) {
        if (this.selectedColor === color) {
            this.selectedColor = null;
            this.propagateChange?.(null);
            this.valueChange.emit(null);
            return;
        }
        this.selectedColor = color;
        this.valueChange.emit(color);
        this.propagateChange?.(color);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        this.selectedColor = this.colors.find(c => c === obj) ?? null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ColorPaletteComponent, selector: "mona-color-palette", inputs: { columns: "columns", palette: "palette", tileSize: "tileSize", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ColorPaletteComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"mona-color-palette\" [style.grid-template-columns]=\"'repeat('+columns+', minmax('+tileSize+'px, 1fr))'\"\n     [style.grid-auto-rows]=\"tileSize+'px'\">\n    <ng-container *ngFor=\"let color of colors\">\n        <div class=\"mona-color-cell\" [ngClass]=\"{'mona-selected': color===selectedColor}\"\n             [style.background-color]=\"color\" (click)=\"onColorSelect(color)\"></div>\n    </ng-container>\n</div>\n", styles: ["div.mona-color-palette{display:grid;grid-gap:1px;padding:1px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-color-palette", providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ColorPaletteComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-color-palette\" [style.grid-template-columns]=\"'repeat('+columns+', minmax('+tileSize+'px, 1fr))'\"\n     [style.grid-auto-rows]=\"tileSize+'px'\">\n    <ng-container *ngFor=\"let color of colors\">\n        <div class=\"mona-color-cell\" [ngClass]=\"{'mona-selected': color===selectedColor}\"\n             [style.background-color]=\"color\" (click)=\"onColorSelect(color)\"></div>\n    </ng-container>\n</div>\n", styles: ["div.mona-color-palette{display:grid;grid-gap:1px;padding:1px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { columns: [{
                type: Input
            }], palette: [{
                type: Input
            }], tileSize: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class ColorPaletteModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteModule, declarations: [ColorPaletteComponent], imports: [CommonModule], exports: [ColorPaletteComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPaletteModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ColorPaletteComponent],
                    imports: [CommonModule],
                    exports: [ColorPaletteComponent]
                }]
        }] });

class ColorPickerComponent {
    set value(value) {
        this.color = value;
    }
    get value() {
        return this.color;
    }
    constructor() {
        this.propagateChange = null;
        this.noColorIcon = faTimes;
        this.dropdownIcon = faChevronDown;
        this.color = null;
        this.palette = [];
        this.valueChange = new EventEmitter();
    }
    ngOnInit() { }
    onColorPaletteValueChange(value) {
        this.color = value;
        this.valueChange.emit(value);
        this.propagateChange?.(value);
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        this.color = obj;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ColorPickerComponent, selector: "mona-color-picker", inputs: { palette: "palette", value: "value" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ColorPickerComponent),
                multi: true
            }
        ], ngImport: i0, template: "<div class=\"mona-color-picker mona-input-selector\" [attr.tabindex]=\"0\" #colorPickerAnchor>\n    <div [style.background]=\"value\" class=\"mona-input-selector-value\">\n        <fa-icon [icon]=\"noColorIcon\" *ngIf=\"!value\"></fa-icon>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<mona-popup [anchor]=\"colorPickerAnchor\" popupClass=\"mona-color-picker-popup\" width=\"auto\">\n    <ng-template>\n        <mona-color-palette [palette]=\"palette\" [columns]=\"8\" [value]=\"color\"\n                            (valueChange)=\"onColorPaletteValueChange($event)\"></mona-color-palette>\n    </ng-template>\n</mona-popup>\n", styles: [".mona-color-picker{height:var(--mona-input-height);display:flex;align-items:center}.mona-color-picker>div{display:flex;align-items:center;justify-content:center}.mona-color-picker>div:first-child{display:flex;width:calc(var(--mona-input-height) - 8px);height:calc(var(--mona-input-height) - 8px);margin-left:4px}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: PopupComponent, selector: "mona-popup", inputs: ["anchor", "closeOnEscape", "height", "maxHeight", "maxWidth", "minHeight", "minWidth", "offset", "popupClass", "trigger", "width"], outputs: ["close", "open"] }, { kind: "component", type: ColorPaletteComponent, selector: "mona-color-palette", inputs: ["columns", "palette", "tileSize", "value"], outputs: ["valueChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-color-picker", providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ColorPickerComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-color-picker mona-input-selector\" [attr.tabindex]=\"0\" #colorPickerAnchor>\n    <div [style.background]=\"value\" class=\"mona-input-selector-value\">\n        <fa-icon [icon]=\"noColorIcon\" *ngIf=\"!value\"></fa-icon>\n    </div>\n    <div class=\"mona-input-selector-icon\">\n        <fa-icon [icon]=\"dropdownIcon\"></fa-icon>\n    </div>\n</div>\n\n<mona-popup [anchor]=\"colorPickerAnchor\" popupClass=\"mona-color-picker-popup\" width=\"auto\">\n    <ng-template>\n        <mona-color-palette [palette]=\"palette\" [columns]=\"8\" [value]=\"color\"\n                            (valueChange)=\"onColorPaletteValueChange($event)\"></mona-color-palette>\n    </ng-template>\n</mona-popup>\n", styles: [".mona-color-picker{height:var(--mona-input-height);display:flex;align-items:center}.mona-color-picker>div{display:flex;align-items:center;justify-content:center}.mona-color-picker>div:first-child{display:flex;width:calc(var(--mona-input-height) - 8px);height:calc(var(--mona-input-height) - 8px);margin-left:4px}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { palette: [{
                type: Input
            }], value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class ColorPickerModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, declarations: [ColorPickerComponent], imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule], exports: [ColorPickerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ColorPickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ColorPickerComponent],
                    imports: [CommonModule, PopupModule, ColorPaletteModule, FontAwesomeModule],
                    exports: [ColorPickerComponent]
                }]
        }] });

class RadioButtonDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: RadioButtonDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: RadioButtonDirective, selector: "input[type='radio'][monaRadioButton]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: RadioButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "input[type='radio'][monaRadioButton]"
                }]
        }], ctorParameters: function () { return []; } });

class RadioButtonModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: RadioButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: RadioButtonModule, declarations: [RadioButtonDirective], exports: [RadioButtonDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: RadioButtonModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: RadioButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RadioButtonDirective],
                    exports: [RadioButtonDirective]
                }]
        }] });

class SliderTickValueTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderTickValueTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: SliderTickValueTemplateDirective, selector: "ng-template[monaSliderTickValueTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderTickValueTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaSliderTickValueTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class AbstractSliderComponent {
    constructor(elementRef, renderer, cdr, zone) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.cdr = cdr;
        this.zone = zone;
        this.componentDestroy$ = new Subject();
        this.documentMouseMoveListener = null;
        this.previousUserSelect = "";
        this.activeHandlerType = null;
        this.dragging = false;
        this.handlerOnePosition = 0;
        this.handlerTwoPosition = 0;
        this.handlerValues = [0, 0];
        this.initialized = false;
        this.ticks = [];
        this.trackData = { position: 0, size: 0 };
        this.labelPosition = "after";
        this.labelStep = 1;
        this.max = 10;
        this.min = 0;
        this.orientation = "horizontal";
        this.showTicks = true;
        this.step = 1;
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.setSliderValue(this.handlerValues[0], "primary");
            if (this.ranged) {
                this.setSliderValue(this.handlerValues[1], "secondary");
            }
            this.calculateTrackData();
            this.cdr.detectChanges();
        });
        timer(1000)
            .pipe(take(1))
            .subscribe(() => (this.initialized = true));
    }
    ngOnChanges(changes) {
        const valueChange = changes["value"];
        if (valueChange && !valueChange?.isFirstChange()) {
            let value = this.ranged
                ? valueChange.currentValue
                : valueChange.currentValue;
            if (value != null) {
                if (this.ranged) {
                    value = value;
                    this.setSliderValue(value[0], "primary");
                    this.setSliderValue(value[1], "secondary");
                }
                else {
                    value = value;
                    this.setSliderValue(value, "primary");
                }
            }
        }
    }
    ngOnDestroy() {
        this.documentMouseMoveListener?.();
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.prepareTicks();
        if (this.value == null) {
            return;
        }
    }
    onHandlerKeyDown(event, handlerType) {
        const valueIndex = handlerType === "primary" ? 0 : 1;
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            this.setSliderValue(Math.max(this.minValue, this.handlerValues[valueIndex] - this.step), handlerType);
            this.emitValues();
        }
        else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            this.setSliderValue(Math.min(this.maxValue, this.handlerValues[valueIndex] + this.step), handlerType);
            this.emitValues();
        }
        else if (event.key === "Home") {
            this.setSliderValue(this.minValue, handlerType);
            this.emitValues();
        }
        else if (event.key === "End") {
            this.setSliderValue(this.maxValue, handlerType);
            this.emitValues();
        }
    }
    onHandlerMouseDown(handlerType) {
        if (this.dragging) {
            return;
        }
        this.activeHandlerType = handlerType;
        this.dragging = true;
        this.previousUserSelect = document.documentElement.style.userSelect;
        document.documentElement.style.userSelect = "none";
        this.setEventListeners();
    }
    onTickClick(event, tickElement) {
        const handlerData = this.getClosestHandlerDataToMouse(event);
        const positionData = this.getHandlerPositionData(tickElement, handlerData.element);
        const value = this.ticks[positionData.tickIndex].value;
        this.setSliderValue(value, handlerData.type);
        this.cdr.detectChanges();
        this.emitValues();
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    writeValue(obj) {
        if (obj != null) {
            this.ensureCorrectValueType(obj);
            if (typeof obj === "number") {
                this.handlerValues = [
                    Math.max(this.minValue, Math.min(this.maxValue, obj)),
                    Math.max(this.minValue, Math.min(this.maxValue, obj))
                ];
                this.setSliderValue(this.handlerValues[0], "primary");
            }
            else {
                this.handlerValues = [
                    Math.max(this.minValue, Math.min(this.maxValue, obj[0])),
                    Math.max(this.minValue, Math.min(this.maxValue, obj[1]))
                ];
                this.setSliderValue(this.handlerValues[0], "primary");
                this.setSliderValue(this.handlerValues[1], "secondary");
            }
        }
    }
    calculateTrackData() {
        if (this.orientation === "horizontal") {
            if (this.ranged) {
                const rectOne = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const rectTwo = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const width = (Math.abs(rectOne.left - rectTwo.left) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                const leftmostRect = rectOne.left < rectTwo.left ? rectOne : rectTwo;
                this.trackData = {
                    position: leftmostRect.left - this.sliderTrackElementRef.nativeElement.getBoundingClientRect().left,
                    size: width
                };
            }
            else {
                this.trackData = {
                    position: 0,
                    size: this.handlerOnePosition <= 0 ? 0 : this.handlerOnePosition
                };
            }
        }
        else {
            if (this.ranged) {
                const rectOne = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const rectTwo = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
                const height = (Math.abs(rectOne.bottom - rectTwo.bottom) * 100.0) /
                    this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                const bottommostRect = rectOne.bottom > rectTwo.bottom ? rectOne : rectTwo;
                this.trackData = {
                    position: this.sliderTrackElementRef.nativeElement.getBoundingClientRect().bottom - bottommostRect.bottom,
                    size: height
                };
            }
            else {
                this.trackData = {
                    position: 0,
                    size: this.handlerOnePosition <= 0 ? 0 : this.handlerOnePosition
                };
            }
        }
    }
    ensureCorrectValueType(value) {
        if (value == null) {
            return;
        }
        if (this.ranged && typeof value === "number") {
            throw new Error("Ranged slider requires an array of values");
        }
        else if (!this.ranged && typeof value !== "number") {
            throw new Error("Non-ranged slider requires a single value");
        }
    }
    findClosestTickElement(event) {
        const elements = Array.from(this.elementRef.nativeElement.querySelectorAll(".mona-slider-tick > span"));
        let maxDistance = Number.MAX_VALUE;
        let index = 0;
        for (const [ex, element] of elements.entries()) {
            const rect = element.getBoundingClientRect();
            const distance = Math.sqrt(Math.pow(rect.left - event.clientX, 2) + Math.pow(rect.top - event.clientY, 2));
            if (distance < maxDistance) {
                maxDistance = distance;
                index = ex;
            }
        }
        return elements[index];
    }
    getClosestHandlerDataToMouse(event) {
        if (!this.ranged) {
            return {
                type: "primary",
                element: this.sliderPrimaryHandlerElementRef.nativeElement
            };
        }
        const primaryHandlerRect = this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect();
        const secondaryHandlerRect = this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect();
        const primaryDistance = Math.sqrt(Math.pow(primaryHandlerRect.left - event.clientX, 2) + Math.pow(primaryHandlerRect.top - event.clientY, 2));
        const secondaryDistance = Math.sqrt(Math.pow(secondaryHandlerRect.left - event.clientX, 2) +
            Math.pow(secondaryHandlerRect.top - event.clientY, 2));
        return primaryDistance < secondaryDistance
            ? {
                element: this.sliderPrimaryHandlerElementRef.nativeElement,
                type: "primary"
            }
            : {
                element: this.sliderSecondaryHandlerElementRef.nativeElement,
                type: "secondary"
            };
    }
    getHandlerPositionData(tickElement, sliderHandlerElement) {
        const rect = tickElement.getBoundingClientRect();
        const containerRect = this.sliderTrackElementRef.nativeElement.getBoundingClientRect();
        const handlerRect = sliderHandlerElement.getBoundingClientRect();
        const parentElement = tickElement.parentNode;
        const tickElements = this.orientation === "horizontal"
            ? Array.from(parentElement?.children ?? [])
            : Array.from(parentElement?.children ?? []).reverse();
        const tickElementIndex = tickElements.indexOf(tickElement);
        const tickIndex = Math.ceil(tickElementIndex / 2);
        let position;
        if (this.orientation === "horizontal") {
            if (tickElementIndex % 2 !== 0) {
                position = ((rect.right - containerRect.left - handlerRect.width / 2) * 100.0) / containerRect.width;
            }
            else {
                const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
                if (siblingRect) {
                    position =
                        ((siblingRect.right - containerRect.left - (2 * handlerRect.width) / 2) * 100.0) /
                            containerRect.width;
                }
                else {
                    position = (((-1 * handlerRect.width) / 2) * 100.0) / containerRect.width;
                }
            }
            return { position, tickIndex };
        }
        else {
            if (tickElementIndex % 2 !== 0) {
                position = ((rect.bottom - containerRect.top - handlerRect.height / 2) * 100.0) / containerRect.height;
            }
            else {
                const siblingRect = tickElement.previousElementSibling?.getBoundingClientRect();
                if (siblingRect) {
                    position =
                        ((siblingRect.bottom - containerRect.top - (2 * handlerRect.height) / 2) * 100.0) /
                            containerRect.height;
                }
                else {
                    position = (((-1 * handlerRect.height) / 2) * 100.0) / containerRect.height;
                }
            }
            return { position, tickIndex };
        }
    }
    prepareTicks() {
        let index = 0;
        let value = this.min;
        while (value < this.max) {
            this.ticks.push({ index, value });
            value += this.step;
            index++;
        }
        this.ticks.push({ index, value: Math.min(value + this.step, this.max) });
    }
    setEventListeners() {
        this.zone.runOutsideAngular(() => {
            this.documentMouseMoveListener = this.renderer.listen(document, "mousemove", (event) => {
                if (!this.dragging) {
                    return;
                }
                const tickElement = this.findClosestTickElement(event);
                const positionData = this.getHandlerPositionData(tickElement.parentElement, this.activeHandlerType === "primary"
                    ? this.sliderPrimaryHandlerElementRef.nativeElement
                    : this.sliderSecondaryHandlerElementRef.nativeElement);
                if (this.activeHandlerType === "primary" && positionData.position !== this.handlerOnePosition) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        if (this.handlerValues[0] !== value) {
                            this.setSliderValue(value, "primary");
                            this.emitValues();
                        }
                    });
                }
                else if (this.activeHandlerType === "secondary" &&
                    positionData.position !== this.handlerTwoPosition) {
                    this.zone.run(() => {
                        const value = this.ticks[positionData.tickIndex].value;
                        if (this.handlerValues[1] !== value) {
                            this.setSliderValue(value, "secondary");
                            this.emitValues();
                        }
                    });
                }
            });
            const sub = fromEvent(document, "mouseup")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe(() => {
                if (!this.dragging) {
                    return;
                }
                this.zone.run(() => {
                    this.dragging = false;
                    if (this.previousUserSelect) {
                        document.documentElement.style.userSelect = this.previousUserSelect;
                    }
                    else {
                        document.documentElement.style.removeProperty("user-select");
                    }
                    this.documentMouseMoveListener?.();
                    sub.unsubscribe();
                });
            });
        });
    }
    setSliderValue(value, handlerType = "primary") {
        const sliderValue = Math.max(this.minValue, Math.min(this.maxValue, value));
        if (this.orientation === "horizontal") {
            if (handlerType === "primary") {
                this.handlerOnePosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                this.handlerValues[0] = sliderValue;
            }
            else {
                this.handlerTwoPosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect().width / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().width;
                this.handlerValues[1] = sliderValue;
            }
        }
        else {
            if (handlerType === "primary") {
                this.handlerOnePosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderPrimaryHandlerElementRef.nativeElement.getBoundingClientRect().height / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                this.handlerValues[0] = sliderValue;
            }
            else {
                this.handlerTwoPosition =
                    ((sliderValue - this.minValue) * 100.0) / (this.maxValue - this.minValue) -
                        ((this.sliderSecondaryHandlerElementRef.nativeElement.getBoundingClientRect().height / 2) * 100.0) /
                            this.sliderTrackElementRef.nativeElement.getBoundingClientRect().height;
                this.handlerValues[1] = sliderValue;
            }
        }
        window.setTimeout(() => {
            this.calculateTrackData();
        });
    }
    get maxValue() {
        return this.ticks[this.ticks.length - 1].value;
    }
    get minValue() {
        return this.ticks[0].value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractSliderComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: AbstractSliderComponent, isStandalone: true, selector: "ng-component", inputs: { labelPosition: "labelPosition", labelStep: "labelStep", max: "max", min: "min", orientation: "orientation", showTicks: "showTicks", step: "step" }, queries: [{ propertyName: "tickValueTemplate", first: true, predicate: SliderTickValueTemplateDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "sliderPrimaryHandlerElementRef", first: true, predicate: ["sliderPrimaryHandlerElement"], descendants: true, read: ElementRef }, { propertyName: "sliderSecondaryHandlerElementRef", first: true, predicate: ["sliderSecondaryHandlerElement"], descendants: true, read: ElementRef }, { propertyName: "sliderTrackElementRef", first: true, predicate: ["sliderTrackElement"], descendants: true, read: ElementRef }, { propertyName: "tickListElementRef", first: true, predicate: ["tickListElement"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n", dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: AbstractSliderComponent, decorators: [{
            type: Component,
            args: [{ standalone: true, imports: [CommonModule], template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { labelPosition: [{
                type: Input
            }], labelStep: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], orientation: [{
                type: Input
            }], showTicks: [{
                type: Input
            }], sliderPrimaryHandlerElementRef: [{
                type: ViewChild,
                args: ["sliderPrimaryHandlerElement", { read: ElementRef }]
            }], sliderSecondaryHandlerElementRef: [{
                type: ViewChild,
                args: ["sliderSecondaryHandlerElement", { read: ElementRef }]
            }], sliderTrackElementRef: [{
                type: ViewChild,
                args: ["sliderTrackElement", { read: ElementRef }]
            }], step: [{
                type: Input
            }], tickListElementRef: [{
                type: ViewChild,
                args: ["tickListElement", { read: ElementRef }]
            }], tickValueTemplate: [{
                type: ContentChild,
                args: [SliderTickValueTemplateDirective, { read: TemplateRef }]
            }] } });

class RangeSliderComponent extends AbstractSliderComponent {
    constructor(elementRef, renderer, cdr, zone) {
        super(elementRef, renderer, cdr, zone);
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.cdr = cdr;
        this.zone = zone;
        this.propagateChange = null;
        this.ranged = true;
        this.value = null;
        this.valueChange = new EventEmitter();
    }
    ngOnInit() {
        super.ngOnInit();
        this.ensureCorrectValueType(this.value);
        if (this.value != null) {
            this.handlerValues = [
                Math.max(this.minValue, Math.min(this.maxValue, this.value[0])),
                Math.max(this.minValue, Math.min(this.maxValue, this.value[1]))
            ];
        }
    }
    emitValues() {
        this.value = [this.handlerValues[0], this.handlerValues[1]];
        this.valueChange.emit(this.value);
        this.propagateChange?.(this.value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: RangeSliderComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: RangeSliderComponent, selector: "mona-range-slider", inputs: { value: "value" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => RangeSliderComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n", styles: ["div.mona-slider{position:relative;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal{height:calc(var(--mona-input-height) * 2);display:flex;align-items:center;cursor:pointer}div.mona-slider.mona-slider-horizontal div.mona-slider-track{height:8px;width:100%;position:relative;z-index:1}div.mona-slider.mona-slider-horizontal .mona-slider-highlight{position:absolute;inset:0;border:none;transition:width ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:left ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);width:100%;height:100%;align-items:center}div.mona-slider.mona-slider-horizontal span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span.mona-dragging{height:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-horizontal span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 11px);display:flex;width:0}div.mona-slider.mona-slider-vertical{width:calc(var(--mona-input-height) * 2);height:100%;display:flex;justify-content:center;cursor:pointer}div.mona-slider.mona-slider-vertical div.mona-slider-track{width:8px;height:100%;position:relative;z-index:1}div.mona-slider.mona-slider-vertical .mona-slider-highlight{position:absolute;left:0;bottom:0;right:0;border:none;transition:height ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:top ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:row;grid-auto-rows:minmax(0,1fr);width:100%;height:100%;justify-content:center}div.mona-slider.mona-slider-vertical span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span.mona-dragging{width:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;flex-direction:column-reverse;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before>span>span{margin-right:10px}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-after>span>span{margin-left:10px}div.mona-slider.mona-slider-vertical span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 11px);display:flex;height:0}div.mona-slider.mona-slider-ranged,div.mona-slider.mona-slider-ranged *{transition:none!important}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: RangeSliderComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-range-slider", providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => RangeSliderComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n", styles: ["div.mona-slider{position:relative;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal{height:calc(var(--mona-input-height) * 2);display:flex;align-items:center;cursor:pointer}div.mona-slider.mona-slider-horizontal div.mona-slider-track{height:8px;width:100%;position:relative;z-index:1}div.mona-slider.mona-slider-horizontal .mona-slider-highlight{position:absolute;inset:0;border:none;transition:width ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:left ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);width:100%;height:100%;align-items:center}div.mona-slider.mona-slider-horizontal span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span.mona-dragging{height:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-horizontal span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 11px);display:flex;width:0}div.mona-slider.mona-slider-vertical{width:calc(var(--mona-input-height) * 2);height:100%;display:flex;justify-content:center;cursor:pointer}div.mona-slider.mona-slider-vertical div.mona-slider-track{width:8px;height:100%;position:relative;z-index:1}div.mona-slider.mona-slider-vertical .mona-slider-highlight{position:absolute;left:0;bottom:0;right:0;border:none;transition:height ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:top ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:row;grid-auto-rows:minmax(0,1fr);width:100%;height:100%;justify-content:center}div.mona-slider.mona-slider-vertical span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span.mona-dragging{width:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;flex-direction:column-reverse;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before>span>span{margin-right:10px}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-after>span>span{margin-left:10px}div.mona-slider.mona-slider-vertical span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 11px);display:flex;height:0}div.mona-slider.mona-slider-ranged,div.mona-slider.mona-slider-ranged *{transition:none!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class SliderComponent extends AbstractSliderComponent {
    constructor(elementRef, renderer, cdr, zone) {
        super(elementRef, renderer, cdr, zone);
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.cdr = cdr;
        this.zone = zone;
        this.propagateChange = null;
        this.ranged = false;
        this.value = null;
        this.valueChange = new EventEmitter();
    }
    ngOnInit() {
        super.ngOnInit();
        this.ensureCorrectValueType(this.value);
        if (this.value != null) {
            this.handlerValues = [
                Math.max(this.minValue, Math.min(this.maxValue, this.value)),
                Math.max(this.minValue, Math.min(this.maxValue, this.value))
            ];
        }
    }
    emitValues() {
        this.value = this.handlerValues[0];
        this.valueChange.emit(this.value);
        this.propagateChange?.(this.value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderComponent, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: SliderComponent, selector: "mona-slider", inputs: { value: "value" }, outputs: { valueChange: "valueChange" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => SliderComponent),
                multi: true
            }
        ], usesInheritance: true, ngImport: i0, template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n", styles: ["div.mona-slider{position:relative;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal{height:calc(var(--mona-input-height) * 2);display:flex;align-items:center;cursor:pointer}div.mona-slider.mona-slider-horizontal div.mona-slider-track{height:8px;width:100%;position:relative;z-index:1}div.mona-slider.mona-slider-horizontal .mona-slider-highlight{position:absolute;inset:0;border:none;transition:width ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:left ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);width:100%;height:100%;align-items:center}div.mona-slider.mona-slider-horizontal span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span.mona-dragging{height:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-horizontal span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 11px);display:flex;width:0}div.mona-slider.mona-slider-vertical{width:calc(var(--mona-input-height) * 2);height:100%;display:flex;justify-content:center;cursor:pointer}div.mona-slider.mona-slider-vertical div.mona-slider-track{width:8px;height:100%;position:relative;z-index:1}div.mona-slider.mona-slider-vertical .mona-slider-highlight{position:absolute;left:0;bottom:0;right:0;border:none;transition:height ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:top ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:row;grid-auto-rows:minmax(0,1fr);width:100%;height:100%;justify-content:center}div.mona-slider.mona-slider-vertical span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span.mona-dragging{width:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;flex-direction:column-reverse;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before>span>span{margin-right:10px}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-after>span>span{margin-left:10px}div.mona-slider.mona-slider-vertical span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 11px);display:flex;height:0}div.mona-slider.mona-slider-ranged,div.mona-slider.mona-slider-ranged *{transition:none!important}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-slider", providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => SliderComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-slider\" [ngClass]=\"{'mona-no-animation': !initialized, 'mona-slider-ranged': ranged,\n                                    'mona-slider-horizontal': orientation==='horizontal',\n                                    'mona-slider-vertical': orientation==='vertical'}\"\n     (focus)=\"sliderPrimaryHandlerElement.focus()\">\n    <div class=\"mona-slider-track\" #sliderTrackElement>\n        <div class=\"mona-slider-highlight\" [ngClass]=\"{'mona-dragging': dragging}\"\n             [style.width.%]=\"orientation==='horizontal' ? trackData.size : undefined\"\n             [style.height.%]=\"orientation==='vertical' ? trackData.size : undefined\"\n             [style.left.px]=\"orientation==='horizontal' ? trackData.position : undefined\"\n             [style.bottom.px]=\"orientation==='vertical' ? trackData.position : undefined\">\n        </div>\n    </div>\n    <div class=\"mona-slider-tick-list\" #tickListElement>\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== 0\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n            <span class=\"mona-slider-tick\" [ngClass]=\"{'mona-slider-tick-visible': showTicks}\" #tickSpanElement\n                  *ngIf=\"tx !== ticks.length - 1\">\n                <span [ngClass]=\"{'mona-dragging': dragging}\"\n                      (click)=\"onTickClick($event, tickSpanElement)\"></span>\n            </span>\n        </ng-container>\n    </div>\n    <div class=\"mona-slider-tick-label-list\" [ngClass]=\"{'mona-position-before': labelPosition==='before', 'mona-position-after': labelPosition==='after'}\">\n        <ng-container *ngFor=\"let tick of ticks; let tx = index;\">\n            <span class=\"mona-slider-tick-label\">\n                <span *ngIf=\"!tickValueTemplate && tx % labelStep === 0\">{{tick.value}}</span>\n                <span *ngIf=\"tickValueTemplate && tx % labelStep === 0\">\n                    <ng-container\n                        *ngTemplateOutlet=\"tickValueTemplate; context: {$implicit: tick.value}\"></ng-container>\n                </span>\n            </span>\n        </ng-container>\n    </div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-first\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerOnePosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerOnePosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='secondary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'primary')\"\n         (mousedown)=\"onHandlerMouseDown('primary')\" #sliderPrimaryHandlerElement></div>\n\n    <div class=\"mona-slider-handler mona-slider-handler-second\"\n         [ngClass]=\"{'mona-dragging': dragging}\"\n         [style.left.%]=\"orientation === 'horizontal' ? handlerTwoPosition : undefined\"\n         [style.bottom.%]=\"orientation === 'vertical' ? handlerTwoPosition : undefined\"\n         [style.pointer-events]=\"dragging && activeHandlerType==='primary' ? 'none' : undefined\"\n         [attr.tabindex]=\"0\"\n         (keydown)=\"onHandlerKeyDown($event, 'secondary')\"\n         (mousedown)=\"onHandlerMouseDown('secondary')\" #sliderSecondaryHandlerElement *ngIf=\"ranged\"></div>\n</div>\n", styles: ["div.mona-slider{position:relative;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal{height:calc(var(--mona-input-height) * 2);display:flex;align-items:center;cursor:pointer}div.mona-slider.mona-slider-horizontal div.mona-slider-track{height:8px;width:100%;position:relative;z-index:1}div.mona-slider.mona-slider-horizontal .mona-slider-highlight{position:absolute;inset:0;border:none;transition:width ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:left ease-in-out .05s}div.mona-slider.mona-slider-horizontal .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);width:100%;height:100%;align-items:center}div.mona-slider.mona-slider-horizontal span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-horizontal span.mona-slider-tick>span.mona-dragging{height:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-horizontal .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-horizontal span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;height:calc(var(--mona-input-height) - 11px);display:flex;width:0}div.mona-slider.mona-slider-vertical{width:calc(var(--mona-input-height) * 2);height:100%;display:flex;justify-content:center;cursor:pointer}div.mona-slider.mona-slider-vertical div.mona-slider-track{width:8px;height:100%;position:relative;z-index:1}div.mona-slider.mona-slider-vertical .mona-slider-highlight{position:absolute;left:0;bottom:0;right:0;border:none;transition:height ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-highlight.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-handler{position:absolute;width:calc(var(--mona-input-height) - 12px);height:calc(var(--mona-input-height) - 12px);display:flex;align-items:center;justify-content:center;z-index:4;outline:none;transition:top ease-in-out .05s}div.mona-slider.mona-slider-vertical .mona-slider-handler.mona-dragging{transition:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-list{display:grid;position:absolute;grid-auto-flow:row;grid-auto-rows:minmax(0,1fr);width:100%;height:100%;justify-content:center}div.mona-slider.mona-slider-vertical span.mona-slider-tick{display:inline-flex;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 12px)}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span{width:100%;height:100%;z-index:3}div.mona-slider.mona-slider-vertical span.mona-slider-tick>span.mona-dragging{width:calc(var(--mona-input-height) * 2)}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list{position:absolute;width:100%;height:100%;flex-direction:column-reverse;align-items:flex-end;display:flex;justify-content:space-between;-webkit-user-select:none;user-select:none}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before{align-items:flex-start}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-before>span>span{margin-right:10px}div.mona-slider.mona-slider-vertical .mona-slider-tick-label-list.mona-position-after>span>span{margin-left:10px}div.mona-slider.mona-slider-vertical span.mona-slider-tick-label{position:relative;align-items:center;justify-content:center;width:calc(var(--mona-input-height) - 11px);display:flex;height:0}div.mona-slider.mona-slider-ranged,div.mona-slider.mona-slider-ranged *{transition:none!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { value: [{
                type: Input
            }], valueChange: [{
                type: Output
            }] } });

class SliderModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, declarations: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective], imports: [CommonModule], exports: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SliderModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective],
                    imports: [CommonModule],
                    exports: [RangeSliderComponent, SliderComponent, SliderTickValueTemplateDirective]
                }]
        }] });

class SwitchOffLabelTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchOffLabelTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: SwitchOffLabelTemplateDirective, selector: "ng-template[monaSwitchOffLabelTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchOffLabelTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaSwitchOffLabelTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class SwitchOnLabelTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchOnLabelTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: SwitchOnLabelTemplateDirective, selector: "ng-template[monaSwitchOnLabelTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchOnLabelTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaSwitchOnLabelTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

const FadeInOut = (duration = 200) => trigger("fadeInOut", [
    transition(":enter", [style({ opacity: 0 }), animate(duration, style({ opacity: 1 }))]),
    transition(":leave", [animate(duration, style({ opacity: 0 }))])
]);

class SwitchComponent {
    constructor() {
        this.propagateChange = null;
        this.active = false;
        this.labelOff = "OFF";
        this.labelOn = "ON";
        this.offLabelTemplate = null;
        this.onLabelTemplate = null;
    }
    ngOnInit() { }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn) {
        void 0;
    }
    toggle(event) {
        this.active = !this.active;
        this.propagateChange?.(this.active);
    }
    writeValue(obj) {
        if (obj !== undefined) {
            this.active = obj;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: SwitchComponent, selector: "mona-switch", inputs: { labelOff: "labelOff", labelOn: "labelOn" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => SwitchComponent),
                multi: true
            }
        ], queries: [{ propertyName: "offLabelTemplate", first: true, predicate: SwitchOffLabelTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "onLabelTemplate", first: true, predicate: SwitchOnLabelTemplateDirective, descendants: true, read: TemplateRef }], ngImport: i0, template: "<div class=\"mona-switch\" [ngClass]=\"{'mona-switch-active': active}\" (click)=\"toggle($event)\">\n    <span class=\"mona-switch-label mona-switch-on\">\n        <span *ngIf=\"active && !onLabelTemplate\" @fadeInOut>{{labelOn}}</span>\n        <span *ngIf=\"active && onLabelTemplate\" @fadeInOut>\n            <ng-template [ngTemplateOutlet]=\"onLabelTemplate\"></ng-template>\n        </span>\n    </span>\n    <span class=\"mona-switch-label mona-switch-off\">\n        <span *ngIf=\"!active && !offLabelTemplate\" @fadeInOut>{{labelOff}}</span>\n        <span *ngIf=\"!active && offLabelTemplate\" @fadeInOut>\n            <ng-template [ngTemplateOutlet]=\"offLabelTemplate\"></ng-template>\n        </span>\n    </span>\n    <span class=\"mona-switch-handle\" [ngClass]=\"{'mona-switch-on': active, 'mona-switch-off': !active}\"></span>\n</div>\n", styles: ["div.mona-switch{position:relative;width:calc(var(--mona-input-height) * 2);height:var(--mona-input-height);display:flex;padding:2px;align-items:center;cursor:pointer}div.mona-switch,div.mona-switch *{-webkit-user-select:none;user-select:none}span.mona-switch-label{height:100%;flex:1;font-weight:600;display:flex;align-items:center;justify-content:center}span.mona-switch-handle{height:calc(var(--mona-input-height) - 4px);position:absolute;width:calc(var(--mona-input-height) - 4px);transition:left ease-out .2s,background .2s ease-in-out;display:inline-flex}span.mona-switch-handle.mona-switch-on{left:calc(100% - (var(--mona-input-height) - 2px))}span.mona-switch-handle.mona-switch-off{left:2px}span.mona-switch-handle:active:not(.disabled),span.mona-switch-handle:focus-within:not(.disabled),span.mona-switch-handle:focus:not(.disabled){box-shadow:var(--mona-active-shadow)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], animations: [FadeInOut()] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-switch", animations: [FadeInOut()], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => SwitchComponent),
                            multi: true
                        }
                    ], template: "<div class=\"mona-switch\" [ngClass]=\"{'mona-switch-active': active}\" (click)=\"toggle($event)\">\n    <span class=\"mona-switch-label mona-switch-on\">\n        <span *ngIf=\"active && !onLabelTemplate\" @fadeInOut>{{labelOn}}</span>\n        <span *ngIf=\"active && onLabelTemplate\" @fadeInOut>\n            <ng-template [ngTemplateOutlet]=\"onLabelTemplate\"></ng-template>\n        </span>\n    </span>\n    <span class=\"mona-switch-label mona-switch-off\">\n        <span *ngIf=\"!active && !offLabelTemplate\" @fadeInOut>{{labelOff}}</span>\n        <span *ngIf=\"!active && offLabelTemplate\" @fadeInOut>\n            <ng-template [ngTemplateOutlet]=\"offLabelTemplate\"></ng-template>\n        </span>\n    </span>\n    <span class=\"mona-switch-handle\" [ngClass]=\"{'mona-switch-on': active, 'mona-switch-off': !active}\"></span>\n</div>\n", styles: ["div.mona-switch{position:relative;width:calc(var(--mona-input-height) * 2);height:var(--mona-input-height);display:flex;padding:2px;align-items:center;cursor:pointer}div.mona-switch,div.mona-switch *{-webkit-user-select:none;user-select:none}span.mona-switch-label{height:100%;flex:1;font-weight:600;display:flex;align-items:center;justify-content:center}span.mona-switch-handle{height:calc(var(--mona-input-height) - 4px);position:absolute;width:calc(var(--mona-input-height) - 4px);transition:left ease-out .2s,background .2s ease-in-out;display:inline-flex}span.mona-switch-handle.mona-switch-on{left:calc(100% - (var(--mona-input-height) - 2px))}span.mona-switch-handle.mona-switch-off{left:2px}span.mona-switch-handle:active:not(.disabled),span.mona-switch-handle:focus-within:not(.disabled),span.mona-switch-handle:focus:not(.disabled){box-shadow:var(--mona-active-shadow)}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { labelOff: [{
                type: Input
            }], labelOn: [{
                type: Input
            }], offLabelTemplate: [{
                type: ContentChild,
                args: [SwitchOffLabelTemplateDirective, { read: TemplateRef }]
            }], onLabelTemplate: [{
                type: ContentChild,
                args: [SwitchOnLabelTemplateDirective, { read: TemplateRef }]
            }] } });

class SwitchModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, declarations: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective], imports: [CommonModule], exports: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SwitchModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective],
                    imports: [CommonModule],
                    exports: [SwitchComponent, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective]
                }]
        }] });

class TextAreaDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextAreaDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TextAreaDirective, selector: "textarea[monaTextArea]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextAreaDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "textarea[monaTextArea]"
                }]
        }], ctorParameters: function () { return []; } });

class TextAreaModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextAreaModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TextAreaModule, declarations: [TextAreaDirective], exports: [TextAreaDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextAreaModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TextAreaModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TextAreaDirective],
                    exports: [TextAreaDirective]
                }]
        }] });

class InputsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: InputsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: InputsModule, imports: [CommonModule], exports: [CheckBoxModule,
            ColorPaletteModule,
            ColorPickerModule,
            NumericTextBoxModule,
            RadioButtonModule,
            SliderModule,
            SwitchModule,
            TextAreaModule,
            TextBoxModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: InputsModule, imports: [CommonModule, CheckBoxModule,
            ColorPaletteModule,
            ColorPickerModule,
            NumericTextBoxModule,
            RadioButtonModule,
            SliderModule,
            SwitchModule,
            TextAreaModule,
            TextBoxModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: InputsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [
                        CheckBoxModule,
                        ColorPaletteModule,
                        ColorPickerModule,
                        NumericTextBoxModule,
                        RadioButtonModule,
                        SliderModule,
                        SwitchModule,
                        TextAreaModule,
                        TextBoxModule
                    ]
                }]
        }] });

const SlideDown = trigger("slideDown", [
    transition(":enter", [style({ height: 0, overflow: "hidden" }), animate(100, style({ height: "*" }))]),
    transition(":leave", [animate(100, style({ height: 0 }))])
]);
const SlideDownHidden = trigger("slideDownHidden", [
    state("true", style({ height: "*", display: "block" })),
    state("false", style({ height: 0, display: "none" })),
    transition("* => *", [animate("200ms ease-in-out")])
]);
const SlideInOut = trigger("slideInOut", [
    state("true", style({
        height: "0",
        opacity: "0",
        overflow: "hidden"
    })),
    state("false", style({
        height: "*",
        opacity: "1",
        overflow: "visible"
    })),
    transition("true => false", animate("300ms linear")),
    transition("false => true", [style({ overflow: "hidden" }), animate("300ms linear")])
]);
const SlideIn = trigger("slideIn", [
    state("void", style({ transform: "translate3d(0, 25%, 0) scale(0.9)", opacity: 0 })),
    state("enter", style({ transform: "none", opacity: 1 })),
    state("leave", style({ transform: "translate3d(0, 25%, 0)", opacity: 0 })),
    transition("* => *", animate("400ms cubic-bezier(0.25, 0.8, 0.25, 1)"))
]);

class ExpansionPanelTitleTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelTitleTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ExpansionPanelTitleTemplateDirective, selector: "ng-template[monaExpansionPanelTitleTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelTitleTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaExpansionPanelTitleTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class ExpansionPanelActionsTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelActionsTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: ExpansionPanelActionsTemplateDirective, selector: "ng-template[monaExpansionPanelActionsTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelActionsTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaExpansionPanelActionsTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class ExpansionPanelComponent {
    constructor() {
        this.collapseIcon = faMinus;
        this.expandIcon = faPlus;
        this.actionsTemplate = null;
        this.expanded = false;
        this.title = "";
        this.titleTemplate = null;
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ExpansionPanelComponent, selector: "mona-expansion-panel", inputs: { expanded: "expanded", title: "title" }, queries: [{ propertyName: "actionsTemplate", first: true, predicate: ExpansionPanelActionsTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "titleTemplate", first: true, predicate: ExpansionPanelTitleTemplateDirective, descendants: true, read: TemplateRef }], ngImport: i0, template: "<div class=\"mona-expansion-panel\" [ngClass]=\"{'collapsed': !expanded}\">\n    <div class=\"mona-expansion-panel-header\" (click)=\"expanded=!expanded;\">\n        <div class=\"mona-expansion-panel-header-title\">\n            <ng-container *ngIf=\"!titleTemplate\">{{title}}</ng-container>\n            <ng-container [ngTemplateOutlet]=\"titleTemplate\" *ngIf=\"!!titleTemplate\"></ng-container>\n        </div>\n        <div class=\"mona-expansion-panel-header-actions\">\n            <ng-container *ngIf=\"!actionsTemplate\">\n                <fa-icon [icon]=\"collapseIcon\" *ngIf=\"expanded\"></fa-icon>\n                <fa-icon [icon]=\"expandIcon\" *ngIf=\"!expanded\"></fa-icon>\n            </ng-container>\n            <ng-container [ngTemplateOutlet]=\"actionsTemplate\" *ngIf=\"!!actionsTemplate\"></ng-container>\n        </div>\n    </div>\n    <div class=\"mona-expansion-panel-content\" [ngClass]=\"{'hidden': !expanded}\" @slideDownHidden>\n        <ng-content></ng-content>\n    </div>\n</div>\n", styles: ["div.mona-expansion-panel{background:var(--mona-background);border:1px solid var(--mona-border-color)}div.mona-expansion-panel.collapsed{border-bottom:none}div.mona-expansion-panel-header{width:100%;height:var(--mona-input-height);display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:var(--mona-background-dark);border-bottom:1px solid var(--mona-border-color);color:var(--mona-text);cursor:pointer;-webkit-user-select:none;user-select:none}div.mona-expansion-panel-content{padding:10px;color:var(--mona-text)}div.mona-expansion-panel-content.hidden{display:none;border-bottom:none}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }], animations: [SlideDownHidden] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-expansion-panel", animations: [SlideDownHidden], template: "<div class=\"mona-expansion-panel\" [ngClass]=\"{'collapsed': !expanded}\">\n    <div class=\"mona-expansion-panel-header\" (click)=\"expanded=!expanded;\">\n        <div class=\"mona-expansion-panel-header-title\">\n            <ng-container *ngIf=\"!titleTemplate\">{{title}}</ng-container>\n            <ng-container [ngTemplateOutlet]=\"titleTemplate\" *ngIf=\"!!titleTemplate\"></ng-container>\n        </div>\n        <div class=\"mona-expansion-panel-header-actions\">\n            <ng-container *ngIf=\"!actionsTemplate\">\n                <fa-icon [icon]=\"collapseIcon\" *ngIf=\"expanded\"></fa-icon>\n                <fa-icon [icon]=\"expandIcon\" *ngIf=\"!expanded\"></fa-icon>\n            </ng-container>\n            <ng-container [ngTemplateOutlet]=\"actionsTemplate\" *ngIf=\"!!actionsTemplate\"></ng-container>\n        </div>\n    </div>\n    <div class=\"mona-expansion-panel-content\" [ngClass]=\"{'hidden': !expanded}\" @slideDownHidden>\n        <ng-content></ng-content>\n    </div>\n</div>\n", styles: ["div.mona-expansion-panel{background:var(--mona-background);border:1px solid var(--mona-border-color)}div.mona-expansion-panel.collapsed{border-bottom:none}div.mona-expansion-panel-header{width:100%;height:var(--mona-input-height);display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:var(--mona-background-dark);border-bottom:1px solid var(--mona-border-color);color:var(--mona-text);cursor:pointer;-webkit-user-select:none;user-select:none}div.mona-expansion-panel-content{padding:10px;color:var(--mona-text)}div.mona-expansion-panel-content.hidden{display:none;border-bottom:none}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { actionsTemplate: [{
                type: ContentChild,
                args: [ExpansionPanelActionsTemplateDirective, { read: TemplateRef }]
            }], expanded: [{
                type: Input
            }], title: [{
                type: Input
            }], titleTemplate: [{
                type: ContentChild,
                args: [ExpansionPanelTitleTemplateDirective, { read: TemplateRef }]
            }] } });

class ExpansionPanelModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, declarations: [ExpansionPanelComponent,
            ExpansionPanelTitleTemplateDirective,
            ExpansionPanelActionsTemplateDirective], imports: [CommonModule, FontAwesomeModule], exports: [ExpansionPanelComponent, ExpansionPanelTitleTemplateDirective, ExpansionPanelActionsTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, imports: [CommonModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ExpansionPanelModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        ExpansionPanelComponent,
                        ExpansionPanelTitleTemplateDirective,
                        ExpansionPanelActionsTemplateDirective
                    ],
                    imports: [CommonModule, FontAwesomeModule],
                    exports: [ExpansionPanelComponent, ExpansionPanelTitleTemplateDirective, ExpansionPanelActionsTemplateDirective]
                }]
        }] });

class StepperIndicatorTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperIndicatorTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: StepperIndicatorTemplateDirective, selector: "ng-template[monaStepperIndicatorTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperIndicatorTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaStepperIndicatorTemplate]"
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

class StepperLabelTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperLabelTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: StepperLabelTemplateDirective, selector: "ng-template[monaStepperLabelTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperLabelTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaStepperLabelTemplate]"
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

class StepperStepTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperStepTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: StepperStepTemplateDirective, selector: "ng-template[monaStepperStepTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperStepTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaStepperStepTemplate]"
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

class Step {
    constructor(options) {
        this.options = options;
        this.active = false;
        this.index = 0;
    }
}

class StepperComponent {
    set step(step) {
        if (this.stepList.length > 0) {
            this.setActiveStep(this.stepList[step]);
        }
    }
    get step() {
        return this.activeStep ? this.activeStep.index : 0;
    }
    set steps(steps) {
        this.stepList = steps.map((s, ix) => {
            const step = new Step(s);
            step.index = ix;
            return step;
        });
    }
    constructor(elementRef, cdr) {
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.componentDestroy$ = new Subject();
        this.activeStep = null;
        this.stepList = [];
        this.indicatorTemplateDirective = null;
        this.linear = false;
        this.labelTemplateDirective = null;
        this.orientation = "horizontal";
        this.stepTemplateDirective = null;
        this.stepChange = new EventEmitter();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        if (!this.activeStep) {
            this.setActiveStep(this.stepList[0], true);
        }
        this.setSubscriptions();
    }
    onStepClick(step) {
        const changed = this.setActiveStep(step);
        if (changed) {
            this.stepChange.emit(step.index);
        }
    }
    setActiveStep(step, bypassLinear = false) {
        if (this.activeStep === step) {
            return false;
        }
        if (!this.linear) {
            this.activeStep = step;
            Enumerable.from(this.stepList).forEach(s => (s.active = s.index <= step.index));
            return true;
        }
        else {
            if (this.activeStep && (this.activeStep.index + 1 === step.index || step.index <= this.activeStep.index)) {
                this.activeStep = step;
                Enumerable.from(this.stepList).forEach(s => (s.active = s.index <= step.index));
                return true;
            }
            else if (!this.activeStep) {
                if (bypassLinear || (!bypassLinear && step.index === 0)) {
                    this.activeStep = step;
                    Enumerable.from(this.stepList).forEach(s => (s.active = s.index <= step.index));
                    return true;
                }
            }
        }
        return false;
    }
    setSubscriptions() {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            if (!this.activeStep) {
                this.activeStep = this.stepList[0];
                return;
            }
            if (event.key === "ArrowLeft") {
                const index = this.activeStep.index - 1;
                if (index >= 0) {
                    this.setActiveStep(this.stepList[index]);
                }
            }
            else if (event.key === "ArrowRight") {
                const index = this.activeStep.index + 1;
                if (index < this.stepList.length) {
                    this.setActiveStep(this.stepList[index]);
                }
            }
            this.cdr.detectChanges();
        });
    }
    get gridTemplateColumns() {
        return {
            gridTemplateColumns: this.orientation === "horizontal" ? `repeat(${this.stepList.length * 2}, 1fr)` : undefined,
            gridTemplateRows: this.orientation === "vertical" ? `repeat(${this.stepList.length * 2}, 1fr)` : undefined
        };
    }
    get trackInnerStyles() {
        return {
            width: this.orientation === "horizontal" ? this.trackLength : undefined,
            height: this.orientation === "vertical" ? this.trackLength : undefined
        };
    }
    get trackItemSize() {
        return this.stepList.length !== 0 ? 100 / this.stepList.length : 0;
    }
    get trackItemStyles() {
        return {
            maxWidth: this.orientation === "horizontal" ? `${this.trackItemSize}%` : undefined,
            maxHeight: this.orientation === "vertical" ? `${this.trackItemSize}%` : undefined
        };
    }
    get trackLength() {
        return !this.activeStep ? "0%" : `${(100 / (this.stepList.length - 1)) * this.activeStep.index}%`;
    }
    get trackStyles() {
        return {
            gridColumn: this.orientation === "horizontal"
                ? this.activeStep
                    ? `2/${this.stepList.length * 2}`
                    : undefined
                : undefined,
            gridRow: this.orientation === "vertical"
                ? this.activeStep
                    ? `2/${this.stepList.length * 2}`
                    : undefined
                : undefined
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: StepperComponent, selector: "mona-stepper", inputs: { linear: "linear", orientation: "orientation", step: "step", steps: "steps" }, outputs: { stepChange: "stepChange" }, queries: [{ propertyName: "indicatorTemplateDirective", first: true, predicate: StepperIndicatorTemplateDirective, descendants: true }, { propertyName: "labelTemplateDirective", first: true, predicate: StepperLabelTemplateDirective, descendants: true }, { propertyName: "stepTemplateDirective", first: true, predicate: StepperStepTemplateDirective, descendants: true }], ngImport: i0, template: "<div class=\"mona-stepper\" [ngStyle]=\"gridTemplateColumns\" [ngClass]=\"{'mona-stepper-vertical': orientation==='vertical', 'mona-stepper-linear': linear}\" [attr.tabindex]=\"1\">\n    <ol class=\"mona-stepper-step-list\" [ngClass]=\"{'mona-stepper-step-list-horizontal': orientation==='horizontal', 'mona-stepper-step-list-vertical': orientation==='vertical'}\">\n        <li *ngFor=\"let step of stepList\"\n            [ngStyle]=\"trackItemStyles\"\n            (click)=\"onStepClick(step)\">\n            <div>\n                <ng-container *ngIf=\"!stepTemplateDirective\">\n                    <span [ngClass]=\"{'mona-stepper-step-active': step.active}\">\n                        <ng-container *ngIf=\"!indicatorTemplateDirective\">{{step.index}}</ng-container>\n                        <ng-container *ngIf=\"indicatorTemplateDirective\" [ngTemplateOutlet]=\"indicatorTemplateDirective.templateRef\"\n                                      [ngTemplateOutletContext]=\"{$implicit: step.options, index: step.index, active: step.active}\"></ng-container>\n                    </span>\n                </ng-container>\n                <ng-container *ngIf=\"stepTemplateDirective\">\n                    <ng-container [ngTemplateOutlet]=\"stepTemplateDirective.templateRef\"\n                                  [ngTemplateOutletContext]=\"{$implicit: step.options, index: step.index, active: step.active}\"></ng-container>\n                </ng-container>\n\n                <span *ngIf=\"!labelTemplateDirective\">{{step.options.label}}</span>\n                <ng-container *ngIf=\"labelTemplateDirective\" [ngTemplateOutlet]=\"labelTemplateDirective?.templateRef ?? null\"\n                              [ngTemplateOutletContext]=\"{$implicit: step.options, index: step.index, active: step.active}\"></ng-container>\n            </div>\n        </li>\n    </ol>\n    <div class=\"mona-stepper-track\" [ngStyle]=\"trackStyles\" [ngClass]=\"{'mona-stepper-track-horizontal': orientation==='horizontal', 'mona-stepper-track-vertical': orientation==='vertical'}\">\n        <div [ngStyle]=\"trackInnerStyles\"></div>\n    </div>\n</div>\n", styles: ["div.mona-stepper{position:relative;width:auto;display:grid;outline:none}div.mona-stepper-vertical{height:100%}ol.mona-stepper-step-list{position:absolute;display:flex;list-style:none}ol.mona-stepper-step-list li{display:flex;align-items:center;justify-content:center;flex:1 0 auto}ol.mona-stepper-step-list li div{display:flex;width:100%;align-items:center;z-index:1;cursor:pointer}ol.mona-stepper-step-list li div>span:first-child{width:var(--mona-input-height);height:var(--mona-input-height);display:flex;align-items:center;justify-content:center;background-color:var(--mona-background);border:1px solid var(--mona-border-color);color:var(--mona-text);transition:background-color .15s ease-out,color .15s ease-out}ol.mona-stepper-step-list li div>span:first-child.mona-stepper-step-active{background-color:var(--mona-primary)}ol.mona-stepper-step-list li div>span:last-child{color:var(--mona-text);transition:color .15s ease-in-out}ol.mona-stepper-step-list-horizontal{grid-column:1/-1;flex-direction:row;width:100%}ol.mona-stepper-step-list-horizontal>li>div:first-child{flex-direction:column;row-gap:5px}ol.mona-stepper-step-list-vertical{grid-row:1/-1;flex-direction:column;height:100%;width:max-content;left:calc(-1 * (var(--mona-input-height) - 8px) / 2)}ol.mona-stepper-step-list-vertical>li>div:first-child{flex-direction:row;column-gap:5px}div.mona-stepper-track{position:relative;display:grid;background-color:var(--mona-background);border:1px solid var(--mona-border-color)}div.mona-stepper-track>div{position:absolute;background-color:var(--mona-primary)}div.mona-stepper-track-horizontal{width:100%;height:8px;top:calc((var(--mona-input-height) - 8px) / 2)}div.mona-stepper-track-horizontal>div{height:100%;transition:width .15s ease-in-out}div.mona-stepper-track-vertical{height:100%;width:8px}div.mona-stepper-track-vertical>div{width:100%;transition:height .15s ease-in-out}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-stepper", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-stepper\" [ngStyle]=\"gridTemplateColumns\" [ngClass]=\"{'mona-stepper-vertical': orientation==='vertical', 'mona-stepper-linear': linear}\" [attr.tabindex]=\"1\">\n    <ol class=\"mona-stepper-step-list\" [ngClass]=\"{'mona-stepper-step-list-horizontal': orientation==='horizontal', 'mona-stepper-step-list-vertical': orientation==='vertical'}\">\n        <li *ngFor=\"let step of stepList\"\n            [ngStyle]=\"trackItemStyles\"\n            (click)=\"onStepClick(step)\">\n            <div>\n                <ng-container *ngIf=\"!stepTemplateDirective\">\n                    <span [ngClass]=\"{'mona-stepper-step-active': step.active}\">\n                        <ng-container *ngIf=\"!indicatorTemplateDirective\">{{step.index}}</ng-container>\n                        <ng-container *ngIf=\"indicatorTemplateDirective\" [ngTemplateOutlet]=\"indicatorTemplateDirective.templateRef\"\n                                      [ngTemplateOutletContext]=\"{$implicit: step.options, index: step.index, active: step.active}\"></ng-container>\n                    </span>\n                </ng-container>\n                <ng-container *ngIf=\"stepTemplateDirective\">\n                    <ng-container [ngTemplateOutlet]=\"stepTemplateDirective.templateRef\"\n                                  [ngTemplateOutletContext]=\"{$implicit: step.options, index: step.index, active: step.active}\"></ng-container>\n                </ng-container>\n\n                <span *ngIf=\"!labelTemplateDirective\">{{step.options.label}}</span>\n                <ng-container *ngIf=\"labelTemplateDirective\" [ngTemplateOutlet]=\"labelTemplateDirective?.templateRef ?? null\"\n                              [ngTemplateOutletContext]=\"{$implicit: step.options, index: step.index, active: step.active}\"></ng-container>\n            </div>\n        </li>\n    </ol>\n    <div class=\"mona-stepper-track\" [ngStyle]=\"trackStyles\" [ngClass]=\"{'mona-stepper-track-horizontal': orientation==='horizontal', 'mona-stepper-track-vertical': orientation==='vertical'}\">\n        <div [ngStyle]=\"trackInnerStyles\"></div>\n    </div>\n</div>\n", styles: ["div.mona-stepper{position:relative;width:auto;display:grid;outline:none}div.mona-stepper-vertical{height:100%}ol.mona-stepper-step-list{position:absolute;display:flex;list-style:none}ol.mona-stepper-step-list li{display:flex;align-items:center;justify-content:center;flex:1 0 auto}ol.mona-stepper-step-list li div{display:flex;width:100%;align-items:center;z-index:1;cursor:pointer}ol.mona-stepper-step-list li div>span:first-child{width:var(--mona-input-height);height:var(--mona-input-height);display:flex;align-items:center;justify-content:center;background-color:var(--mona-background);border:1px solid var(--mona-border-color);color:var(--mona-text);transition:background-color .15s ease-out,color .15s ease-out}ol.mona-stepper-step-list li div>span:first-child.mona-stepper-step-active{background-color:var(--mona-primary)}ol.mona-stepper-step-list li div>span:last-child{color:var(--mona-text);transition:color .15s ease-in-out}ol.mona-stepper-step-list-horizontal{grid-column:1/-1;flex-direction:row;width:100%}ol.mona-stepper-step-list-horizontal>li>div:first-child{flex-direction:column;row-gap:5px}ol.mona-stepper-step-list-vertical{grid-row:1/-1;flex-direction:column;height:100%;width:max-content;left:calc(-1 * (var(--mona-input-height) - 8px) / 2)}ol.mona-stepper-step-list-vertical>li>div:first-child{flex-direction:row;column-gap:5px}div.mona-stepper-track{position:relative;display:grid;background-color:var(--mona-background);border:1px solid var(--mona-border-color)}div.mona-stepper-track>div{position:absolute;background-color:var(--mona-primary)}div.mona-stepper-track-horizontal{width:100%;height:8px;top:calc((var(--mona-input-height) - 8px) / 2)}div.mona-stepper-track-horizontal>div{height:100%;transition:width .15s ease-in-out}div.mona-stepper-track-vertical{height:100%;width:8px}div.mona-stepper-track-vertical>div{width:100%;transition:height .15s ease-in-out}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { indicatorTemplateDirective: [{
                type: ContentChild,
                args: [StepperIndicatorTemplateDirective]
            }], linear: [{
                type: Input
            }], labelTemplateDirective: [{
                type: ContentChild,
                args: [StepperLabelTemplateDirective]
            }], orientation: [{
                type: Input
            }], stepTemplateDirective: [{
                type: ContentChild,
                args: [StepperStepTemplateDirective]
            }], step: [{
                type: Input
            }], steps: [{
                type: Input
            }], stepChange: [{
                type: Output
            }] } });

class StepperModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, declarations: [StepperComponent,
            StepperLabelTemplateDirective,
            StepperIndicatorTemplateDirective,
            StepperStepTemplateDirective], imports: [CommonModule], exports: [StepperComponent,
            StepperIndicatorTemplateDirective,
            StepperLabelTemplateDirective,
            StepperStepTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: StepperModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        StepperComponent,
                        StepperLabelTemplateDirective,
                        StepperIndicatorTemplateDirective,
                        StepperStepTemplateDirective
                    ],
                    imports: [CommonModule],
                    exports: [
                        StepperComponent,
                        StepperIndicatorTemplateDirective,
                        StepperLabelTemplateDirective,
                        StepperStepTemplateDirective
                    ]
                }]
        }] });

class SplitterPaneComponent {
    set size(size) {
        this.paneSize = size == null ? undefined : typeof size === "string" ? size : `${size}px`;
        this.isStatic = true;
    }
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.uid = v4();
        this.isStatic = false;
        this.collapsed = false;
        this.collapsedChange = new EventEmitter();
        this.collapsible = false;
        this.resizable = true;
        this.sizeChange = new EventEmitter();
        this.templateRef = null;
    }
    ngOnInit() { }
    setCollapsed(collapsed) {
        this.collapsed = collapsed;
        this.collapsedChange.emit(collapsed);
    }
    setSize(size) {
        this.paneSize = size == null ? size : typeof size === "string" ? size : `${size}px`;
        this.sizeChange.emit(this.paneSize);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterPaneComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: SplitterPaneComponent, selector: "mona-splitter-pane", inputs: { collapsed: "collapsed", collapsible: "collapsible", element: "element", resizable: "resizable", size: "size" }, outputs: { collapsedChange: "collapsedChange", sizeChange: "sizeChange" }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: "<ng-template>\n    <ng-content></ng-content>\n</ng-template>\n", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterPaneComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-splitter-pane", template: "<ng-template>\n    <ng-content></ng-content>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { collapsed: [{
                type: Input
            }], collapsedChange: [{
                type: Output
            }], collapsible: [{
                type: Input
            }], element: [{
                type: Input
            }], resizable: [{
                type: Input
            }], size: [{
                type: Input
            }], sizeChange: [{
                type: Output
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });

class SplitterResizerComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.horizontalCollapseNextIcon = faCaretRight;
        this.horizontalCollapsePreviousIcon = faCaretLeft;
        this.horizontalResizeIcon = faEllipsisV;
        this.verticalCollapseNextIcon = faCaretDown;
        this.verticalCollapsePreviousIcon = faCaretUp;
        this.verticalResizeIcon = faEllipsisH;
        this.resizing = false;
        this.nextResizer = null;
        this.orientation = "horizontal";
        this.panes = new QueryList();
        this.previousResizer = null;
    }
    ngOnChanges(changes) {
        if (changes && (changes["panes"] || changes["pane"])) {
            const index = this.panes.toArray().indexOf(this.previousPane);
            if (index !== -1) {
                this.nextPane = this.panes.toArray()[index + 1];
            }
        }
    }
    ngOnInit() {
        this.setSubscriptions();
    }
    toggle(position) {
        if (this.previousPane.collapsed && this.nextPane?.collapsed) {
            return;
        }
        if (position === "previous") {
            if (!this.previousPane.collapsed) {
                if (!this.nextPane.collapsed) {
                    this.previousPane.setCollapsed(true);
                    if (!this.previousPane.isStatic && this.nextPane.isStatic) {
                        this.nextPane.isStatic = false;
                    }
                }
                else {
                    this.nextPane.setCollapsed(false);
                    if (this.previousPane.uid === this.panes.first.uid && this.previousPane.paneSize != null) {
                        this.previousPane.isStatic = true;
                    }
                }
            }
            else if (this.nextPane.collapsed) {
                this.nextPane.setCollapsed(false);
            }
        }
        else {
            if (!this.nextPane?.collapsed) {
                if (!this.previousPane.collapsed) {
                    this.nextPane.setCollapsed(true);
                    if (!this.nextPane.isStatic && this.previousPane.isStatic) {
                        this.previousPane.isStatic = false;
                    }
                }
                else {
                    this.previousPane.setCollapsed(false);
                    if (this.nextPane.uid === this.panes.last.uid && this.nextPane.paneSize != null) {
                        this.nextPane.isStatic = true;
                    }
                }
            }
            else if (this.previousPane.collapsed) {
                this.previousPane.setCollapsed(false);
            }
        }
    }
    getPaneElements() {
        return [
            document.querySelector(`[data-pid='${this.previousPane.uid}']`),
            document.querySelector(`[data-pid='${this.nextPane?.uid}']`)
        ];
    }
    resize(event) {
        const [previousPaneElement, nextPaneElement] = this.getPaneElements();
        const rect = previousPaneElement.getBoundingClientRect();
        if (this.orientation === "horizontal") {
            const totalSize = rect.width + nextPaneElement.getBoundingClientRect().width;
            const size = event.clientX - rect.left < 0
                ? 0
                : event.clientX - rect.left > totalSize
                    ? totalSize
                    : event.clientX - rect.left;
            this.previousPane.setSize(`${size}px`);
            this.nextPane.setSize(`${totalSize - size}px`);
        }
        else {
            const totalSize = rect.height + nextPaneElement.getBoundingClientRect().height;
            const size = event.clientY - rect.top < 0
                ? 0
                : event.clientY - rect.top > totalSize
                    ? totalSize
                    : event.clientY - rect.top;
            this.previousPane.setSize(`${size}px`);
            this.nextPane.setSize(`${totalSize - size}px`);
        }
    }
    setSubscriptions() {
        fromEvent(this.elementRef.nativeElement, "mousedown").subscribe(event => {
            this.resizing = true;
            const mouseMoveSubscription = fromEvent(document, "mousemove").subscribe(event => {
                if (!this.previousPane.resizable || !this.nextPane.resizable) {
                    return;
                }
                if (!this.previousPane.collapsed && !this.nextPane.collapsed) {
                    this.resize(event);
                }
            });
            const mouseUpSubscription = fromEvent(document, "mouseup").subscribe(event => {
                mouseMoveSubscription.unsubscribe();
                mouseUpSubscription.unsubscribe();
                this.resizing = false;
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterResizerComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: SplitterResizerComponent, selector: "mona-splitter-resizer", inputs: { nextResizer: "nextResizer", orientation: "orientation", previousPane: "previousPane", panes: "panes", previousResizer: "previousResizer" }, usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-splitter-resizer\" [ngClass]=\"orientation\">\n    <div class=\"mona-splitter-collapse\" [attr.data-pos]=\"'prev'\" (click)=\"toggle('previous')\" *ngIf=\"(previousPane.collapsible || nextPane.collapsed) && (previousPane.resizable && nextPane.resizable)\">\n        <fa-icon [icon]=\"horizontalCollapsePreviousIcon\" *ngIf=\"orientation==='horizontal' && !previousPane.collapsed\"></fa-icon>\n        <fa-icon [icon]=\"verticalCollapsePreviousIcon\" *ngIf=\"orientation==='vertical' && !previousPane.collapsed\"></fa-icon>\n    </div>\n    <ng-container *ngIf=\"previousPane.resizable && nextPane.resizable\">\n        <fa-icon [icon]=\"horizontalResizeIcon\" *ngIf=\"orientation==='horizontal' && !(previousPane.collapsed || nextPane.collapsed)\"></fa-icon>\n        <fa-icon [icon]=\"verticalResizeIcon\" *ngIf=\"orientation==='vertical' && !(previousPane.collapsed || nextPane.collapsed)\"></fa-icon>\n    </ng-container>\n    <div class=\"mona-splitter-collapse\" [attr.data-pos]=\"'next'\" (click)=\"toggle('next')\" *ngIf=\"(nextPane.collapsible || previousPane.collapsed) && (previousPane.resizable && nextPane.resizable)\">\n        <fa-icon [icon]=\"horizontalCollapseNextIcon\" *ngIf=\"orientation==='horizontal' && !nextPane?.collapsed\"></fa-icon>\n        <fa-icon [icon]=\"verticalCollapseNextIcon\" *ngIf=\"orientation==='vertical' && !nextPane?.collapsed\"></fa-icon>\n    </div>\n</div>\n", styles: ["div.mona-splitter-resizer{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;color:var(--mona-text)}div.mona-splitter-resizer fa-icon{opacity:.6}div.mona-splitter-resizer>fa-icon{margin:5px}div.mona-splitter-resizer.vertical{width:100%;height:5px;cursor:row-resize;border-top:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color);background:var(--mona-background)}div.mona-splitter-resizer.vertical div.mona-splitter-collapse[data-pos=prev]{margin-top:1px}div.mona-splitter-resizer.vertical div.mona-splitter-collapse[data-pos=next]{margin-bottom:1px}div.mona-splitter-resizer.horizontal{width:5px;height:100%;cursor:col-resize;border-left:1px solid var(--mona-border-color);border-right:1px solid var(--mona-border-color);background:var(--mona-background);flex-direction:column}div.mona-splitter-resizer.horizontal div.mona-splitter-collapse[data-pos=prev]{margin-left:1px}div.mona-splitter-resizer.horizontal div.mona-splitter-collapse[data-pos=next]{margin-right:1px}div.mona-splitter-collapse{cursor:pointer;display:flex;align-items:center;justify-content:center}div.mona-splitter-collapse fa-icon{font-size:8px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterResizerComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-splitter-resizer", template: "<div class=\"mona-splitter-resizer\" [ngClass]=\"orientation\">\n    <div class=\"mona-splitter-collapse\" [attr.data-pos]=\"'prev'\" (click)=\"toggle('previous')\" *ngIf=\"(previousPane.collapsible || nextPane.collapsed) && (previousPane.resizable && nextPane.resizable)\">\n        <fa-icon [icon]=\"horizontalCollapsePreviousIcon\" *ngIf=\"orientation==='horizontal' && !previousPane.collapsed\"></fa-icon>\n        <fa-icon [icon]=\"verticalCollapsePreviousIcon\" *ngIf=\"orientation==='vertical' && !previousPane.collapsed\"></fa-icon>\n    </div>\n    <ng-container *ngIf=\"previousPane.resizable && nextPane.resizable\">\n        <fa-icon [icon]=\"horizontalResizeIcon\" *ngIf=\"orientation==='horizontal' && !(previousPane.collapsed || nextPane.collapsed)\"></fa-icon>\n        <fa-icon [icon]=\"verticalResizeIcon\" *ngIf=\"orientation==='vertical' && !(previousPane.collapsed || nextPane.collapsed)\"></fa-icon>\n    </ng-container>\n    <div class=\"mona-splitter-collapse\" [attr.data-pos]=\"'next'\" (click)=\"toggle('next')\" *ngIf=\"(nextPane.collapsible || previousPane.collapsed) && (previousPane.resizable && nextPane.resizable)\">\n        <fa-icon [icon]=\"horizontalCollapseNextIcon\" *ngIf=\"orientation==='horizontal' && !nextPane?.collapsed\"></fa-icon>\n        <fa-icon [icon]=\"verticalCollapseNextIcon\" *ngIf=\"orientation==='vertical' && !nextPane?.collapsed\"></fa-icon>\n    </div>\n</div>\n", styles: ["div.mona-splitter-resizer{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;color:var(--mona-text)}div.mona-splitter-resizer fa-icon{opacity:.6}div.mona-splitter-resizer>fa-icon{margin:5px}div.mona-splitter-resizer.vertical{width:100%;height:5px;cursor:row-resize;border-top:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color);background:var(--mona-background)}div.mona-splitter-resizer.vertical div.mona-splitter-collapse[data-pos=prev]{margin-top:1px}div.mona-splitter-resizer.vertical div.mona-splitter-collapse[data-pos=next]{margin-bottom:1px}div.mona-splitter-resizer.horizontal{width:5px;height:100%;cursor:col-resize;border-left:1px solid var(--mona-border-color);border-right:1px solid var(--mona-border-color);background:var(--mona-background);flex-direction:column}div.mona-splitter-resizer.horizontal div.mona-splitter-collapse[data-pos=prev]{margin-left:1px}div.mona-splitter-resizer.horizontal div.mona-splitter-collapse[data-pos=next]{margin-right:1px}div.mona-splitter-collapse{cursor:pointer;display:flex;align-items:center;justify-content:center}div.mona-splitter-collapse fa-icon{font-size:8px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { nextResizer: [{
                type: Input
            }], orientation: [{
                type: Input
            }], previousPane: [{
                type: Input
            }], panes: [{
                type: Input
            }], previousResizer: [{
                type: Input
            }] } });

class SplitterComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.resizers = new IndexableList();
        this.orientation = "horizontal";
        this.paneList = new QueryList();
        this.resizerList = new QueryList();
    }
    ngAfterContentInit() {
        const staticPanes = this.paneList.filter(p => p.isStatic);
        if (staticPanes.length === 0) {
            const percentage = 100 / this.paneList.length;
            this.paneList.forEach(p => {
                p.setSize(`${percentage}%`);
                // p.isStatic = false;
            });
            return;
        }
        if (staticPanes.length === this.paneList.length) {
            this.paneList.last.setSize(undefined);
            this.paneList.last.isStatic = false;
        }
        this.cdr.detectChanges();
    }
    ngAfterViewInit() {
        this.resizers = new IndexableList(this.resizerList);
        this.resizerList.changes.subscribe(() => {
            this.resizers = new IndexableList(this.resizerList);
        });
        this.cdr.detectChanges();
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: SplitterComponent, selector: "mona-splitter", inputs: { orientation: "orientation" }, queries: [{ propertyName: "paneList", predicate: SplitterPaneComponent }], viewQueries: [{ propertyName: "resizerList", predicate: SplitterResizerComponent, descendants: true }], ngImport: i0, template: "<div class=\"mona-splitter\" [ngClass]=\"{'mona-splitter-vertical': orientation==='vertical'}\">\n    <ng-container *ngFor=\"let pane of paneList; let px = index;\">\n        <div class=\"mona-splitter-pane\" [attr.data-px]=\"px\" [attr.data-pid]=\"pane.uid\"\n             [ngStyle]=\"{'order': px*2, 'flex-basis': pane.paneSize}\" [ngClass]=\"{'mona-splitter-static': pane.isStatic, 'mona-splitter-hidden': pane.collapsed}\">\n            <ng-container [ngTemplateOutlet]=\"pane.templateRef\" *ngIf=\"pane.templateRef\"></ng-container>\n        </div>\n        <mona-splitter-resizer [orientation]=\"orientation\" [previousResizer]=\"px===0?null:resizers[px]\"\n                               [nextResizer]=\"px===resizers.length-1?null:resizers[px+1]\"\n                               [previousPane]=\"pane\" [panes]=\"paneList\" [ngStyle]=\"{'order': px*2+1}\"\n                               *ngIf=\"px !== paneList.length-1;\"></mona-splitter-resizer>\n    </ng-container>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-splitter{width:100%;height:100%;display:flex;position:relative;flex-direction:row;overflow:hidden}div.mona-splitter.mona-splitter-vertical{flex-direction:column}div.mona-splitter-pane{flex:1 1 auto;overflow:hidden}div.mona-splitter-pane.mona-splitter-static{flex-grow:0;flex-shrink:0}div.mona-splitter-pane.mona-splitter-hidden{flex:0 1 0%!important;overflow:hidden!important}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: SplitterResizerComponent, selector: "mona-splitter-resizer", inputs: ["nextResizer", "orientation", "previousPane", "panes", "previousResizer"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-splitter", template: "<div class=\"mona-splitter\" [ngClass]=\"{'mona-splitter-vertical': orientation==='vertical'}\">\n    <ng-container *ngFor=\"let pane of paneList; let px = index;\">\n        <div class=\"mona-splitter-pane\" [attr.data-px]=\"px\" [attr.data-pid]=\"pane.uid\"\n             [ngStyle]=\"{'order': px*2, 'flex-basis': pane.paneSize}\" [ngClass]=\"{'mona-splitter-static': pane.isStatic, 'mona-splitter-hidden': pane.collapsed}\">\n            <ng-container [ngTemplateOutlet]=\"pane.templateRef\" *ngIf=\"pane.templateRef\"></ng-container>\n        </div>\n        <mona-splitter-resizer [orientation]=\"orientation\" [previousResizer]=\"px===0?null:resizers[px]\"\n                               [nextResizer]=\"px===resizers.length-1?null:resizers[px+1]\"\n                               [previousPane]=\"pane\" [panes]=\"paneList\" [ngStyle]=\"{'order': px*2+1}\"\n                               *ngIf=\"px !== paneList.length-1;\"></mona-splitter-resizer>\n    </ng-container>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-splitter{width:100%;height:100%;display:flex;position:relative;flex-direction:row;overflow:hidden}div.mona-splitter.mona-splitter-vertical{flex-direction:column}div.mona-splitter-pane{flex:1 1 auto;overflow:hidden}div.mona-splitter-pane.mona-splitter-static{flex-grow:0;flex-shrink:0}div.mona-splitter-pane.mona-splitter-hidden{flex:0 1 0%!important;overflow:hidden!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { orientation: [{
                type: Input
            }], paneList: [{
                type: ContentChildren,
                args: [SplitterPaneComponent]
            }], resizerList: [{
                type: ViewChildren,
                args: [SplitterResizerComponent]
            }] } });

class SplitterModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, declarations: [SplitterComponent, SplitterPaneComponent, SplitterResizerComponent], imports: [CommonModule, FontAwesomeModule], exports: [SplitterComponent, SplitterPaneComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, imports: [CommonModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SplitterModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SplitterComponent, SplitterPaneComponent, SplitterResizerComponent],
                    imports: [CommonModule, FontAwesomeModule],
                    exports: [SplitterComponent, SplitterPaneComponent]
                }]
        }] });

class TabCloseEvent {
    constructor(index, tabComponent) {
        this.index = index;
        this.selected = tabComponent.selected;
    }
}

class TabContentTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabContentTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TabContentTemplateDirective, selector: "ng-template[monaTabContentTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabContentTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaTabContentTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class TabTitleTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabTitleTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TabTitleTemplateDirective, selector: "ng-template[monaTabTitleTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabTitleTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaTabTitleTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class TabComponent {
    constructor() {
        this.uid = v4();
        this.index = 0;
        this.contentTemplate = null;
        this.disabled = false;
        this.selected = false;
        this.title = "";
        this.titleTemplate = null;
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TabComponent, selector: "mona-tab", inputs: { closable: "closable", disabled: "disabled", selected: "selected", title: "title" }, queries: [{ propertyName: "contentTemplate", first: true, predicate: TabContentTemplateDirective, descendants: true, read: TemplateRef }, { propertyName: "titleTemplate", first: true, predicate: TabTitleTemplateDirective, descendants: true, read: TemplateRef }], ngImport: i0, template: "", styles: [""] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tab", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { closable: [{
                type: Input
            }], contentTemplate: [{
                type: ContentChild,
                args: [TabContentTemplateDirective, { read: TemplateRef }]
            }], disabled: [{
                type: Input
            }], selected: [{
                type: Input
            }], title: [{
                type: Input
            }], titleTemplate: [{
                type: ContentChild,
                args: [TabTitleTemplateDirective, { read: TemplateRef }]
            }] } });

class TabStripComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.componentDestroy$ = new Subject();
        this.scroll$ = new Subject();
        this.scrollLeftIcon = faChevronLeft;
        this.scrollRightIcon = faChevronRight;
        this.tabCloseIcon = faXmark;
        // public selectedTab?: TabComponent;
        this.closable = false;
        this.keepTabContent = false;
        this.tabClose = new EventEmitter();
        this.tabComponents = new QueryList();
    }
    ngAfterContentInit() {
        this.tabComponents.forEach((t, tx) => (t.index = tx));
        this.tabComponents.changes
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((tabs) => {
            tabs.forEach((t, tx) => (t.index = tx));
        });
    }
    ngAfterViewInit() {
        // this.selectedTab = this.tabComponents.find(t => t.selected)
        // if (this.selectedTab) {
        //     this.selectedTab.active = true;
        // }
        this.cdr.detectChanges();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() { }
    onTabClick(tab, tabListElement) {
        this.tabComponents.forEach(t => (t.selected = false));
        tab.selected = true;
        window.setTimeout(() => {
            const listElement = tabListElement.querySelector("li.mona-tab-active");
            if (listElement) {
                listElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }
    onTabClose(tab, event) {
        event.stopPropagation();
        const tabCloseEvent = new TabCloseEvent(tab.index, tab);
        this.tabClose.emit(tabCloseEvent);
    }
    startScrolling(element, direction, type) {
        const timeFunction = type === "single" ? timer : interval;
        timeFunction(60)
            .pipe(takeUntil(this.scroll$))
            .subscribe(() => {
            let left = 0;
            switch (direction) {
                case "left":
                    left = Math.max(element.scrollLeft - 100, 0);
                    element.scrollTo({ left, behavior: "smooth" });
                    break;
                case "right":
                    left = Math.min(element.scrollLeft + 100, element.scrollWidth);
                    element.scrollTo({ left, behavior: "smooth" });
                    break;
            }
        });
    }
    stopScrolling() {
        this.scroll$.next();
        this.scroll$.complete();
        this.scroll$ = new Subject();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabStripComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TabStripComponent, selector: "mona-tab-strip", inputs: { closable: "closable", keepTabContent: "keepTabContent" }, outputs: { tabClose: "tabClose" }, queries: [{ propertyName: "tabComponents", predicate: TabComponent }], ngImport: i0, template: "<div class=\"mona-tab-strip\">\n    <div class=\"mona-tab-strip-tabs\">\n        <div class=\"mona-tab-strip-scroll\">\n            <button monaButton (click)=\"startScrolling(tabListElement, 'left', 'single')\"\n                    (mousedown)=\"startScrolling(tabListElement, 'left', 'continuous')\" (mouseup)=\"stopScrolling()\">\n                <fa-icon [icon]=\"scrollLeftIcon\"></fa-icon>\n            </button>\n        </div>\n        <ul class=\"mona-tab-list\" #tabListElement>\n            <li *ngFor=\"let tab of tabComponents\" [ngClass]=\"{'mona-tab-active': tab.selected, 'mona-disabled': tab.disabled}\"\n                (click)=\"onTabClick(tab, tabListElement)\">\n                <div class=\"mona-tab-title\">\n                    <span *ngIf=\"!tab.titleTemplate\">{{tab.title}}</span>\n                    <ng-container [ngTemplateOutlet]=\"tab.titleTemplate\" *ngIf=\"!!tab.titleTemplate\"></ng-container>\n                </div>\n                <button monaButton [flat]=\"true\" [disabled]=\"tab.disabled\" *ngIf=\"(tab.closable===true) || (closable && tab.closable==null)\" class=\"mona-tab-close\" (click)=\"onTabClose(tab, $event)\">\n                    <fa-icon [icon]=\"tabCloseIcon\"></fa-icon>\n                </button>\n            </li>\n        </ul>\n        <div class=\"mona-tab-strip-scroll\">\n            <button monaButton (click)=\"startScrolling(tabListElement, 'right', 'single')\"\n                    (mousedown)=\"startScrolling(tabListElement, 'right', 'continuous')\" (mouseup)=\"stopScrolling()\">\n                <fa-icon [icon]=\"scrollRightIcon\"></fa-icon>\n            </button>\n        </div>\n    </div>\n    <ng-container *ngFor=\"let tab of tabComponents\">\n        <div class=\"mona-tab-content\" [ngClass]=\"{'mona-tab-hidden': keepTabContent && !tab.selected}\"\n             *ngIf=\"keepTabContent || tab.selected\">\n            <ng-container [ngTemplateOutlet]=\"tab.contentTemplate\"></ng-container>\n        </div>\n    </ng-container>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-tab-strip{width:100%;height:100%;border:1px solid var(--mona-border-color)}div.mona-tab-strip-tabs{width:100%;height:var(--mona-input-height);background:1px solid var(--mona-background-dark);border-bottom:1px solid var(--mona-border-color);display:flex}ul.mona-tab-list{list-style-type:none;width:100%;height:100%;display:flex;cursor:default;-webkit-user-select:none;user-select:none;font-size:12px;white-space:nowrap;overflow:hidden;background:var(--mona-background-dark)}ul.mona-tab-list li{list-style-type:none;height:100%;display:flex;align-items:center;justify-content:center;color:var(--mona-text);border-right:1px solid var(--mona-border-color);cursor:pointer}ul.mona-tab-list li.mona-tab-active{font-weight:700;background:var(--mona-background);color:var(--mona-primary)}ul.mona-tab-list li button.mona-tab-close{display:flex;align-items:center;justify-content:center}ul.mona-tab-list li button.mona-tab-close fa-icon{margin-top:2px}div.mona-tab-title{padding:5px 10px}div.mona-tab-strip-scroll{width:var(--mona-input-height);height:100%;display:flex;align-items:center;justify-content:center;background:var(--mona-background-dark);color:var(--mona-text)}div.mona-tab-strip-scroll button[monaButton]{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:none;color:var(--mona-text);cursor:pointer;box-shadow:none}div.mona-tab-strip-scroll button[monaButton]:hover{background:var(--mona-background-darker)}div.mona-tab-content{width:100%;height:calc(100% - var(--mona-input-height));background:var(--mona-background-light);overflow:auto}div.mona-tab-hidden{display:none}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabStripComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tab-strip", template: "<div class=\"mona-tab-strip\">\n    <div class=\"mona-tab-strip-tabs\">\n        <div class=\"mona-tab-strip-scroll\">\n            <button monaButton (click)=\"startScrolling(tabListElement, 'left', 'single')\"\n                    (mousedown)=\"startScrolling(tabListElement, 'left', 'continuous')\" (mouseup)=\"stopScrolling()\">\n                <fa-icon [icon]=\"scrollLeftIcon\"></fa-icon>\n            </button>\n        </div>\n        <ul class=\"mona-tab-list\" #tabListElement>\n            <li *ngFor=\"let tab of tabComponents\" [ngClass]=\"{'mona-tab-active': tab.selected, 'mona-disabled': tab.disabled}\"\n                (click)=\"onTabClick(tab, tabListElement)\">\n                <div class=\"mona-tab-title\">\n                    <span *ngIf=\"!tab.titleTemplate\">{{tab.title}}</span>\n                    <ng-container [ngTemplateOutlet]=\"tab.titleTemplate\" *ngIf=\"!!tab.titleTemplate\"></ng-container>\n                </div>\n                <button monaButton [flat]=\"true\" [disabled]=\"tab.disabled\" *ngIf=\"(tab.closable===true) || (closable && tab.closable==null)\" class=\"mona-tab-close\" (click)=\"onTabClose(tab, $event)\">\n                    <fa-icon [icon]=\"tabCloseIcon\"></fa-icon>\n                </button>\n            </li>\n        </ul>\n        <div class=\"mona-tab-strip-scroll\">\n            <button monaButton (click)=\"startScrolling(tabListElement, 'right', 'single')\"\n                    (mousedown)=\"startScrolling(tabListElement, 'right', 'continuous')\" (mouseup)=\"stopScrolling()\">\n                <fa-icon [icon]=\"scrollRightIcon\"></fa-icon>\n            </button>\n        </div>\n    </div>\n    <ng-container *ngFor=\"let tab of tabComponents\">\n        <div class=\"mona-tab-content\" [ngClass]=\"{'mona-tab-hidden': keepTabContent && !tab.selected}\"\n             *ngIf=\"keepTabContent || tab.selected\">\n            <ng-container [ngTemplateOutlet]=\"tab.contentTemplate\"></ng-container>\n        </div>\n    </ng-container>\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-tab-strip{width:100%;height:100%;border:1px solid var(--mona-border-color)}div.mona-tab-strip-tabs{width:100%;height:var(--mona-input-height);background:1px solid var(--mona-background-dark);border-bottom:1px solid var(--mona-border-color);display:flex}ul.mona-tab-list{list-style-type:none;width:100%;height:100%;display:flex;cursor:default;-webkit-user-select:none;user-select:none;font-size:12px;white-space:nowrap;overflow:hidden;background:var(--mona-background-dark)}ul.mona-tab-list li{list-style-type:none;height:100%;display:flex;align-items:center;justify-content:center;color:var(--mona-text);border-right:1px solid var(--mona-border-color);cursor:pointer}ul.mona-tab-list li.mona-tab-active{font-weight:700;background:var(--mona-background);color:var(--mona-primary)}ul.mona-tab-list li button.mona-tab-close{display:flex;align-items:center;justify-content:center}ul.mona-tab-list li button.mona-tab-close fa-icon{margin-top:2px}div.mona-tab-title{padding:5px 10px}div.mona-tab-strip-scroll{width:var(--mona-input-height);height:100%;display:flex;align-items:center;justify-content:center;background:var(--mona-background-dark);color:var(--mona-text)}div.mona-tab-strip-scroll button[monaButton]{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:transparent;border:none;color:var(--mona-text);cursor:pointer;box-shadow:none}div.mona-tab-strip-scroll button[monaButton]:hover{background:var(--mona-background-darker)}div.mona-tab-content{width:100%;height:calc(100% - var(--mona-input-height));background:var(--mona-background-light);overflow:auto}div.mona-tab-hidden{display:none}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { closable: [{
                type: Input
            }], keepTabContent: [{
                type: Input
            }], tabClose: [{
                type: Output
            }], tabComponents: [{
                type: ContentChildren,
                args: [TabComponent]
            }] } });

class TabStripModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabStripModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TabStripModule, declarations: [TabStripComponent, TabComponent, TabContentTemplateDirective, TabTitleTemplateDirective], imports: [CommonModule, FontAwesomeModule, ButtonModule], exports: [TabComponent, TabStripComponent, TabContentTemplateDirective, TabTitleTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabStripModule, imports: [CommonModule, FontAwesomeModule, ButtonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TabStripModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TabStripComponent, TabComponent, TabContentTemplateDirective, TabTitleTemplateDirective],
                    imports: [CommonModule, FontAwesomeModule, ButtonModule],
                    exports: [TabComponent, TabStripComponent, TabContentTemplateDirective, TabTitleTemplateDirective]
                }]
        }] });

class LayoutModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, imports: [CommonModule], exports: [ExpansionPanelModule, SplitterModule, StepperModule, TabStripModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, imports: [CommonModule, ExpansionPanelModule, SplitterModule, StepperModule, TabStripModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: LayoutModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [ExpansionPanelModule, SplitterModule, StepperModule, TabStripModule]
                }]
        }] });

class MenuTextTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuTextTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MenuTextTemplateDirective, selector: "ng-template[monaMenuTextTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuTextTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaMenuTextTemplate]"
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

class MenuComponent {
    constructor() {
        this.uid = v4();
        this.contextMenu = null;
        this.disabled = false;
        this.menuItemComponents = new QueryList();
        this.menuItems = [];
        this.text = "";
        this.textTemplate = null;
    }
    ngAfterContentInit() {
        if (this.menuItems.length > 0) {
            return;
        }
        this.createMenuItems();
        this.initializeMenuItems(this.menuItems);
        this.menuItemComponents.changes.subscribe(() => {
            this.createMenuItems();
            this.initializeMenuItems(this.menuItems);
        });
    }
    ngOnInit() { }
    createMenuItems() {
        this.menuItems = this.menuItemComponents.map(i => i.getMenuItem());
    }
    initializeMenuItems(items) {
        items.forEach(i => {
            i.visible = i.visible !== false;
            this.initializeMenuItems(i.subMenuItems ?? []);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MenuComponent, selector: "mona-menu", inputs: { disabled: "disabled", menuItems: "menuItems", text: "text" }, queries: [{ propertyName: "textTemplate", first: true, predicate: MenuTextTemplateDirective, descendants: true }, { propertyName: "menuItemComponents", predicate: MenuItemComponent }], ngImport: i0, template: "", isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenuComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-menu", template: "" }]
        }], ctorParameters: function () { return []; }, propDecorators: { disabled: [{
                type: Input
            }], menuItemComponents: [{
                type: ContentChildren,
                args: [MenuItemComponent]
            }], menuItems: [{
                type: Input
            }], text: [{
                type: Input
            }], textTemplate: [{
                type: ContentChild,
                args: [MenuTextTemplateDirective]
            }] } });

class MenubarComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.componentDestroy$ = new Subject();
        this.contextMenuComponents = new QueryList();
        this.currentContextMenu = null;
        this.menuList = new QueryList();
    }
    ngAfterContentInit() {
        this.menuList.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(event => {
            this.cdr.detectChanges();
            this.currentContextMenu?.closeMenu();
            this.currentContextMenu = null;
        });
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.cdr.detectChanges();
        });
        const pairContext = () => {
            Enumerable.from(this.menuList)
                .zip(Enumerable.from(this.contextMenuComponents))
                .forEach(([menu, context]) => {
                menu.contextMenu = context;
            });
        };
        pairContext();
        this.contextMenuComponents.changes.pipe(takeUntil(this.componentDestroy$)).subscribe(() => {
            this.contextMenuComponents.forEach(c => c.setPrecise(false));
            this.cdr.detectChanges();
            pairContext();
        });
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() { }
    onContextMenuClose(event) {
        if (event.uid === this.currentContextMenu?.uid) {
            this.currentContextMenu = null;
            this.cdr.detectChanges();
        }
    }
    onContextMenuNavigate(event) {
        if (event.direction === "right") {
            if (event.currentItem == null) {
                const index = this.findNextNonDisabledMenuIndex();
                if (index >= 0) {
                    this.currentContextMenu?.closeMenu();
                    this.currentContextMenu = this.menuList.toArray()[index].contextMenu;
                    this.currentContextMenu?.openMenu();
                }
            }
        }
        else if (event.direction === "left") {
            if (event.currentItem == null) {
                const index = this.findPreviousNonDisabledMenuIndex();
                if (index >= 0) {
                    this.currentContextMenu?.closeMenu();
                    this.currentContextMenu = this.menuList.toArray()[index].contextMenu;
                    this.currentContextMenu?.openMenu();
                }
            }
        }
    }
    onContextMenuOpen(event) {
        if (this.currentContextMenu?.uid === event.uid) {
            return;
        }
        this.contextMenuComponents.forEach(c => {
            if (c.uid !== event.uid) {
                c.closeMenu();
            }
        });
        this.currentContextMenu = this.contextMenuComponents.find(c => c.uid === event.uid) ?? null;
        this.cdr.detectChanges();
    }
    onMenuClick(ctx) {
        if (this.currentContextMenu?.uid === ctx.uid) {
            this.currentContextMenu.closeMenu();
            this.currentContextMenu = null;
            return;
        }
        this.contextMenuComponents.forEach(c => {
            if (c !== ctx) {
                c.closeMenu();
            }
        });
        this.currentContextMenu = ctx;
    }
    onMenuMouseEnter(ctx) {
        if (!this.currentContextMenu) {
            return;
        }
        if (this.currentContextMenu !== ctx) {
            this.currentContextMenu.closeMenu();
            this.currentContextMenu = ctx;
            this.currentContextMenu.openMenu();
            this.cdr.detectChanges();
        }
    }
    findNextNonDisabledMenuIndex() {
        const index = Enumerable.from(this.menuList)
            .toArray()
            .findIndex(n => n.contextMenu === this.currentContextMenu);
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList.toArray());
        Collections.rotate(list, -index);
        const next = list.skip(1).firstOrDefault(m => !m.disabled);
        if (next) {
            return this.menuList.toArray().findIndex(m => m === next);
        }
        return -1;
    }
    findPreviousNonDisabledMenuIndex() {
        const index = Enumerable.from(this.menuList)
            .toArray()
            .findIndex(n => n.contextMenu === this.currentContextMenu);
        if (index < 0) {
            return -1;
        }
        const list = new List(this.menuList.toArray());
        Collections.rotate(list, -index);
        const next = list.reverse().firstOrDefault(m => !m.disabled);
        if (next) {
            return this.menuList.toArray().findIndex(m => m === next);
        }
        return -1;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MenubarComponent, selector: "mona-menubar", queries: [{ propertyName: "menuList", predicate: MenuComponent }], viewQueries: [{ propertyName: "contextMenuComponents", predicate: ContextMenuComponent, descendants: true }], ngImport: i0, template: "<ul class=\"mona-menubar\">\n    <ng-container *ngFor=\"let item of menuList\">\n        <li [attr.data-uid]=\"item.uid\" (click)=\"onMenuClick(contextMenuComponent)\" (mouseenter)=\"onMenuMouseEnter(contextMenuComponent)\"\n            [ngClass]=\"{'mona-active': currentContextMenu?.uid===contextMenuComponent.uid, 'mona-disabled': item.disabled}\" #listItemElement>\n            <span *ngIf=\"!item.textTemplate\">{{item.text}}</span>\n            <ng-container [ngTemplateOutlet]=\"item.textTemplate?.templateRef ?? null\" [ngTemplateOutletContext]=\"{$implicit: item.text, items: item.menuItems}\"\n                          *ngIf=\"!!item.textTemplate?.templateRef\"></ng-container>\n            <mona-contextmenu [target]=\"listItemElement\" [menuItems]=\"item.menuItems\" trigger=\"click\"\n                              (navigate)=\"onContextMenuNavigate($event)\"\n                              (close)=\"onContextMenuClose($event)\" (open)=\"onContextMenuOpen($event)\" #contextMenuComponent></mona-contextmenu>\n        </li>\n    </ng-container>\n</ul>\n", styles: ["ul.mona-menubar{width:100%;height:var(--mona-input-height);list-style:none;display:flex;align-items:center;cursor:default;-webkit-user-select:none;user-select:none}ul.mona-menubar li{height:100%;display:flex;align-items:center;justify-content:center;padding:0 10px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: ContextMenuComponent, selector: "mona-contextmenu", inputs: ["menuItems", "minWidth", "offset", "popupClass", "target", "trigger", "width"], outputs: ["close", "navigate", "open"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-menubar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ul class=\"mona-menubar\">\n    <ng-container *ngFor=\"let item of menuList\">\n        <li [attr.data-uid]=\"item.uid\" (click)=\"onMenuClick(contextMenuComponent)\" (mouseenter)=\"onMenuMouseEnter(contextMenuComponent)\"\n            [ngClass]=\"{'mona-active': currentContextMenu?.uid===contextMenuComponent.uid, 'mona-disabled': item.disabled}\" #listItemElement>\n            <span *ngIf=\"!item.textTemplate\">{{item.text}}</span>\n            <ng-container [ngTemplateOutlet]=\"item.textTemplate?.templateRef ?? null\" [ngTemplateOutletContext]=\"{$implicit: item.text, items: item.menuItems}\"\n                          *ngIf=\"!!item.textTemplate?.templateRef\"></ng-container>\n            <mona-contextmenu [target]=\"listItemElement\" [menuItems]=\"item.menuItems\" trigger=\"click\"\n                              (navigate)=\"onContextMenuNavigate($event)\"\n                              (close)=\"onContextMenuClose($event)\" (open)=\"onContextMenuOpen($event)\" #contextMenuComponent></mona-contextmenu>\n        </li>\n    </ng-container>\n</ul>\n", styles: ["ul.mona-menubar{width:100%;height:var(--mona-input-height);list-style:none;display:flex;align-items:center;cursor:default;-webkit-user-select:none;user-select:none}ul.mona-menubar li{height:100%;display:flex;align-items:center;justify-content:center;padding:0 10px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { contextMenuComponents: [{
                type: ViewChildren,
                args: [ContextMenuComponent]
            }], menuList: [{
                type: ContentChildren,
                args: [MenuComponent]
            }] } });

class MenubarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, declarations: [MenubarComponent, MenuComponent, MenuTextTemplateDirective], imports: [CommonModule, ContextMenuModule], exports: [MenubarComponent, MenuComponent, MenuTextTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, imports: [CommonModule, ContextMenuModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenubarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [MenubarComponent, MenuComponent, MenuTextTemplateDirective],
                    imports: [CommonModule, ContextMenuModule],
                    exports: [MenubarComponent, MenuComponent, MenuTextTemplateDirective]
                }]
        }] });

class MenusModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenusModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MenusModule, exports: [ContextMenuModule, MenubarModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenusModule, imports: [ContextMenuModule, MenubarModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MenusModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [],
                    exports: [ContextMenuModule, MenubarModule]
                }]
        }] });

class CircularProgressBarLabelTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarLabelTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: CircularProgressBarLabelTemplateDirective, selector: "ng-template[monaCircularProgressBarLabelTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarLabelTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaCircularProgressBarLabelTemplate]"
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

class CircularProgressBarComponent {
    set value(value) {
        this.updateProgress(value);
    }
    constructor() {
        this.circumference = 0;
        this.color = "var(--mona-primary)";
        this.disabled = false;
        this.indeterminate = false;
        this.labelTemplateDirective = null;
        this.max = 100;
        this.min = 0;
        this.progress = 0;
        this.size = 100;
        this.thickness = 5;
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.updateProgress(this.progress);
        });
    }
    ngOnInit() {
        this.circumference = 2 * Math.PI * (this.size / 2 - this.thickness);
    }
    updateProgress(value) {
        this.progress = ((value - this.min) / (this.max - this.min)) * 100;
    }
    get sizePx() {
        return `${this.size}px`;
    }
    get strokeColor() {
        return typeof this.color === "string" ? this.color : this.color(this.progress);
    }
    get strokeDashOffset() {
        const dashOffset = this.circumference * (1 - this.progress / 100);
        return this.indeterminate ? this.circumference / 1.42 : dashOffset;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: CircularProgressBarComponent, selector: "mona-circular-progress-bar", inputs: { color: "color", disabled: "disabled", indeterminate: "indeterminate", max: "max", min: "min", progress: "progress", size: "size", thickness: "thickness", value: "value" }, queries: [{ propertyName: "labelTemplateDirective", first: true, predicate: CircularProgressBarLabelTemplateDirective, descendants: true }], ngImport: i0, template: "<div class=\"mona-circular-progress-bar\" [ngStyle]=\"{'width': sizePx, 'height': sizePx}\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <svg>\n        <circle [attr.cx]=\"size/2\" [attr.cy]=\"size/2\" [attr.r]=\"size/2 - thickness\" [attr.stroke]=\"strokeColor\"\n                [attr.stroke-dasharray]=\"circumference\" [attr.stroke-dashoffset]=\"strokeDashOffset\"\n                [attr.stroke-width]=\"thickness\" fill=\"transparent\" [ngClass]=\"{'mona-circular-progress-bar-indeterminate': indeterminate}\" />\n    </svg>\n    <div class=\"mona-circular-progress-bar-label\" *ngIf=\"!indeterminate\">\n        <ng-container *ngIf=\"!labelTemplateDirective\">{{progress}}%</ng-container>\n        <ng-container [ngTemplateOutlet]=\"labelTemplateDirective.templateRef\" [ngTemplateOutletContext]=\"{$implicit: progress}\"\n                      *ngIf=\"!!labelTemplateDirective\"></ng-container>\n    </div>\n</div>\n", styles: ["div.mona-circular-progress-bar{display:flex;align-items:center;justify-content:center;position:relative}svg{width:100%;height:100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}circle{transform-origin:center;transform:rotate(-90deg);transition:stroke-dashoffset .35s linear,stroke .35s linear}.mona-circular-progress-bar-indeterminate{animation:rotate 2s linear infinite}@keyframes rotate{0%{transform:rotate(0)}50%{transform:rotate(180deg)}to{transform:rotate(360deg)}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-circular-progress-bar", template: "<div class=\"mona-circular-progress-bar\" [ngStyle]=\"{'width': sizePx, 'height': sizePx}\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <svg>\n        <circle [attr.cx]=\"size/2\" [attr.cy]=\"size/2\" [attr.r]=\"size/2 - thickness\" [attr.stroke]=\"strokeColor\"\n                [attr.stroke-dasharray]=\"circumference\" [attr.stroke-dashoffset]=\"strokeDashOffset\"\n                [attr.stroke-width]=\"thickness\" fill=\"transparent\" [ngClass]=\"{'mona-circular-progress-bar-indeterminate': indeterminate}\" />\n    </svg>\n    <div class=\"mona-circular-progress-bar-label\" *ngIf=\"!indeterminate\">\n        <ng-container *ngIf=\"!labelTemplateDirective\">{{progress}}%</ng-container>\n        <ng-container [ngTemplateOutlet]=\"labelTemplateDirective.templateRef\" [ngTemplateOutletContext]=\"{$implicit: progress}\"\n                      *ngIf=\"!!labelTemplateDirective\"></ng-container>\n    </div>\n</div>\n", styles: ["div.mona-circular-progress-bar{display:flex;align-items:center;justify-content:center;position:relative}svg{width:100%;height:100%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}circle{transform-origin:center;transform:rotate(-90deg);transition:stroke-dashoffset .35s linear,stroke .35s linear}.mona-circular-progress-bar-indeterminate{animation:rotate 2s linear infinite}@keyframes rotate{0%{transform:rotate(0)}50%{transform:rotate(180deg)}to{transform:rotate(360deg)}}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { color: [{
                type: Input
            }], disabled: [{
                type: Input
            }], indeterminate: [{
                type: Input
            }], labelTemplateDirective: [{
                type: ContentChild,
                args: [CircularProgressBarLabelTemplateDirective]
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], progress: [{
                type: Input
            }], size: [{
                type: Input
            }], thickness: [{
                type: Input
            }], value: [{
                type: Input
            }] } });

class CircularProgressBarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, declarations: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective], imports: [CommonModule], exports: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: CircularProgressBarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective],
                    imports: [CommonModule],
                    exports: [CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective]
                }]
        }] });

class ProgressBarComponent {
    set value(value) {
        this.updateProgress(value);
    }
    constructor(elementRef, cdr) {
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.progress = 0;
        this.rightClip = -1;
        this.color = "var(--mona-primary)";
        this.disabled = false;
        this.indeterminate = false;
        this.labelPosition = "center";
        this.labelStyles = {};
        this.labelVisible = true;
        this.max = 100;
        this.min = 0;
    }
    ngAfterViewInit() {
        window.setTimeout(() => {
            this.updateProgress(this.progress);
        });
    }
    ngOnInit() { }
    updateProgress(value) {
        const oldProgress = this.progress;
        this.progress = ((value - this.min) / (this.max - this.min)) * 100;
        this.updateProgressStyle(oldProgress, this.progress);
    }
    updateProgressStyle(oldProgress, newProgress) {
        if (oldProgress !== 100 && newProgress === 100) {
            asapScheduler.schedule(() => {
                this.rightClip = 1;
                this.cdr.detectChanges();
            }, 350);
        }
        else {
            this.rightClip = -1;
            this.cdr.detectChanges();
            asapScheduler.schedule(() => {
                this.cdr.detectChanges();
            });
        }
    }
    get label() {
        return this.labelFormat?.(this.progress) ?? `${this.progress}%`;
    }
    get progressColor() {
        return typeof this.color === "function" ? this.color(this.progress) : this.color;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarComponent, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: ProgressBarComponent, selector: "mona-progress-bar", inputs: { color: "color", disabled: "disabled", indeterminate: "indeterminate", labelFormat: "labelFormat", labelPosition: "labelPosition", labelStyles: "labelStyles", labelVisible: "labelVisible", max: "max", min: "min", value: "value" }, ngImport: i0, template: "<div class=\"mona-progress-bar\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <div class=\"mona-progress-bar-track mona-progress-bar-track-prev\" [ngStyle]=\"{'background-color': progressColor}\"\n         [ngClass]=\"{'mona-progress-left': labelPosition==='start', 'mona-progress-right': labelPosition==='end', 'mona-progress-bar-label-hidden': !labelVisible, 'mona-progress-bar-indeterminate': indeterminate}\">\n        <ng-container *ngIf=\"labelVisible && !indeterminate\">\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"!labelFormat\">{{progress | number:'1.0-2'}}%</span>\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"labelFormat\">{{label}}</span>\n        </ng-container>\n    </div>\n    <div class=\"mona-progress-bar-track mona-progress-bar-track-next indeterminate\"\n         [ngClass]=\"{'mona-progress-left': labelPosition==='start', 'mona-progress-right': labelPosition==='end', 'mona-progress-bar-label-hidden': !labelVisible, 'mona-progress-bar-indeterminate': indeterminate}\"\n         [ngStyle]=\"{'clip-path': 'inset(-1px '+rightClip+'px -1px '+progress+'%)'}\">\n        <ng-container *ngIf=\"labelVisible && !indeterminate\">\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"!labelFormat\">{{progress | number:'1.0-2'}}%</span>\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"labelFormat\">{{label}}</span>\n        </ng-container>\n    </div>\n</div>\n", styles: ["div.mona-progress-bar{position:relative;display:flex;align-items:center;justify-content:center;width:100%}div.mona-progress-bar-track{font-size:12px;font-weight:400;display:flex;align-items:center;justify-content:center;width:100%;padding:3px 0}div.mona-progress-bar-track-prev{transition:background-color .35s linear}div.mona-progress-bar-track-next{position:absolute;transition:clip-path .35s linear}div.mona-progress-left{justify-content:flex-start}div.mona-progress-right{justify-content:flex-end}span.mona-progress-bar-label{padding:0 4px}div.mona-progress-bar-label-hidden{padding:10px 0}div.mona-progress-bar-indeterminate{background-size:200% 200%;animation:indeterminate 16s linear infinite;animation-direction:reverse;padding:10px 0}@keyframes indeterminate{to{background-position:100% 100%}}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "pipe", type: i1.DecimalPipe, name: "number" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-progress-bar", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-progress-bar\" [ngClass]=\"{'mona-disabled': disabled}\">\n    <div class=\"mona-progress-bar-track mona-progress-bar-track-prev\" [ngStyle]=\"{'background-color': progressColor}\"\n         [ngClass]=\"{'mona-progress-left': labelPosition==='start', 'mona-progress-right': labelPosition==='end', 'mona-progress-bar-label-hidden': !labelVisible, 'mona-progress-bar-indeterminate': indeterminate}\">\n        <ng-container *ngIf=\"labelVisible && !indeterminate\">\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"!labelFormat\">{{progress | number:'1.0-2'}}%</span>\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"labelFormat\">{{label}}</span>\n        </ng-container>\n    </div>\n    <div class=\"mona-progress-bar-track mona-progress-bar-track-next indeterminate\"\n         [ngClass]=\"{'mona-progress-left': labelPosition==='start', 'mona-progress-right': labelPosition==='end', 'mona-progress-bar-label-hidden': !labelVisible, 'mona-progress-bar-indeterminate': indeterminate}\"\n         [ngStyle]=\"{'clip-path': 'inset(-1px '+rightClip+'px -1px '+progress+'%)'}\">\n        <ng-container *ngIf=\"labelVisible && !indeterminate\">\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"!labelFormat\">{{progress | number:'1.0-2'}}%</span>\n            <span class=\"mona-progress-bar-label\" [ngStyle]=\"labelStyles\" *ngIf=\"labelFormat\">{{label}}</span>\n        </ng-container>\n    </div>\n</div>\n", styles: ["div.mona-progress-bar{position:relative;display:flex;align-items:center;justify-content:center;width:100%}div.mona-progress-bar-track{font-size:12px;font-weight:400;display:flex;align-items:center;justify-content:center;width:100%;padding:3px 0}div.mona-progress-bar-track-prev{transition:background-color .35s linear}div.mona-progress-bar-track-next{position:absolute;transition:clip-path .35s linear}div.mona-progress-left{justify-content:flex-start}div.mona-progress-right{justify-content:flex-end}span.mona-progress-bar-label{padding:0 4px}div.mona-progress-bar-label-hidden{padding:10px 0}div.mona-progress-bar-indeterminate{background-size:200% 200%;animation:indeterminate 16s linear infinite;animation-direction:reverse;padding:10px 0}@keyframes indeterminate{to{background-position:100% 100%}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { color: [{
                type: Input
            }], disabled: [{
                type: Input
            }], indeterminate: [{
                type: Input
            }], labelFormat: [{
                type: Input
            }], labelPosition: [{
                type: Input
            }], labelStyles: [{
                type: Input
            }], labelVisible: [{
                type: Input
            }], max: [{
                type: Input
            }], min: [{
                type: Input
            }], value: [{
                type: Input
            }] } });

class ProgressBarModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarModule, declarations: [ProgressBarComponent], imports: [CommonModule], exports: [ProgressBarComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ProgressBarComponent],
                    imports: [CommonModule],
                    exports: [ProgressBarComponent]
                }]
        }] });

class ProgressBarsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarsModule, imports: [CommonModule], exports: [CircularProgressBarModule, ProgressBarModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarsModule, imports: [CommonModule, CircularProgressBarModule, ProgressBarModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: ProgressBarsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: [CircularProgressBarModule, ProgressBarModule]
                }]
        }] });

const DefaultTooltipPositionMap = {
    top: [new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "start", overlayY: "bottom" })],
    bottom: [
        new ConnectionPositionPair({ originX: "start", originY: "bottom" }, { overlayX: "start", overlayY: "top" })
    ],
    left: [new ConnectionPositionPair({ originX: "start", originY: "top" }, { overlayX: "start", overlayY: "top" })],
    right: [new ConnectionPositionPair({ originX: "end", originY: "top" }, { overlayX: "start", overlayY: "top" })]
};

class TooltipComponent {
    constructor(elementRef, popupService) {
        this.elementRef = elementRef;
        this.popupService = popupService;
        this.componentDestroy$ = new Subject();
        this.uid = v4();
        this.position = "top";
    }
    ngOnInit() {
        if (!this.target) {
            throw new Error("Tooltip target is required.");
        }
        this.setSubscriptions();
    }
    calculateTopAndLeft() {
        let popupTop = 0;
        let popupLeft = 0;
        const anchorWidth = this.target instanceof Element
            ? this.target.offsetWidth
            : this.target.nativeElement.offsetWidth;
        const anchorHeight = this.target instanceof Element
            ? this.target.offsetHeight
            : this.target.nativeElement.offsetHeight;
        const popupWidth = this.tooltipElement?.offsetWidth ?? 0;
        const popupHeight = this.tooltipElement?.offsetHeight ?? 0;
        if (!this.tooltipOverlayElement) {
            return;
        }
        switch (this.position) {
            case "top":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${popupLeft}px, -12px, 0)`;
                break;
            case "bottom":
                popupLeft = (anchorWidth - popupWidth) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${popupLeft}px, 12px, 0)`;
                break;
            case "right":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(12px, ${popupTop}px, 0)`;
                break;
            case "left":
                popupTop = (anchorHeight - popupHeight) / 2;
                this.tooltipOverlayElement.style.transform = `translate3d(${-popupWidth - 12}px, ${popupTop}px, 0)`;
                break;
        }
    }
    setSubscriptions() {
        const target = this.target instanceof ElementRef ? this.target.nativeElement : this.target;
        fromEvent(target, "mouseenter")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            this.popupRef = this.popupService.create({
                content: this.templateRef,
                anchor: target,
                popupClass: "mona-tooltip-popup-content",
                hasBackdrop: false,
                positions: DefaultTooltipPositionMap[this.position],
                closeOnOutsideClick: true,
                withPush: false
            });
            this.popupRef.overlayRef.addPanelClass("mona-invisible-tooltip");
            window.setTimeout(() => {
                this.calculateTopAndLeft();
                this.popupRef?.overlayRef.removePanelClass("mona-invisible-tooltip");
            }, 100);
        });
        fromEvent(target, "mouseleave")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe((event) => {
            this.popupRef?.close();
        });
    }
    get tooltipElement() {
        return document.querySelector(`[data-uid='${this.uid}']`) ?? null;
    }
    get tooltipOverlayElement() {
        return this.tooltipElement?.parentElement ?? null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipComponent, deps: [{ token: i0.ElementRef }, { token: PopupService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TooltipComponent, selector: "mona-tooltip", inputs: { position: "position", target: "target" }, viewQueries: [{ propertyName: "templateRef", first: true, predicate: TemplateRef, descendants: true }], ngImport: i0, template: "<ng-template>\n    <div class=\"mona-tooltip\" [attr.data-uid]=\"uid\">\n        <div class=\"mona-tooltip-content\">\n            <ng-content></ng-content>\n        </div>\n        <div class=\"mona-tooltip-arrow\" [ngClass]=\"{'top':position==='top', 'bottom': position==='bottom', 'left': position==='left', 'right': position==='right'}\"></div>\n    </div>\n</ng-template>\n", styles: ["div.mona-tooltip{position:relative}div.mona-tooltip-content{width:100%;height:100%;padding:8px 10px;position:relative}div.mona-tooltip-arrow{width:12px;height:12px;box-sizing:border-box;position:absolute;pointer-events:none;background:var(--mona-background);transform-origin:center;transform:rotate(45deg);z-index:-1;box-shadow:var(--mona-popup-shadow)}div.mona-tooltip-arrow.bottom{top:-6px;left:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.top{bottom:-6px;left:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.right{left:-6px;top:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.left{right:-6px;top:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tooltip", template: "<ng-template>\n    <div class=\"mona-tooltip\" [attr.data-uid]=\"uid\">\n        <div class=\"mona-tooltip-content\">\n            <ng-content></ng-content>\n        </div>\n        <div class=\"mona-tooltip-arrow\" [ngClass]=\"{'top':position==='top', 'bottom': position==='bottom', 'left': position==='left', 'right': position==='right'}\"></div>\n    </div>\n</ng-template>\n", styles: ["div.mona-tooltip{position:relative}div.mona-tooltip-content{width:100%;height:100%;padding:8px 10px;position:relative}div.mona-tooltip-arrow{width:12px;height:12px;box-sizing:border-box;position:absolute;pointer-events:none;background:var(--mona-background);transform-origin:center;transform:rotate(45deg);z-index:-1;box-shadow:var(--mona-popup-shadow)}div.mona-tooltip-arrow.bottom{top:-6px;left:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.top{bottom:-6px;left:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.right{left:-6px;top:calc(50% - 6px);border-left:1px solid var(--mona-border-color);border-bottom:1px solid var(--mona-border-color)}div.mona-tooltip-arrow.left{right:-6px;top:calc(50% - 6px);border-right:1px solid var(--mona-border-color);border-top:1px solid var(--mona-border-color)}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: PopupService }]; }, propDecorators: { position: [{
                type: Input
            }], target: [{
                type: Input
            }], templateRef: [{
                type: ViewChild,
                args: [TemplateRef]
            }] } });

class TooltipModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TooltipModule, declarations: [TooltipComponent], imports: [CommonModule], exports: [TooltipComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [TooltipComponent],
                    imports: [CommonModule],
                    exports: [TooltipComponent]
                }]
        }] });

class TooltipsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TooltipsModule, exports: [TooltipModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipsModule, imports: [TooltipModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TooltipsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [],
                    exports: [TooltipModule]
                }]
        }] });

class NodeClickEvent extends PreventableEvent {
    constructor(node, event, type) {
        super(type, event);
        this.node = node;
    }
}

class NodeDragEndEvent {
    constructor(node, originalEvent) {
        this.node = node;
        this.originalEvent = originalEvent;
    }
}

class NodeDragStartEvent extends PreventableEvent {
    constructor(node, event) {
        super("dragstart", event);
        this.node = node;
    }
}

class NodeDragEvent {
    constructor(node, destinationNode, position, originalEvent) {
        this.node = node;
        this.destinationNode = destinationNode;
        this.position = position;
        this.originalEvent = originalEvent;
    }
}

class NodeDropEvent extends PreventableEvent {
    constructor(node, destinationNode, position, event) {
        super("drop", event);
        this.node = node;
        this.destinationNode = destinationNode;
        this.position = position;
    }
}

class NodeLookupItem {
    constructor(node) {
        this.checked = node.checked;
        this.data = node.data;
        this.disabled = node.disabled;
        this.expanded = node.expanded;
        this.indeterminate = node.indeterminate;
        this.key = node.key;
        this.nodes = node.nodes.map(node => new NodeLookupItem(node));
        this.selected = node.selected;
        this.text = node.text;
    }
}

class Node {
    constructor(options) {
        this.uid = v4();
        this.checked = false;
        this.disabled = false;
        this.expanded = false;
        this.focused = false;
        this.indeterminate = false;
        this.nodes = [];
        this.selected = false;
        this.text = "";
        this.checked = options.checked ?? false;
        this.data = options.data;
        this.disabled = options.disabled ?? false;
        this.expanded = options.expanded ?? false;
        this.indeterminate = options.indeterminate ?? false;
        this.key = options.key;
        this.nodes = options.nodes?.map(node => new Node(node)) ?? [];
        this.parent = options.parent;
        this.selected = options.selected ?? false;
        this.text = options.text ?? "";
    }
    anyParentCollapsed() {
        if (this.parent) {
            return !this.parent.expanded || this.parent.anyParentCollapsed();
        }
        return false;
    }
    check(options) {
        this.checked = options.checked;
        if (options.checkChildren) {
            this.nodes.forEach(node => node.check(options));
        }
        if (options.checkParent) {
            const siblings = this.parent?.nodes ?? [];
            const checkedSiblings = siblings.filter(sibling => sibling.checked);
            const indeterminateSiblings = siblings.filter(sibling => sibling.indeterminate);
            const allSiblingsChecked = checkedSiblings.length === siblings.length;
            const someSiblingsChecked = checkedSiblings.length > 0;
            const someSiblingsIndeterminate = indeterminateSiblings.length > 0;
            const parent = this.parent;
            if (parent) {
                parent.indeterminate = !allSiblingsChecked && (someSiblingsChecked || someSiblingsIndeterminate);
                parent.check({ checked: allSiblingsChecked, checkChildren: false, checkParent: true });
            }
        }
    }
    expand(expanded, expandChildren = false) {
        this.expanded = expanded;
        if (expandChildren) {
            this.nodes.forEach(node => node.expand(expanded, expandChildren));
        }
    }
    isDescendantOf(node) {
        if (this.parent) {
            return this.parent === node || this.parent.isDescendantOf(node);
        }
        return false;
    }
    getLookupItem() {
        return new NodeLookupItem(this);
    }
    setSelected(selected) {
        this.selected = selected;
    }
}

class TreeViewService {
    constructor() {
        this.checkableOptions = {
            checkChildren: true,
            mode: "multiple",
            checkParents: true,
            enabled: false
        };
        this.checkedKeys = new EnumerableSet();
        this.checkedKeysChange = new EventEmitter();
        this.disabledKeys = new EnumerableSet();
        this.expandedKeys = new EnumerableSet();
        this.expandedKeysChange = new EventEmitter();
        this.nodeDictionary = new Dictionary();
        this.nodeList = [];
        this.selectableOptions = {
            childrenOnly: false,
            enabled: false,
            mode: "single"
        };
        this.selectedKeys = new EnumerableSet();
        this.selectedKeysChange = new EventEmitter();
        this.viewNodeList = [];
    }
    static getNodeDisablerAction(disabler) {
        if (typeof disabler === "string") {
            return (item) => !!item?.[disabler] ?? false;
        }
        return disabler;
    }
    loadCheckedKeys(checkedKeys) {
        const checkedKeySet = new SortedSet(checkedKeys);
        for (const [uid, node] of this.nodeDictionary.entries()) {
            node.checked = checkedKeySet.contains(node.key);
        }
        for (const node of this.nodeDictionary.values()) {
            if (node.nodes.length > 0) {
                if (this.checkableOptions.checkChildren && checkedKeySet.contains(node.key)) {
                    node.check({ checked: true, checkChildren: true, checkParent: false });
                }
                if (this.checkableOptions.checkParents) {
                    node.indeterminate =
                        !node.checked && node.nodes.some(childNode => childNode.checked || childNode.indeterminate);
                }
            }
        }
    }
    loadDisabledKeys(disabledKeys) {
        const disabledKeySet = new SortedSet(disabledKeys);
        const disable = (node, disabled) => {
            node.disabled = disabled ?? disabledKeySet.contains(node.key);
            if (!node.disabled && disabled == null) {
                node.nodes.forEach(childNode => disable(childNode));
            }
            else if (!node.disabled) {
                node.nodes.forEach(childNode => disable(childNode, false));
            }
            else {
                node.nodes.forEach(childNode => disable(childNode, true));
            }
        };
        for (const node of this.nodeList) {
            disable(node);
        }
    }
    loadExpandedKeys(expandedKeys) {
        const expandedKeySet = new SortedSet(expandedKeys);
        for (const key of expandedKeySet) {
            const node = this.nodeDictionary.firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                node.expand(true);
            }
        }
    }
    loadSelectedKeys(selectedKeys) {
        const selectedKeySet = new SortedSet(selectedKeys);
        for (const key of selectedKeySet) {
            const node = this.nodeDictionary.firstOrDefault(n => n.value.key === key)?.value;
            if (node) {
                node.setSelected(true);
            }
        }
    }
    setCheckableOptions(options) {
        this.checkableOptions = { ...this.checkableOptions, ...options };
    }
    setSelectableOptions(options) {
        this.selectableOptions = { ...this.selectableOptions, ...options };
    }
    toggleNodeCheck(node, checked) {
        if (node.disabled) {
            return;
        }
        if (this.checkableOptions?.mode === "single") {
            this.uncheckAllNodes();
        }
        node.check({
            checked: checked ?? !node.checked,
            checkChildren: this.checkableOptions?.checkChildren,
            checkParent: this.checkableOptions?.checkParents
        });
        const checkedKeys = this.nodeDictionary
            .where(n => n.value.checked)
            .select(n => n.value.key)
            .toArray();
        this.checkedKeysChange.emit(checkedKeys);
    }
    toggleNodeExpand(node, expand) {
        if (node.nodes.length === 0) {
            return;
        }
        node.expand(expand ?? !node.expanded, false);
        const expandedKeys = this.nodeDictionary
            .where(n => n.value.expanded)
            .select(n => n.value.key)
            .toArray();
        this.expandedKeysChange.emit(expandedKeys);
    }
    toggleNodeSelection(node) {
        if (!this.selectableOptions.enabled) {
            return;
        }
        if (this.selectableOptions.childrenOnly && node.nodes.length > 0) {
            return;
        }
        if (node.disabled) {
            return;
        }
        if (node.selected) {
            node.setSelected(false);
            this.lastSelectedNode = undefined;
        }
        else {
            if (this.selectableOptions.mode === "single") {
                if (this.lastSelectedNode) {
                    this.lastSelectedNode.setSelected(false);
                }
            }
            node.setSelected(true);
            node.focused = true;
            this.lastSelectedNode = node;
        }
        const selectedKeys = this.nodeDictionary
            .where(n => n.value.selected)
            .select(n => n.value.key)
            .toArray();
        this.selectedKeysChange.emit(selectedKeys);
    }
    uncheckAllNodes() {
        this.nodeList.forEach(node => node.check({ checked: false, checkChildren: true, checkParent: true }));
    }
    updateNodeCheckStatus(node) {
        if (node.nodes.length > 0) {
            const allChecked = node.nodes.every(childNode => childNode.checked);
            const someChecked = node.nodes.some(childNode => childNode.checked);
            const someIndeterminate = node.nodes.some(childNode => childNode.indeterminate);
            node.checked = allChecked;
            node.indeterminate = someIndeterminate || (!allChecked && someChecked);
        }
        else {
            node.indeterminate = false;
        }
        let parent = node.parent;
        while (parent) {
            const allChecked = parent.nodes.every(childNode => childNode.checked);
            const someChecked = parent.nodes.some(childNode => childNode.checked);
            const someIndeterminate = parent.nodes.some(childNode => childNode.indeterminate);
            parent.checked = allChecked;
            parent.indeterminate = someIndeterminate || (!allChecked && someChecked);
            parent = parent.parent;
        }
        const checkedKeys = this.nodeDictionary
            .where(n => n.value.checked)
            .select(n => n.value.key)
            .toArray();
        this.checkedKeysChange.emit(checkedKeys);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class TreeViewNodeTextTemplateDirective {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewNodeTextTemplateDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewNodeTextTemplateDirective, selector: "ng-template[monaTreeViewNodeTextTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewNodeTextTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaTreeViewNodeTextTemplate]"
                }]
        }], ctorParameters: function () { return []; } });

class TreeViewNodeComponent {
    constructor(elementRef, treeViewService) {
        this.elementRef = elementRef;
        this.treeViewService = treeViewService;
        this.componentDestroy$ = new Subject();
        this.click$ = new Subject();
        this.collapseIcon = faChevronDown;
        this.dropMagnetIcon = faCaretRight;
        this.expandIcon = faChevronRight;
        this.dropMagnetVisible = false;
        this.dragging = false;
        this.dropPositionChange = new EventEmitter();
        this.nodeClick = new EventEmitter();
        this.nodeDoubleClick = new EventEmitter();
        this.nodeSelect = new EventEmitter();
        this.nodeTextTemplate = null;
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        this.setSubscriptions();
    }
    onCheckToggle(checked) {
        this.treeViewService.toggleNodeCheck(this.node, checked);
    }
    onExpandToggle(event) {
        this.treeViewService.toggleNodeExpand(this.node);
    }
    onMouseEnter(event) {
        if (!this.dragging) {
            return;
        }
        this.dropMagnetVisible = true;
    }
    onMouseLeave(event) {
        this.dropMagnetVisible = false;
        this.dropPosition = undefined;
        if (!this.dragging) {
            return;
        }
    }
    onMouseMove(event) {
        if (!this.dragging) {
            return;
        }
        const rect = this.elementRef.nativeElement.getBoundingClientRect();
        let node;
        if (event.clientY > rect.top && event.clientY - rect.top <= 5) {
            this.dropPosition = "before";
            node = this.node;
        }
        else if (event.clientY < rect.bottom && rect.bottom - event.clientY <= 5) {
            this.dropPosition = "after";
            node = this.node;
        }
        else if (event.clientY <= rect.top || event.clientY >= rect.bottom) {
            this.dropPosition = undefined;
            node = undefined;
        }
        else {
            this.dropPosition = "inside";
            node = this.node;
        }
        if (this.dropPosition) {
            this.dropPositionChange.emit({
                position: this.dropPosition,
                node
            });
        }
    }
    onNodeDoubleClick(event) {
        if (this.node.disabled) {
            return;
        }
        const clickEvent = new NodeClickEvent(this.node.getLookupItem(), event, "dblclick");
        this.nodeDoubleClick.emit(clickEvent);
    }
    onNodeClick(event, type) {
        if (this.node.disabled) {
            return;
        }
        const clickEvent = new NodeClickEvent(this.node.getLookupItem(), event, type);
        this.nodeClick.emit(clickEvent);
        if (clickEvent.isDefaultPrevented()) {
            return;
        }
        if (event.type === "click") {
            this.treeViewService.toggleNodeSelection(this.node);
            this.nodeSelect.emit(this.node);
        }
    }
    setActiveStyles() {
        this.node.focused = true;
    }
    setInactiveStyles() {
        this.node.focused = false;
    }
    setSubscriptions() {
        this.click$
            .pipe(takeUntil(this.componentDestroy$), 
        // debounceTime(350),
        switchMap(event => of({ event, type: event.type })))
            .subscribe(result => {
            if (result.type === "dblclick") {
                this.onNodeDoubleClick(result.event);
            }
            else {
                this.onNodeClick(result.event, "click");
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewNodeComponent, deps: [{ token: i0.ElementRef }, { token: TreeViewService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewNodeComponent, selector: "mona-tree-view-node", inputs: { dragging: "dragging", node: "node", nodeTextTemplate: "nodeTextTemplate" }, outputs: { dropPositionChange: "dropPositionChange", nodeClick: "nodeClick", nodeDoubleClick: "nodeDoubleClick", nodeSelect: "nodeSelect" }, ngImport: i0, template: "<div class=\"mona-tree-view-node\"\n     (mouseenter)=\"onMouseEnter($event)\" (mouseleave)=\"onMouseLeave($event)\" (mousemove)=\"onMouseMove($event)\">\n    <div class=\"mona-tree-view-drop-magnet\" *ngIf=\"dragging && dropMagnetVisible && dropPosition==='before'\" [attr.data-nid]=\"node.uid\" [attr.data-pos]=\"'before'\">\n        <fa-icon [icon]=\"dropMagnetIcon\"></fa-icon>\n        <div></div>\n    </div>\n    <div class=\"mona-tree-node-expander\" (click)=\"onExpandToggle($event)\" [ngClass]=\"{'mona-interactive': node.nodes.length !== 0, 'mona-disabled': node.disabled}\">\n        <fa-icon [icon]=\"expandIcon\" *ngIf=\"node.nodes.length !== 0 && !node.expanded\"></fa-icon>\n        <fa-icon [icon]=\"collapseIcon\" *ngIf=\"node.nodes.length !== 0 && node.expanded\"></fa-icon>\n    </div>\n    <div class=\"mona-tree-node-content\"  [ngClass]=\"{'mona-disabled': node.disabled}\">\n        <input type=\"checkbox\" id=\"mona-tree-node-checkbox-{{node.uid}}\" [indeterminate]=\"node.indeterminate\" [disabled]=\"node.disabled\"\n               [ngModel]=\"node.checked\" (ngModelChange)=\"onCheckToggle($event)\" monaCheckBox *ngIf=\"treeViewService.checkableOptions.enabled\">\n        <label for=\"mona-tree-node-checkbox-{{node.uid}}\"></label>\n        <div class=\"mona-tree-view-node-text\" [ngClass]=\"{'mona-tree-view-node-selected': node.selected, 'mona-tree-view-node-dropping': dragging && dropPosition==='inside', 'mona-tree-view-node-focused': node.focused}\"\n             (click)=\"click$.next($event)\"\n             (dblclick)=\"click$.next($event)\"\n             (contextmenu)=\"onNodeClick($event, 'contextmenu')\">\n            <ng-container *ngIf=\"!nodeTextTemplate\">{{node.text}}</ng-container>\n            <ng-container [ngTemplateOutlet]=\"nodeTextTemplate\" [ngTemplateOutletContext]=\"{$implicit: node.data, node: node}\" *ngIf=\"!!nodeTextTemplate\"></ng-container>\n        </div>\n    </div>\n    <div class=\"mona-tree-view-drop-magnet\" *ngIf=\"dragging && dropMagnetVisible && dropPosition==='after'\" [attr.data-nid]=\"node.uid\"[attr.data-pos]=\"'after'\">\n        <fa-icon [icon]=\"dropMagnetIcon\"></fa-icon>\n        <div></div>\n    </div>\n</div>\n", styles: [":host{position:relative}.mona-tree-view-node{display:flex;height:var(--mona-input-height);position:relative}div.mona-tree-node-expander{height:100%;width:16px;display:flex;align-items:center;justify-content:flex-start;color:var(--mona-text);-webkit-user-select:none;user-select:none;cursor:default;pointer-events:none}div.mona-tree-node-expander.mona-interactive{cursor:pointer;pointer-events:auto}div.mona-tree-node-content{flex:1;display:flex;align-items:center;justify-content:flex-start;min-width:0;-webkit-user-select:none;user-select:none}div.mona-tree-view-node-text{color:var(--mona-text);padding:5px;min-width:0;-webkit-user-select:none;user-select:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}div.mona-tree-view-drop-magnet{position:absolute;width:100%;height:4px;display:flex;align-items:center;justify-content:flex-start}div.mona-tree-view-drop-magnet>fa-icon{color:var(--mona-primary)}div.mona-tree-view-drop-magnet>div{width:10%;height:2px;margin-left:5px;background-color:var(--mona-primary)}div.mona-tree-view-drop-magnet:first-child{top:2px}div.mona-tree-view-drop-magnet:last-child{bottom:2px}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: CheckBoxDirective, selector: "input[type='checkbox'][monaCheckBox]" }, { kind: "directive", type: i5$1.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i5$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i5$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewNodeComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tree-view-node", template: "<div class=\"mona-tree-view-node\"\n     (mouseenter)=\"onMouseEnter($event)\" (mouseleave)=\"onMouseLeave($event)\" (mousemove)=\"onMouseMove($event)\">\n    <div class=\"mona-tree-view-drop-magnet\" *ngIf=\"dragging && dropMagnetVisible && dropPosition==='before'\" [attr.data-nid]=\"node.uid\" [attr.data-pos]=\"'before'\">\n        <fa-icon [icon]=\"dropMagnetIcon\"></fa-icon>\n        <div></div>\n    </div>\n    <div class=\"mona-tree-node-expander\" (click)=\"onExpandToggle($event)\" [ngClass]=\"{'mona-interactive': node.nodes.length !== 0, 'mona-disabled': node.disabled}\">\n        <fa-icon [icon]=\"expandIcon\" *ngIf=\"node.nodes.length !== 0 && !node.expanded\"></fa-icon>\n        <fa-icon [icon]=\"collapseIcon\" *ngIf=\"node.nodes.length !== 0 && node.expanded\"></fa-icon>\n    </div>\n    <div class=\"mona-tree-node-content\"  [ngClass]=\"{'mona-disabled': node.disabled}\">\n        <input type=\"checkbox\" id=\"mona-tree-node-checkbox-{{node.uid}}\" [indeterminate]=\"node.indeterminate\" [disabled]=\"node.disabled\"\n               [ngModel]=\"node.checked\" (ngModelChange)=\"onCheckToggle($event)\" monaCheckBox *ngIf=\"treeViewService.checkableOptions.enabled\">\n        <label for=\"mona-tree-node-checkbox-{{node.uid}}\"></label>\n        <div class=\"mona-tree-view-node-text\" [ngClass]=\"{'mona-tree-view-node-selected': node.selected, 'mona-tree-view-node-dropping': dragging && dropPosition==='inside', 'mona-tree-view-node-focused': node.focused}\"\n             (click)=\"click$.next($event)\"\n             (dblclick)=\"click$.next($event)\"\n             (contextmenu)=\"onNodeClick($event, 'contextmenu')\">\n            <ng-container *ngIf=\"!nodeTextTemplate\">{{node.text}}</ng-container>\n            <ng-container [ngTemplateOutlet]=\"nodeTextTemplate\" [ngTemplateOutletContext]=\"{$implicit: node.data, node: node}\" *ngIf=\"!!nodeTextTemplate\"></ng-container>\n        </div>\n    </div>\n    <div class=\"mona-tree-view-drop-magnet\" *ngIf=\"dragging && dropMagnetVisible && dropPosition==='after'\" [attr.data-nid]=\"node.uid\"[attr.data-pos]=\"'after'\">\n        <fa-icon [icon]=\"dropMagnetIcon\"></fa-icon>\n        <div></div>\n    </div>\n</div>\n", styles: [":host{position:relative}.mona-tree-view-node{display:flex;height:var(--mona-input-height);position:relative}div.mona-tree-node-expander{height:100%;width:16px;display:flex;align-items:center;justify-content:flex-start;color:var(--mona-text);-webkit-user-select:none;user-select:none;cursor:default;pointer-events:none}div.mona-tree-node-expander.mona-interactive{cursor:pointer;pointer-events:auto}div.mona-tree-node-content{flex:1;display:flex;align-items:center;justify-content:flex-start;min-width:0;-webkit-user-select:none;user-select:none}div.mona-tree-view-node-text{color:var(--mona-text);padding:5px;min-width:0;-webkit-user-select:none;user-select:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}div.mona-tree-view-drop-magnet{position:absolute;width:100%;height:4px;display:flex;align-items:center;justify-content:flex-start}div.mona-tree-view-drop-magnet>fa-icon{color:var(--mona-primary)}div.mona-tree-view-drop-magnet>div{width:10%;height:2px;margin-left:5px;background-color:var(--mona-primary)}div.mona-tree-view-drop-magnet:first-child{top:2px}div.mona-tree-view-drop-magnet:last-child{bottom:2px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: TreeViewService }]; }, propDecorators: { dragging: [{
                type: Input
            }], dropPositionChange: [{
                type: Output
            }], node: [{
                type: Input
            }], nodeClick: [{
                type: Output
            }], nodeDoubleClick: [{
                type: Output
            }], nodeSelect: [{
                type: Output
            }], nodeTextTemplate: [{
                type: Input
            }] } });

class TreeViewComponent {
    set nodeDisabler(nodeDisabler) {
        this.disabler = nodeDisabler;
        this.updateDisabledState();
    }
    constructor(cdr, elementRef, treeViewService) {
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.treeViewService = treeViewService;
        this.componentDestroy$ = new Subject();
        this.dropAfterIcon = faArrowDown;
        this.dropBeforeIcon = faArrowUp;
        this.dropInsideIcon = faPlus;
        this.dragging = false;
        this.childrenField = "";
        this.data = [];
        this.keyField = "";
        this.nodeClick = new EventEmitter();
        this.nodeComponents = new QueryList();
        this.nodeDoubleClick = new EventEmitter();
        this.nodeDrag = new EventEmitter();
        this.nodeDragEnd = new EventEmitter();
        this.nodeDragStart = new EventEmitter();
        this.nodeDrop = new EventEmitter();
        this.nodeTextTemplate = null;
        this.textField = "";
    }
    flattenComponents() {
        const flatten = (items) => {
            const flat = [];
            items.forEach(item => {
                flat.push(item);
                if (item.nodes.length > 0) {
                    flat.push(...flatten(item.nodes));
                }
            });
            return flat;
        };
        const flatNodes = flatten(this.treeViewService.viewNodeList);
        const flatComponents = [];
        flatNodes.forEach(node => {
            const component = this.nodeComponents.find(c => c.node.uid === node.uid);
            if (component) {
                flatComponents.push(component);
            }
        });
        return flatComponents;
    }
    ngAfterViewInit() {
        const flatComponents = this.flattenComponents();
        this.keyManager = new ActiveDescendantKeyManager(flatComponents).skipPredicate(n => n.node.disabled || n.node.anyParentCollapsed());
        this.nodeComponents.changes.subscribe(result => {
            const lastActiveItem = this.keyManager?.activeItem;
            this.keyManager = new ActiveDescendantKeyManager(flatComponents).skipPredicate(n => n.node.disabled || n.node.anyParentCollapsed());
            if (lastActiveItem) {
                this.keyManager?.setActiveItem(lastActiveItem);
            }
            else {
                const selectedItem = Enumerable.from(flatComponents)
                    .where(n => n.node.selected)
                    .lastOrDefault();
                const focusedItem = Enumerable.from(flatComponents)
                    .where(n => n.node.focused)
                    .lastOrDefault();
                this.keyManager?.setActiveItem(focusedItem || selectedItem || flatComponents[0]);
            }
            this.cdr.detectChanges();
        });
    }
    ngOnChanges(changes) {
        if (changes && changes["data"] && !changes["data"].isFirstChange()) {
            this.prepareNodeList();
        }
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    ngOnInit() {
        if (!this.keyField) {
            throw new Error("mona-tree-view: keyField is required. (keyField is a field that is unique for each node.)");
        }
        this.prepareNodeList();
        this.setEvents();
    }
    nodeTrackBy(index, item) {
        return item.key;
    }
    onNodeDragEnd(event) {
        const dragEvent = new NodeDragEndEvent(event.source.data.getLookupItem(), event.event);
        this.nodeDragEnd.emit(dragEvent);
        this.dragging = false;
        this.dragNode = undefined;
    }
    onNodeDragMove(event, node) {
        const dragEvent = new NodeDragEvent(node.getLookupItem(), this.dropTargetNode?.getLookupItem(), this.dropPosition, event.event);
        this.nodeDrag.emit(dragEvent);
        if (event.event) {
            const draggedElement = event.source.element.nativeElement.nextSibling;
            draggedElement.style.top = `${10}px`;
            draggedElement.style.left = `${10}px`;
        }
    }
    onNodeDragStart(event) {
        const dragEvent = new NodeDragStartEvent(event.source.data.getLookupItem(), event.event);
        this.nodeDragStart.emit(dragEvent);
        if (dragEvent.isDefaultPrevented()) {
            return;
        }
        this.dragging = true;
        this.dragNode = event.source.data;
    }
    onNodeDrop(event) {
        const dropEvent = new NodeDropEvent(event.item.data.getLookupItem(), this.dropTargetNode?.getLookupItem(), this.dropPosition, event.event);
        this.nodeDrop.emit(dropEvent);
        if (dropEvent.isDefaultPrevented()) {
            return;
        }
        if (!event.isPointerOverContainer || !this.dropTargetNode) {
            return;
        }
        const draggedNode = event.item.data;
        if (this.dropTargetNode.uid === draggedNode.uid || this.dropTargetNode.isDescendantOf(draggedNode)) {
            return;
        }
        if (this.dropPosition === "inside") {
            if (draggedNode.parent?.uid === this.dropTargetNode.uid) {
                return;
            }
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            else {
                this.treeViewService.nodeList = this.treeViewService.nodeList.filter(node => node.uid !== draggedNode.uid);
            }
            this.dropTargetNode.nodes = [...this.dropTargetNode.nodes, draggedNode];
            if (draggedNode.parent) {
                this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
            }
            draggedNode.parent = this.dropTargetNode;
            this.dropTargetNode.expanded = true;
            // if (this.dropTargetNode.nodes.length === 1 && this.dropTargetNode.nodes[0].uid === draggedNode.uid) {
            //     if (this.dropTargetNode.checked && !draggedNode.checked) {
            //         this.treeViewService.toggleNodeCheck(draggedNode, true);
            //     } else if (!this.dropTargetNode.checked && draggedNode.checked) {
            //         this.treeViewService.toggleNodeCheck(draggedNode, false);
            //     }
            // } else {
            //     this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
            // }
            this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
            this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
        }
        else if (this.dropPosition === "before") {
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            if (this.dropTargetNode.parent) {
                const index = this.dropTargetNode.parent.nodes.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.dropTargetNode.parent.nodes.splice(index, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = this.dropTargetNode.parent;
                }
                this.treeViewService.updateNodeCheckStatus(this.dropTargetNode.parent);
            }
            else {
                const index = this.treeViewService.nodeList.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.treeViewService.nodeList = this.treeViewService.nodeList.filter(node => node.uid !== draggedNode.uid);
                    this.treeViewService.nodeList.splice(index, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = undefined;
                    this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
                }
            }
        }
        else if (this.dropPosition === "after") {
            if (draggedNode.parent) {
                draggedNode.parent.nodes = draggedNode.parent.nodes.filter(node => node.uid !== draggedNode.uid);
            }
            if (this.dropTargetNode.parent) {
                const index = this.dropTargetNode.parent.nodes.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.dropTargetNode.parent.nodes.splice(index + 1, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = this.dropTargetNode.parent;
                }
                this.treeViewService.updateNodeCheckStatus(this.dropTargetNode.parent);
            }
            else {
                const index = this.treeViewService.nodeList.findIndex(node => node.uid === this.dropTargetNode?.uid);
                if (index >= 0) {
                    this.treeViewService.nodeList = this.treeViewService.nodeList.filter(node => node.uid !== draggedNode.uid);
                    this.treeViewService.nodeList.splice(index + 1, 0, draggedNode);
                    if (draggedNode.parent) {
                        this.treeViewService.updateNodeCheckStatus(draggedNode.parent);
                    }
                    draggedNode.parent = undefined;
                    this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
                }
            }
        }
        this.dragging = false;
    }
    onNodeDropPositionChange(event) {
        this.dropPosition = event.position;
        this.dropTargetNode = event.node;
    }
    onNodeSelect(node) {
        const components = this.flattenComponents();
        const component = components.find(component => component.node.uid === node.uid);
        if (component) {
            this.keyManager?.setActiveItem(component);
        }
    }
    prepareNodeList() {
        this.treeViewService.nodeList = [];
        this.treeViewService.viewNodeList = [];
        this.treeViewService.nodeDictionary.clear();
        this.prepareNodeListRecursively(this.data, undefined, this.treeViewService.nodeList);
        this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
        this.treeViewService.loadDisabledKeys(this.treeViewService.disabledKeys);
        this.updateDisabledState();
        this.treeViewService.viewNodeList = [...this.treeViewService.nodeList];
    }
    prepareNodeListRecursively(root, parentNode, childNodes) {
        const rootList = new List(root ?? []);
        if (rootList.length === 0) {
            return;
        }
        for (const dataItem of rootList) {
            const nodeId = dataItem[this.keyField];
            const node = new Node({
                key: nodeId,
                data: dataItem,
                checked: false,
                expanded: false,
                selected: false,
                text: dataItem[this.textField],
                nodes: [],
                parent: parentNode
            });
            if (this.childrenField) {
                this.prepareNodeListRecursively(dataItem[this.childrenField], node, node.nodes);
            }
            childNodes?.push(node);
            this.treeViewService.nodeDictionary.add(node.uid, node);
        }
    }
    setEvents() {
        fromEvent(this.elementRef.nativeElement, "keydown")
            .pipe(filter(event => event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight" ||
            event.key === "Enter" ||
            event.key === " "), takeUntil(this.componentDestroy$))
            .subscribe(event => {
            event.preventDefault();
            switch (event.key) {
                case "ArrowDown":
                    this.keyManager?.onKeydown(event);
                    break;
                case "ArrowUp":
                    this.keyManager?.onKeydown(event);
                    break;
                case "ArrowLeft":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeExpand(this.keyManager.activeItem.node, false);
                    }
                    break;
                case "ArrowRight":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeExpand(this.keyManager.activeItem.node, true);
                    }
                    break;
                case "Enter":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeSelection(this.keyManager.activeItem.node);
                    }
                    break;
                case " ":
                    if (this.keyManager?.activeItem?.node) {
                        this.treeViewService.toggleNodeCheck(this.keyManager.activeItem.node);
                    }
                    break;
            }
        });
        fromEvent(this.elementRef.nativeElement, "focusout")
            .pipe(takeUntil(this.componentDestroy$))
            .subscribe(() => {
            this.treeViewService.nodeDictionary.values().forEach(n => (n.focused = false));
        });
    }
    updateDisabledState() {
        if (this.disabler) {
            const disabler = TreeViewService.getNodeDisablerAction(this.disabler);
            for (const node of this.treeViewService.nodeDictionary.values()) {
                node.disabled = disabler(node.data);
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: TreeViewService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewComponent, selector: "mona-tree-view", inputs: { childrenField: "childrenField", data: "data", keyField: "keyField", nodeDisabler: "nodeDisabler", textField: "textField" }, outputs: { nodeClick: "nodeClick", nodeDoubleClick: "nodeDoubleClick", nodeDrag: "nodeDrag", nodeDragEnd: "nodeDragEnd", nodeDragStart: "nodeDragStart", nodeDrop: "nodeDrop" }, providers: [TreeViewService], queries: [{ propertyName: "nodeTextTemplate", first: true, predicate: TreeViewNodeTextTemplateDirective, descendants: true, read: TemplateRef }], viewQueries: [{ propertyName: "nodeComponents", predicate: TreeViewNodeComponent, descendants: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"mona-tree-view\" tabindex=\"0\">\n    <ul class=\"mona-tree-list\" cdkDropList [cdkDropListSortingDisabled]=\"true\"\n        (cdkDropListDropped)=\"onNodeDrop($event)\">\n        <ng-template #treeTemplate let-nodes>\n            <ng-container *ngFor=\"let node of nodes; let nx = index; trackBy:nodeTrackBy;\">\n                <li class=\"mona-tree-list-item\" cdkDrag [cdkDragData]=\"node\" (cdkDragStarted)=\"onNodeDragStart($event)\"\n                    (cdkDragEnded)=\"onNodeDragEnd($event)\" (cdkDragMoved)=\"onNodeDragMove($event, node)\">\n                    <mona-tree-view-node [node]=\"node\" [nodeTextTemplate]=\"nodeTextTemplate\" [dragging]=\"dragging\"\n                                         (dropPositionChange)=\"onNodeDropPositionChange($event)\"\n                                         (nodeSelect)=\"onNodeSelect($event)\"\n                                         (nodeClick)=\"nodeClick.emit($event)\"\n                                         (nodeDoubleClick)=\"nodeDoubleClick.emit($event)\"></mona-tree-view-node>\n                    <ul class=\"mona-subtree-list\" *ngIf=\"node.nodes.length !== 0 && node.expanded\">\n                        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: node.nodes}\"></ng-container>\n                    </ul>\n                    <ng-template cdkDragPreview [data]=\"node\">\n                        <div class=\"mona-tree-view-node-dragging\">\n                            <span>\n                                <ng-container *ngIf=\"dropPosition==='inside'\">\n                                    <fa-icon [icon]=\"dropInsideIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='after'\">\n                                    <fa-icon [icon]=\"dropAfterIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='before'\">\n                                    <fa-icon [icon]=\"dropBeforeIcon\"></fa-icon>\n                                </ng-container>\n                            </span>\n                            <span>{{node.text}}</span>\n                        </div>\n                    </ng-template>\n                </li>\n            </ng-container>\n        </ng-template>\n        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                      [ngTemplateOutletContext]=\"{$implicit: treeViewService.viewNodeList}\"></ng-container>\n    </ul>\n</div>\n", styles: ["div.mona-tree-view{outline:none}ul{list-style-type:none;overflow:hidden}ul.mona-tree-list{margin-top:10px;padding-bottom:2px}ul li{list-style-type:none;position:relative;color:var(--mona-text)}ul.mona-subtree-list{padding-left:19px}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: i5$2.CdkDropList, selector: "[cdkDropList], cdk-drop-list", inputs: ["cdkDropListConnectedTo", "cdkDropListData", "cdkDropListOrientation", "id", "cdkDropListLockAxis", "cdkDropListDisabled", "cdkDropListSortingDisabled", "cdkDropListEnterPredicate", "cdkDropListSortPredicate", "cdkDropListAutoScrollDisabled", "cdkDropListAutoScrollStep"], outputs: ["cdkDropListDropped", "cdkDropListEntered", "cdkDropListExited", "cdkDropListSorted"], exportAs: ["cdkDropList"] }, { kind: "directive", type: i5$2.CdkDrag, selector: "[cdkDrag]", inputs: ["cdkDragData", "cdkDragLockAxis", "cdkDragRootElement", "cdkDragBoundary", "cdkDragStartDelay", "cdkDragFreeDragPosition", "cdkDragDisabled", "cdkDragConstrainPosition", "cdkDragPreviewClass", "cdkDragPreviewContainer"], outputs: ["cdkDragStarted", "cdkDragReleased", "cdkDragEnded", "cdkDragEntered", "cdkDragExited", "cdkDragDropped", "cdkDragMoved"], exportAs: ["cdkDrag"] }, { kind: "directive", type: i5$2.CdkDragPreview, selector: "ng-template[cdkDragPreview]", inputs: ["data", "matchSize"] }, { kind: "component", type: TreeViewNodeComponent, selector: "mona-tree-view-node", inputs: ["dragging", "node", "nodeTextTemplate"], outputs: ["dropPositionChange", "nodeClick", "nodeDoubleClick", "nodeSelect"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-tree-view", providers: [TreeViewService], template: "<div class=\"mona-tree-view\" tabindex=\"0\">\n    <ul class=\"mona-tree-list\" cdkDropList [cdkDropListSortingDisabled]=\"true\"\n        (cdkDropListDropped)=\"onNodeDrop($event)\">\n        <ng-template #treeTemplate let-nodes>\n            <ng-container *ngFor=\"let node of nodes; let nx = index; trackBy:nodeTrackBy;\">\n                <li class=\"mona-tree-list-item\" cdkDrag [cdkDragData]=\"node\" (cdkDragStarted)=\"onNodeDragStart($event)\"\n                    (cdkDragEnded)=\"onNodeDragEnd($event)\" (cdkDragMoved)=\"onNodeDragMove($event, node)\">\n                    <mona-tree-view-node [node]=\"node\" [nodeTextTemplate]=\"nodeTextTemplate\" [dragging]=\"dragging\"\n                                         (dropPositionChange)=\"onNodeDropPositionChange($event)\"\n                                         (nodeSelect)=\"onNodeSelect($event)\"\n                                         (nodeClick)=\"nodeClick.emit($event)\"\n                                         (nodeDoubleClick)=\"nodeDoubleClick.emit($event)\"></mona-tree-view-node>\n                    <ul class=\"mona-subtree-list\" *ngIf=\"node.nodes.length !== 0 && node.expanded\">\n                        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                                      [ngTemplateOutletContext]=\"{$implicit: node.nodes}\"></ng-container>\n                    </ul>\n                    <ng-template cdkDragPreview [data]=\"node\">\n                        <div class=\"mona-tree-view-node-dragging\">\n                            <span>\n                                <ng-container *ngIf=\"dropPosition==='inside'\">\n                                    <fa-icon [icon]=\"dropInsideIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='after'\">\n                                    <fa-icon [icon]=\"dropAfterIcon\"></fa-icon>\n                                </ng-container>\n                                <ng-container *ngIf=\"dropPosition==='before'\">\n                                    <fa-icon [icon]=\"dropBeforeIcon\"></fa-icon>\n                                </ng-container>\n                            </span>\n                            <span>{{node.text}}</span>\n                        </div>\n                    </ng-template>\n                </li>\n            </ng-container>\n        </ng-template>\n        <ng-container [ngTemplateOutlet]=\"treeTemplate\"\n                      [ngTemplateOutletContext]=\"{$implicit: treeViewService.viewNodeList}\"></ng-container>\n    </ul>\n</div>\n", styles: ["div.mona-tree-view{outline:none}ul{list-style-type:none;overflow:hidden}ul.mona-tree-list{margin-top:10px;padding-bottom:2px}ul li{list-style-type:none;position:relative;color:var(--mona-text)}ul.mona-subtree-list{padding-left:19px}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: TreeViewService }]; }, propDecorators: { childrenField: [{
                type: Input
            }], data: [{
                type: Input
            }], keyField: [{
                type: Input
            }], nodeClick: [{
                type: Output
            }], nodeComponents: [{
                type: ViewChildren,
                args: [TreeViewNodeComponent]
            }], nodeDisabler: [{
                type: Input
            }], nodeDoubleClick: [{
                type: Output
            }], nodeDrag: [{
                type: Output
            }], nodeDragEnd: [{
                type: Output
            }], nodeDragStart: [{
                type: Output
            }], nodeDrop: [{
                type: Output
            }], nodeTextTemplate: [{
                type: ContentChild,
                args: [TreeViewNodeTextTemplateDirective, { read: TemplateRef }]
            }], textField: [{
                type: Input
            }] } });

class TreeViewCheckableDirective {
    set checkedKeys(checkedKeys) {
        this.treeViewService.checkedKeys.clear();
        this.treeViewService.checkedKeys.addAll(checkedKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
        this.checkedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["checkedKeys"] && !changes["checkedKeys"].isFirstChange()) {
            this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
        }
    }
    ngOnInit() {
        this.treeViewService.checkedKeysChange = this.checkedKeysChange;
        if (this.options) {
            this.treeViewService.setCheckableOptions(this.options);
        }
        else if (this.options === "") {
            this.treeViewService.setCheckableOptions({ enabled: true });
        }
        this.treeViewService.loadCheckedKeys(this.treeViewService.checkedKeys);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewCheckableDirective, deps: [{ token: TreeViewComponent }, { token: TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewCheckableDirective, selector: "mona-tree-view[monaTreeViewCheckable]", inputs: { checkedKeys: "checkedKeys", options: ["monaTreeViewCheckable", "options"] }, outputs: { checkedKeysChange: "checkedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewCheckableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewCheckable]"
                }]
        }], ctorParameters: function () { return [{ type: TreeViewComponent }, { type: TreeViewService }]; }, propDecorators: { checkedKeys: [{
                type: Input
            }], checkedKeysChange: [{
                type: Output
            }], options: [{
                type: Input,
                args: ["monaTreeViewCheckable"]
            }] } });

class TreeViewDisableDirective {
    set disabledKeys(disabledKeys) {
        this.treeViewService.disabledKeys.clear();
        this.treeViewService.disabledKeys.addAll(disabledKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
    }
    ngOnChanges(changes) {
        if (changes && changes["disabledKeys"] && !changes["disabledKeys"].isFirstChange()) {
            this.treeViewService.loadDisabledKeys(this.treeViewService.disabledKeys);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewDisableDirective, deps: [{ token: TreeViewComponent }, { token: TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewDisableDirective, selector: "mona-tree-view[monaTreeViewDisable]", inputs: { disabledKeys: "disabledKeys" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewDisableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewDisable]"
                }]
        }], ctorParameters: function () { return [{ type: TreeViewComponent }, { type: TreeViewService }]; }, propDecorators: { disabledKeys: [{
                type: Input
            }] } });

class TreeViewExpandableDirective {
    set expandedKeys(expandedKeys) {
        this.treeViewService.expandedKeys.clear();
        this.treeViewService.expandedKeys.addAll(expandedKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
        this.expandedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["expandedKeys"] && !changes["expandedKeys"].isFirstChange()) {
            this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
        }
    }
    ngOnInit() {
        this.treeViewService.expandedKeysChange = this.expandedKeysChange;
        this.treeViewService.loadExpandedKeys(this.treeViewService.expandedKeys);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewExpandableDirective, deps: [{ token: TreeViewComponent }, { token: TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewExpandableDirective, selector: "mona-tree-view[monaTreeViewExpandable]", inputs: { expandedKeys: "expandedKeys" }, outputs: { expandedKeysChange: "expandedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewExpandableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewExpandable]"
                }]
        }], ctorParameters: function () { return [{ type: TreeViewComponent }, { type: TreeViewService }]; }, propDecorators: { expandedKeys: [{
                type: Input
            }], expandedKeysChange: [{
                type: Output
            }] } });

class TreeViewSelectableDirective {
    set selectedKeys(selectedKeys) {
        this.treeViewService.selectedKeys.clear();
        this.treeViewService.selectedKeys.addAll(selectedKeys);
    }
    constructor(treeView, treeViewService) {
        this.treeView = treeView;
        this.treeViewService = treeViewService;
        this.selectedKeysChange = new EventEmitter();
    }
    ngOnChanges(changes) {
        if (changes && changes["selectedKeys"] && !changes["selectedKeys"].isFirstChange()) {
            this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
        }
    }
    ngOnInit() {
        this.treeViewService.selectedKeysChange = this.selectedKeysChange;
        if (this.options) {
            this.treeViewService.setSelectableOptions(this.options);
        }
        else if (this.options === "") {
            this.treeViewService.setSelectableOptions({ enabled: true });
        }
        this.treeViewService.loadSelectedKeys(this.treeViewService.selectedKeys);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewSelectableDirective, deps: [{ token: TreeViewComponent }, { token: TreeViewService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: TreeViewSelectableDirective, selector: "mona-tree-view[monaTreeViewSelectable]", inputs: { selectedKeys: "selectedKeys", options: ["monaTreeViewSelectable", "options"] }, outputs: { selectedKeysChange: "selectedKeysChange" }, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewSelectableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "mona-tree-view[monaTreeViewSelectable]"
                }]
        }], ctorParameters: function () { return [{ type: TreeViewComponent }, { type: TreeViewService }]; }, propDecorators: { selectedKeys: [{
                type: Input
            }], selectedKeysChange: [{
                type: Output
            }], options: [{
                type: Input,
                args: ["monaTreeViewSelectable"]
            }] } });

class TreeViewModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, declarations: [TreeViewComponent,
            TreeViewNodeComponent,
            TreeViewCheckableDirective,
            TreeViewNodeTextTemplateDirective,
            TreeViewExpandableDirective,
            TreeViewSelectableDirective,
            TreeViewDisableDirective], imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule, ContextMenuModule, DragDropModule], exports: [TreeViewComponent,
            TreeViewCheckableDirective,
            TreeViewNodeTextTemplateDirective,
            TreeViewExpandableDirective,
            TreeViewSelectableDirective,
            TreeViewDisableDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule, ContextMenuModule, DragDropModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: TreeViewModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        TreeViewComponent,
                        TreeViewNodeComponent,
                        TreeViewCheckableDirective,
                        TreeViewNodeTextTemplateDirective,
                        TreeViewExpandableDirective,
                        TreeViewSelectableDirective,
                        TreeViewDisableDirective
                    ],
                    imports: [CommonModule, FontAwesomeModule, CheckBoxModule, FormsModule, ContextMenuModule, DragDropModule],
                    exports: [
                        TreeViewComponent,
                        TreeViewCheckableDirective,
                        TreeViewNodeTextTemplateDirective,
                        TreeViewExpandableDirective,
                        TreeViewSelectableDirective,
                        TreeViewDisableDirective
                    ]
                }]
        }] });

class WindowRef {
    #options;
    constructor(options) {
        this.#options = options;
    }
    close(result) {
        this.#options.close(result);
    }
    center() {
        this.#options.center();
    }
    move(params) {
        this.#options.move(params);
    }
    resize(params) {
        this.#options.resize(params);
    }
    get closed$() {
        return this.#options.closed$;
    }
    get component() {
        return this.#options.component;
    }
    get element() {
        return this.#options.element;
    }
    get moved$() {
        return this.#options.moved$;
    }
    get popupRef() {
        return this.#options.popupRef;
    }
    get resized$() {
        return this.#options.resized$;
    }
}

class WindowCloseEvent extends PopupCloseEvent {
    constructor(options) {
        super({
            type: "windowClose",
            ...options
        });
    }
}

class WindowResizeHandlerDirective {
    constructor(elementRef, zone) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.destroy$ = new Subject();
    }
    ngAfterViewInit() {
        this.setEvents();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onMouseDown(event) {
        const element = this.windowRef.element;
        const initialWidth = element.offsetWidth;
        const initialHeight = element.offsetHeight;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.offsetTop;
        const initialLeft = element.offsetLeft;
        const oldSelectStart = document.onselectstart;
        const oldDragStart = document.ondragstart;
        document.onselectstart = () => false;
        document.ondragstart = () => false;
        const onMouseMove = (event) => {
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            const minWidth = this.minWidth ?? 50;
            const minHeight = this.minHeight ?? 50;
            const maxWidth = this.maxWidth ?? window.innerWidth;
            const maxHeight = this.maxHeight ?? window.innerHeight;
            let height;
            let left;
            let width;
            let top;
            switch (this.direction) {
                case "northwest":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth - deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.left = `${left}px`;
                    element.style.width = `${width}px`;
                    break;
                case "north":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight) {
                        return;
                    }
                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;
                    break;
                case "northeast":
                    if (initialTop + deltaY <= 0 || initialHeight - deltaY < minHeight) {
                        return;
                    }
                    if (initialHeight - deltaY > maxHeight || initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight - deltaY;
                    top = initialTop + deltaY;
                    element.style.height = `${height}px`;
                    element.style.top = `${top}px`;
                    if (initialWidth + deltaX < 100 || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
                    break;
                case "east":
                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    if (initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
                    break;
                case "southeast":
                    if (initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight || initialWidth + deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;
                    if (initialWidth + deltaX < minWidth || initialLeft + initialWidth + deltaX > window.innerWidth) {
                        return;
                    }
                    width = initialWidth + deltaX;
                    element.style.width = `${width}px`;
                    break;
                case "south":
                    if (initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight) {
                        return;
                    }
                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;
                    break;
                case "southwest":
                    if (initialHeight + deltaY < minHeight ||
                        initialTop + initialHeight + deltaY > window.innerHeight) {
                        return;
                    }
                    if (initialHeight + deltaY > maxHeight || initialWidth - deltaX > maxWidth) {
                        return;
                    }
                    height = initialHeight + deltaY;
                    element.style.height = `${height}px`;
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.width = `${width}px`;
                    element.style.left = `${left}px`;
                    break;
                case "west":
                    if (initialLeft + deltaX < 0 || initialWidth - deltaX < minWidth) {
                        return;
                    }
                    if (initialWidth - deltaX > maxWidth) {
                        return;
                    }
                    width = initialWidth - deltaX;
                    left = initialLeft + deltaX;
                    element.style.width = `${width}px`;
                    element.style.left = `${left}px`;
                    break;
            }
            this.windowRef.resize$.next({
                width: width ?? initialWidth,
                height: height ?? initialHeight,
                left: left ?? initialLeft,
                top: top ?? initialTop
            });
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            document.onselectstart = oldSelectStart;
            document.ondragstart = oldDragStart;
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    setEvents() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.destroy$))
                .subscribe(event => this.onMouseDown(event));
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowResizeHandlerDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: WindowResizeHandlerDirective, selector: "div[monaWindowResizeHandler]", inputs: { direction: "direction", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", windowRef: "windowRef" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowResizeHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "div[monaWindowResizeHandler]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { direction: [{
                type: Input
            }], maxHeight: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], windowRef: [{
                type: Input
            }] } });

class WindowDragHandlerDirective {
    constructor(elementRef, zone) {
        this.elementRef = elementRef;
        this.zone = zone;
        this.componentDestroy$ = new Subject();
        this.draggable = false;
    }
    ngAfterViewInit() {
        this.setEvents();
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
    }
    onMouseDown(event) {
        if (!this.draggable) {
            return;
        }
        const element = this.elementRef.nativeElement.parentElement?.parentElement?.parentElement;
        const initialX = event.clientX;
        const initialY = event.clientY;
        const initialTop = element.offsetTop;
        const initialLeft = element.offsetLeft;
        const onMouseMove = (event) => {
            if (event.clientX < 0 ||
                event.clientX > window.innerWidth ||
                event.clientY < 0 ||
                event.clientY > window.innerHeight) {
                return;
            }
            const deltaX = event.clientX - initialX;
            const deltaY = event.clientY - initialY;
            const top = initialTop + deltaY;
            const left = initialLeft + deltaX;
            element.style.top = `${top}px`;
            element.style.left = `${left}px`;
            this.windowRef.move$.next({ top, left });
        };
        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }
    setEvents() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.elementRef.nativeElement, "mousedown")
                .pipe(takeUntil(this.componentDestroy$))
                .subscribe(event => this.onMouseDown(event));
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowDragHandlerDirective, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: WindowDragHandlerDirective, selector: "div[monaWindowDragHandler]", inputs: { draggable: "draggable", windowRef: "windowRef" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowDragHandlerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "div[monaWindowDragHandler]"
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { draggable: [{
                type: Input
            }], windowRef: [{
                type: Input
            }] } });

class WindowContentComponent {
    constructor(injector, windowData, elementRef) {
        this.injector = injector;
        this.windowData = windowData;
        this.elementRef = elementRef;
        this.closeIcon = faClose;
        this.contentType = "template";
        if (windowData.content instanceof TemplateRef) {
            this.contentType = "template";
        }
        else {
            this.contentType = "component";
            this.componentRef = PopupService.popupAnchorDirective.viewContainerRef.createComponent(windowData.content, {
                injector: this.injector
            });
        }
    }
    ngAfterViewInit() {
        if (this.contentType === "component" && this.componentAnchor && this.componentRef) {
            const index = PopupService.popupAnchorDirective.viewContainerRef.indexOf(this.componentRef.hostView);
            if (index !== -1) {
                PopupService.popupAnchorDirective.viewContainerRef.detach(index);
            }
            this.componentAnchor.insert(this.componentRef.hostView, 0);
            this.componentRef.changeDetectorRef.detectChanges();
        }
        this.focusElement();
    }
    ngOnInit() { }
    onCloseClick(event) {
        const closeEvent = new WindowCloseEvent({ event, via: PopupCloseSource.CloseButton });
        if (this.windowData.preventClose && this.windowData.preventClose(closeEvent)) {
            return;
        }
        this.windowData.windowReference.close();
    }
    focusElement() {
        const element = this.windowData.focusedElement;
        if (element === undefined) {
            return;
        }
        const windowElement = this.elementRef.nativeElement;
        if (element instanceof ElementRef) {
            element.nativeElement.focus();
        }
        else if (element instanceof HTMLElement) {
            element.focus();
        }
        else {
            const elements = windowElement.querySelectorAll(element);
            if (elements.length > 0) {
                elements[0].focus();
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowContentComponent, deps: [{ token: i0.Injector }, { token: PopupInjectionToken }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: WindowContentComponent, selector: "mona-window-content", viewQueries: [{ propertyName: "componentAnchor", first: true, predicate: ["componentAnchor"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: "<div class=\"mona-window-content-container\">\n    <div class=\"mona-window-title-bar\" monaWindowDragHandler [draggable]=\"windowData.draggable\" [windowRef]=\"windowData.windowReference\">\n        <div class=\"mona-window-title-container\">\n            <span class=\"mona-window-title\" *ngIf=\"!windowData.titleTemplate\">{{windowData.title ?? ''}}</span>\n            <ng-container [ngTemplateOutlet]=\"windowData.titleTemplate\" *ngIf=\"windowData.titleTemplate\"></ng-container>\n        </div>\n        <div class=\"mona-window-title-bar-actions\">\n            <button monaButton class=\"mona-window-title-bar-action\" [flat]=\"true\" (click)=\"onCloseClick($event)\">\n                <fa-icon [icon]=\"closeIcon\"></fa-icon>\n            </button>\n        </div>\n    </div>\n    <div class=\"mona-window-content\">\n        <ng-container [ngTemplateOutlet]=\"$any(windowData.content)\" *ngIf=\"contentType==='template'\"></ng-container>\n        <ng-container #componentAnchor *ngIf=\"contentType==='component'\"></ng-container>\n    </div>\n\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"north\" class=\"mona-window-resizer mona-window-resizer-north\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"south\" class=\"mona-window-resizer mona-window-resizer-south\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"east\" class=\"mona-window-resizer mona-window-resizer-east\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"west\" class=\"mona-window-resizer mona-window-resizer-west\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"northeast\"\n         class=\"mona-window-resizer mona-window-resizer-northeast\" *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"northwest\"\n         class=\"mona-window-resizer mona-window-resizer-northwest\" *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"southeast\"\n         class=\"mona-window-resizer mona-window-resizer-southeast\" *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"southwest\"\n         class=\"mona-window-resizer mona-window-resizer-southwest\" *ngIf=\"windowData.resizable\"></div>\n\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-window-content-container{display:flex;flex-direction:column;overflow:hidden;position:relative;width:100%;height:100%}div.mona-window-title-bar{display:flex;align-items:center;justify-content:flex-start;height:var(--mona-input-height);border-bottom:1px solid var(--mona-border-color);background-color:var(--mona-background-dark)}div.mona-window-title-container{flex:1;padding:0 10px;height:100%;display:flex;align-items:center;cursor:default;-webkit-user-select:none;user-select:none}span.mona-window-title{font-weight:700;color:var(--mona-text)}div.mona-window-title-bar-actions{display:flex;align-items:center;justify-content:space-evenly}.mona-window-content{flex:1;overflow:auto;padding:10px}.mona-window-resizer{position:absolute;display:flex;background-color:transparent}.mona-window-resizer-north{top:0;left:0;right:0;height:10px;cursor:ns-resize}.mona-window-resizer-south{bottom:0;left:0;right:0;height:10px;cursor:ns-resize}.mona-window-resizer-east{top:0;right:0;bottom:0;width:10px;cursor:ew-resize}.mona-window-resizer-west{top:0;left:0;bottom:0;width:10px;cursor:ew-resize}.mona-window-resizer-northeast{top:0;right:0;width:10px;height:10px;cursor:nesw-resize}.mona-window-resizer-northwest{top:0;left:0;width:10px;height:10px;cursor:nwse-resize}.mona-window-resizer-southeast{bottom:0;right:0;width:10px;height:10px;cursor:nwse-resize}.mona-window-resizer-southwest{bottom:0;left:0;width:10px;height:10px;cursor:nesw-resize}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: ButtonDirective, selector: "[monaButton]", inputs: ["disabled", "flat", "primary", "selected", "toggleable"], outputs: ["selectedChange"] }, { kind: "component", type: i5.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "spin", "pulse", "mask", "styles", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "classes", "transform", "a11yRole"] }, { kind: "directive", type: WindowResizeHandlerDirective, selector: "div[monaWindowResizeHandler]", inputs: ["direction", "maxHeight", "maxWidth", "minHeight", "minWidth", "windowRef"] }, { kind: "directive", type: WindowDragHandlerDirective, selector: "div[monaWindowDragHandler]", inputs: ["draggable", "windowRef"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowContentComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-window-content", changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mona-window-content-container\">\n    <div class=\"mona-window-title-bar\" monaWindowDragHandler [draggable]=\"windowData.draggable\" [windowRef]=\"windowData.windowReference\">\n        <div class=\"mona-window-title-container\">\n            <span class=\"mona-window-title\" *ngIf=\"!windowData.titleTemplate\">{{windowData.title ?? ''}}</span>\n            <ng-container [ngTemplateOutlet]=\"windowData.titleTemplate\" *ngIf=\"windowData.titleTemplate\"></ng-container>\n        </div>\n        <div class=\"mona-window-title-bar-actions\">\n            <button monaButton class=\"mona-window-title-bar-action\" [flat]=\"true\" (click)=\"onCloseClick($event)\">\n                <fa-icon [icon]=\"closeIcon\"></fa-icon>\n            </button>\n        </div>\n    </div>\n    <div class=\"mona-window-content\">\n        <ng-container [ngTemplateOutlet]=\"$any(windowData.content)\" *ngIf=\"contentType==='template'\"></ng-container>\n        <ng-container #componentAnchor *ngIf=\"contentType==='component'\"></ng-container>\n    </div>\n\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"north\" class=\"mona-window-resizer mona-window-resizer-north\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"south\" class=\"mona-window-resizer mona-window-resizer-south\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"east\" class=\"mona-window-resizer mona-window-resizer-east\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"west\" class=\"mona-window-resizer mona-window-resizer-west\"\n         *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"northeast\"\n         class=\"mona-window-resizer mona-window-resizer-northeast\" *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"northwest\"\n         class=\"mona-window-resizer mona-window-resizer-northwest\" *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"southeast\"\n         class=\"mona-window-resizer mona-window-resizer-southeast\" *ngIf=\"windowData.resizable\"></div>\n    <div monaWindowResizeHandler [minWidth]=\"windowData.minWidth\" [minHeight]=\"windowData.minHeight\"\n         [maxWidth]=\"windowData.maxWidth\" [maxHeight]=\"windowData.maxHeight\"\n         [windowRef]=\"windowData.windowReference\" direction=\"southwest\"\n         class=\"mona-window-resizer mona-window-resizer-southwest\" *ngIf=\"windowData.resizable\"></div>\n\n</div>\n", styles: [":host{width:100%;height:100%}div.mona-window-content-container{display:flex;flex-direction:column;overflow:hidden;position:relative;width:100%;height:100%}div.mona-window-title-bar{display:flex;align-items:center;justify-content:flex-start;height:var(--mona-input-height);border-bottom:1px solid var(--mona-border-color);background-color:var(--mona-background-dark)}div.mona-window-title-container{flex:1;padding:0 10px;height:100%;display:flex;align-items:center;cursor:default;-webkit-user-select:none;user-select:none}span.mona-window-title{font-weight:700;color:var(--mona-text)}div.mona-window-title-bar-actions{display:flex;align-items:center;justify-content:space-evenly}.mona-window-content{flex:1;overflow:auto;padding:10px}.mona-window-resizer{position:absolute;display:flex;background-color:transparent}.mona-window-resizer-north{top:0;left:0;right:0;height:10px;cursor:ns-resize}.mona-window-resizer-south{bottom:0;left:0;right:0;height:10px;cursor:ns-resize}.mona-window-resizer-east{top:0;right:0;bottom:0;width:10px;cursor:ew-resize}.mona-window-resizer-west{top:0;left:0;bottom:0;width:10px;cursor:ew-resize}.mona-window-resizer-northeast{top:0;right:0;width:10px;height:10px;cursor:nesw-resize}.mona-window-resizer-northwest{top:0;left:0;width:10px;height:10px;cursor:nwse-resize}.mona-window-resizer-southeast{bottom:0;right:0;width:10px;height:10px;cursor:nwse-resize}.mona-window-resizer-southwest{bottom:0;left:0;width:10px;height:10px;cursor:nesw-resize}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.Injector }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PopupInjectionToken]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { componentAnchor: [{
                type: ViewChild,
                args: ["componentAnchor", { read: ViewContainerRef }]
            }] } });

/**
 * @internal - used by WindowService. Do not export.
 */
class WindowReference {
    constructor(options) {
        this.options = options;
        // public readonly popupReference: PopupRef;
        this.move$ = new Subject();
        this.resize$ = new Subject();
    }
    center() {
        const width = this.options.popupRef.overlayRef.overlayElement.offsetWidth;
        const height = this.options.popupRef.overlayRef.overlayElement.offsetHeight;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        this.options.popupRef.overlayRef.overlayElement.style.left = `${left}px`;
        this.options.popupRef.overlayRef.overlayElement.style.top = `${top}px`;
    }
    close(result) {
        const event = result instanceof WindowCloseEvent
            ? result
            : new WindowCloseEvent({ result, via: PopupCloseSource.Programmatic });
        this.options.popupRef.close(event);
    }
    move(params) {
        if (params.top) {
            this.options.popupRef.overlayRef.overlayElement.style.top = `${params.top}px`;
        }
        if (params.left) {
            this.options.popupRef.overlayRef.overlayElement.style.left = `${params.left}px`;
        }
    }
    resize(params) {
        if (params.width) {
            this.options.popupRef.overlayRef.overlayElement.style.width = `${params.width}px`;
        }
        if (params.height) {
            this.options.popupRef.overlayRef.overlayElement.style.height = `${params.height}px`;
        }
        if (params.center) {
            asapScheduler.schedule(() => this.center());
        }
    }
    get closed$() {
        return this.options.popupRef.closed.pipe(map(event => {
            if (event.type === "windowClose") {
                return event;
            }
            return new WindowCloseEvent({ event, via: event.via, type: "windowClose", result: event.result });
        }));
    }
    get component() {
        // Type of component is ComponentRef<WindowContentComponent>. It is set as any to avoid circular dependency.
        return this.popupRef.component.instance.componentRef ?? null;
    }
    get element() {
        return this.options.popupRef.overlayRef.overlayElement;
    }
    get moved$() {
        return this.move$;
    }
    get popupRef() {
        return this.options.popupRef;
    }
    get resized$() {
        return this.resize$;
    }
    get windowRef() {
        return new WindowRef(this);
    }
}

class WindowService {
    constructor(popupService) {
        this.popupService = popupService;
    }
    open(settings) {
        const injectorData = {
            content: settings.content,
            draggable: settings.draggable ?? false,
            focusedElement: settings.focusedElement,
            height: settings.height,
            left: settings.left,
            maxHeight: settings.maxHeight ?? window.innerHeight,
            maxWidth: settings.maxWidth ?? window.innerWidth,
            minHeight: settings.minHeight ?? 50,
            minWidth: settings.minWidth ?? 50,
            windowReference: null,
            preventClose: settings.preventClose,
            resizable: settings.resizable ?? false,
            title: typeof settings.title === "string" ? settings.title : undefined,
            titleTemplate: typeof settings.title === "string" ? undefined : settings.title,
            top: settings.top,
            width: settings.width
        };
        const windowReferenceHolder = {
            windowReference: null
        };
        const windowReferenceOptions = {
            popupRef: null
        };
        windowReferenceHolder.windowReference = new WindowReference(windowReferenceOptions);
        injectorData.windowReference = windowReferenceHolder.windowReference;
        windowReferenceOptions.popupRef = this.popupService.create({
            anchor: document.body,
            content: WindowContentComponent,
            closeOnBackdropClick: false,
            closeOnEscape: settings.closeOnEscape ?? false,
            closeOnOutsideClick: false,
            hasBackdrop: settings.modal,
            backdropClass: settings.modal ? "mona-window-overlay" : "transparent",
            popupClass: ["mona-window-invisible", "mona-window-popup-content"],
            positionStrategy: "global",
            data: injectorData,
            width: settings.width,
            height: settings.height,
            providers: [
                {
                    provide: WindowRef,
                    useFactory: forwardRef(() => {
                        return windowReferenceHolder.windowReference.windowRef;
                    })
                }
            ],
            preventClose: (event) => {
                if (settings.preventClose) {
                    const windowCloseEvent = new WindowCloseEvent({
                        event,
                        via: event.via,
                        type: event.type,
                        result: event.result
                    });
                    return settings.preventClose(windowCloseEvent);
                }
                return false;
            }
        });
        asapScheduler.schedule(() => {
            const element = windowReferenceOptions.popupRef.overlayRef.overlayElement;
            element.classList.add("mona-window");
            element.style.position = "absolute";
            if (settings.minWidth != null) {
                element.style.minWidth = `${settings.minWidth}px`;
            }
            if (settings.minHeight != null) {
                element.style.minHeight = `${settings.minHeight}px`;
            }
            if (settings.maxWidth != null) {
                element.style.maxWidth = `${settings.maxWidth}px`;
            }
            if (settings.maxHeight != null) {
                element.style.maxHeight = `${settings.maxHeight}px`;
            }
            element.style.top = settings.top ? `${settings.top}px` : `calc(50% - ${element.offsetHeight / 2}px)`;
            element.style.left = settings.left ? `${settings.left}px` : `calc(50% - ${element.offsetWidth / 2}px)`;
            element.classList.remove("mona-window-invisible");
        });
        return windowReferenceHolder.windowReference.windowRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowService, deps: [{ token: PopupService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowService, providedIn: "root" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root"
                }]
        }], ctorParameters: function () { return [{ type: PopupService }]; } });

class WindowTitleTemplateDirective {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowTitleTemplateDirective, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: WindowTitleTemplateDirective, selector: "ng-template[monaWindowTitleTemplate]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowTitleTemplateDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: "ng-template[monaWindowTitleTemplate]"
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });

class WindowComponent {
    constructor(windowService) {
        this.windowService = windowService;
        this.componentDestroy$ = new Subject();
        this.heightChange = new EventEmitter();
        this.leftChange = new EventEmitter();
        this.topChange = new EventEmitter();
        this.widthChange = new EventEmitter();
    }
    ngAfterViewInit() {
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
            this.windowRef.resized$.pipe(takeUntil(this.componentDestroy$)).subscribe(event => {
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
            this.windowRef.moved$.pipe(takeUntil(this.componentDestroy$)).subscribe(event => {
                if (event.left != null) {
                    this.leftChange.emit(event.left);
                }
                if (event.top != null) {
                    this.topChange.emit(event.top);
                }
            });
        });
    }
    ngOnDestroy() {
        this.componentDestroy$.next();
        this.componentDestroy$.complete();
        this.windowRef.close();
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowComponent, deps: [{ token: WindowService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: WindowComponent, selector: "mona-window", inputs: { draggable: "draggable", focusedElement: "focusedElement", height: "height", left: "left", maxHeight: "maxHeight", maxWidth: "maxWidth", minHeight: "minHeight", minWidth: "minWidth", modal: "modal", resizable: "resizable", title: "title", top: "top", width: "width" }, outputs: { heightChange: "heightChange", leftChange: "leftChange", topChange: "topChange", widthChange: "widthChange" }, queries: [{ propertyName: "titleTemplateDirective", first: true, predicate: WindowTitleTemplateDirective, descendants: true }], viewQueries: [{ propertyName: "windowTemplate", first: true, predicate: ["windowTemplate"], descendants: true }], ngImport: i0, template: "<ng-template #windowTemplate>\n    <ng-content></ng-content>\n</ng-template>\n", styles: [""], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowComponent, decorators: [{
            type: Component,
            args: [{ selector: "mona-window", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-template #windowTemplate>\n    <ng-content></ng-content>\n</ng-template>\n" }]
        }], ctorParameters: function () { return [{ type: WindowService }]; }, propDecorators: { draggable: [{
                type: Input
            }], focusedElement: [{
                type: Input
            }], height: [{
                type: Input
            }], heightChange: [{
                type: Output
            }], left: [{
                type: Input
            }], leftChange: [{
                type: Output
            }], maxHeight: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], minHeight: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], modal: [{
                type: Input
            }], resizable: [{
                type: Input
            }], title: [{
                type: Input
            }], titleTemplateDirective: [{
                type: ContentChild,
                args: [WindowTitleTemplateDirective]
            }], top: [{
                type: Input
            }], topChange: [{
                type: Output
            }], width: [{
                type: Input
            }], widthChange: [{
                type: Output
            }], windowTemplate: [{
                type: ViewChild,
                args: ["windowTemplate"]
            }] } });

class WindowModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, declarations: [WindowContentComponent,
            WindowResizeHandlerDirective,
            WindowDragHandlerDirective,
            WindowComponent,
            WindowTitleTemplateDirective], imports: [CommonModule, ButtonModule, FontAwesomeModule], exports: [WindowComponent, WindowTitleTemplateDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, imports: [CommonModule, ButtonModule, FontAwesomeModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: WindowModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        WindowContentComponent,
                        WindowResizeHandlerDirective,
                        WindowDragHandlerDirective,
                        WindowComponent,
                        WindowTitleTemplateDirective
                    ],
                    imports: [CommonModule, ButtonModule, FontAwesomeModule],
                    exports: [WindowComponent, WindowTitleTemplateDirective]
                }]
        }] });

/**
 * Internal use only. Do not export.
 */
class SharedModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: SharedModule, imports: [CommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: SharedModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [CommonModule],
                    exports: []
                }]
        }] });

class MonaUiModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MonaUiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0", ngImport: i0, type: MonaUiModule, exports: [ButtonsModule,
            DateInputsModule,
            DropDownsModule,
            FilterModule,
            GridModule,
            InputsModule,
            LayoutModule,
            MenusModule,
            PagerModule,
            PopupModule,
            ProgressBarsModule,
            TooltipsModule,
            TreeViewModule,
            WindowModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MonaUiModule, imports: [ButtonsModule,
            DateInputsModule,
            DropDownsModule,
            FilterModule,
            GridModule,
            InputsModule,
            LayoutModule,
            MenusModule,
            PagerModule,
            PopupModule,
            ProgressBarsModule,
            TooltipsModule,
            TreeViewModule,
            WindowModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MonaUiModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [
                        ButtonsModule,
                        DateInputsModule,
                        DropDownsModule,
                        FilterModule,
                        GridModule,
                        InputsModule,
                        LayoutModule,
                        MenusModule,
                        PagerModule,
                        PopupModule,
                        ProgressBarsModule,
                        TooltipsModule,
                        TreeViewModule,
                        WindowModule
                    ]
                }]
        }] });

/*
 * Public API Surface of mona-ui
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AutoCompleteComponent, AutoCompleteModule, ButtonDirective, ButtonGroupComponent, ButtonGroupModule, ButtonModule, ButtonsModule, CalendarComponent, CalendarModule, CellEditEvent, CheckBoxDirective, CheckBoxModule, ChipComponent, ChipModule, CircularProgressBarComponent, CircularProgressBarLabelTemplateDirective, CircularProgressBarModule, ColorPaletteComponent, ColorPaletteModule, ColorPickerComponent, ColorPickerModule, ComboBoxComponent, ComboBoxGroupTemplateDirective, ComboBoxItemTemplateDirective, ComboBoxModule, ContextMenuComponent, ContextMenuModule, DateInputsModule, DatePickerComponent, DatePickerModule, DateTimePickerComponent, DateTimePickerModule, DropDownListComponent, DropDownListGroupTemplateDirective, DropDownListItemTemplateDirective, DropDownListModule, DropDownListValueTemplateDirective, DropDownsModule, ExpansionPanelActionsTemplateDirective, ExpansionPanelComponent, ExpansionPanelModule, ExpansionPanelTitleTemplateDirective, FilterMenuComponent, FilterModule, GridCellTemplateDirective, GridColumnComponent, GridComponent, GridEditableDirective, GridModule, GridSelectableDirective, InputsModule, LayoutModule, ListGroupTemplateDirective, ListItemTemplateDirective, MenuComponent, MenuItemComponent, MenuItemIconTemplateDirective, MenuItemTextTemplateDirective, MenuTextTemplateDirective, MenubarComponent, MenubarModule, MenusModule, MonaUiModule, MultiSelectComponent, MultiSelectGroupTemplateDirective, MultiSelectItemTemplateDirective, MultiSelectModule, MultiSelectSummaryTagDirective, MultiSelectSummaryTagTemplateDirective, MultiSelectTagTemplateDirective, NodeClickEvent, NodeDragEndEvent, NodeDragEvent, NodeDragStartEvent, NodeDropEvent, NodeLookupItem, NumericTextBoxComponent, NumericTextBoxModule, PageSizeChangeEvent, PagerComponent, PagerModule, PopupAnchorDirective, PopupComponent, PopupListComponent, PopupModule, PopupRef, PopupService, ProgressBarComponent, ProgressBarModule, ProgressBarsModule, Query, RadioButtonDirective, RadioButtonModule, RangeSliderComponent, SharedModule, SliderComponent, SliderModule, SliderTickValueTemplateDirective, SplitButtonComponent, SplitButtonModule, SplitButtonTextTemplateDirective, SplitterComponent, SplitterModule, SplitterPaneComponent, StepperComponent, StepperIndicatorTemplateDirective, StepperLabelTemplateDirective, StepperModule, StepperStepTemplateDirective, SwitchComponent, SwitchModule, SwitchOffLabelTemplateDirective, SwitchOnLabelTemplateDirective, TabCloseEvent, TabComponent, TabContentTemplateDirective, TabStripComponent, TabStripModule, TabTitleTemplateDirective, TextAreaDirective, TextAreaModule, TextBoxComponent, TextBoxDirective, TextBoxModule, TextBoxPrefixTemplateDirective, TextBoxSuffixTemplateDirective, TimePickerComponent, TimePickerModule, TooltipComponent, TooltipModule, TooltipsModule, TreeViewCheckableDirective, TreeViewComponent, TreeViewDisableDirective, TreeViewExpandableDirective, TreeViewModule, TreeViewNodeTextTemplateDirective, TreeViewSelectableDirective, WindowComponent, WindowModule, WindowRef, WindowService, WindowTitleTemplateDirective };
//# sourceMappingURL=mona-ui.mjs.map
