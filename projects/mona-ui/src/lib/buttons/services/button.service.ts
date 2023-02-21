import { Injectable } from "@angular/core";
import { ButtonDirective } from "../modules/button/directives/button.directive";
import { ReplaySubject, Subject } from "rxjs";
import { v4 } from "uuid";

@Injectable()
export class ButtonService {
    public static readonly ID = v4();
    public readonly buttonClick$: ReplaySubject<ButtonDirective> = new ReplaySubject<ButtonDirective>(1);
    public readonly buttonSelect$: Subject<[ButtonDirective, boolean]> = new Subject<[ButtonDirective, boolean]>();
    public readonly buttonSelected$: Subject<ButtonDirective> = new Subject<ButtonDirective>();
    public constructor() {}
}
