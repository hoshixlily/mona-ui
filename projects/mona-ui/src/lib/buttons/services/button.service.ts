import { Injectable } from "@angular/core";
import { ButtonDirective } from "../button/button.directive";
import { ReplaySubject, Subject } from "rxjs";

@Injectable()
export class ButtonService {
    public readonly buttonClick$: ReplaySubject<ButtonDirective> = new ReplaySubject<ButtonDirective>(1);
    public readonly buttonSelect$: Subject<[ButtonDirective, boolean]> = new Subject<[ButtonDirective, boolean]>();
    public readonly buttonSelected$: Subject<ButtonDirective> = new Subject<ButtonDirective>();
    public constructor() {}
}
