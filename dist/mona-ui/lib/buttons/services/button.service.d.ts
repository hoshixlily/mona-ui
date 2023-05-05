import { ButtonDirective } from "../modules/button/directives/button.directive";
import { ReplaySubject, Subject } from "rxjs";
import * as i0 from "@angular/core";
export declare class ButtonService {
    static readonly ID: string;
    readonly buttonClick$: ReplaySubject<ButtonDirective>;
    readonly buttonSelect$: Subject<[ButtonDirective, boolean]>;
    readonly buttonSelected$: Subject<ButtonDirective>;
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ButtonService>;
}
