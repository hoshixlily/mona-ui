import { inject, Injectable } from "@angular/core";
import { PopupRef } from "../../popup/models/PopupRef";
import { PopupService } from "../../popup/services/popup.service";
import { ContextMenuSettings } from "../models/ContextMenuSettings";

@Injectable({
    providedIn: "root"
})
export class ContextMenuService {
    readonly #popupService: PopupService = inject(PopupService);

    public open(settings: ContextMenuSettings): PopupRef {
        return this.#popupService.create({
            ...settings,
            hasBackdrop: false
        });
    }
}
