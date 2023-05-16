import { ApplicationRef, Injectable } from "@angular/core";
import { DialogType } from "../models/DialogType";
import { DialogAction } from "../models/DialogAction";
import { DialogSettings } from "../models/DialogSettings";
import { DialogRef } from "../models/DialogRef";
import { WindowService } from "./window.service";
import { DialogContentComponent } from "../components/dialog-content/dialog-content.component";
import { of, Subject, take } from "rxjs";
import { DialogHandler } from "../models/DialogHandler";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    public constructor(private readonly appRef: ApplicationRef, private readonly windowService: WindowService) {}

    private static getDefaultActions(type: DialogType | undefined): DialogAction[] {
        if (type === "confirm") {
            return [
                { primary: true, text: "OK", closeOnClick: false },
                { primary: false, text: "Cancel", closeOnClick: true }
            ];
        }
        return [{ primary: false, text: "OK", closeOnClick: true }];
    }

    private static getDefaultTitle(type: DialogType | undefined): string {
        if (!type) {
            return "Message";
        }
        switch (type) {
            case "confirm":
                return "Confirm";
            case "error":
                return "Error";
            case "info":
                return "Info";
            case "input":
                return "Input";
            case "success":
                return "Success";
            case "warning":
                return "Warning";
        }
    }

    public show(settings: DialogSettings): DialogRef {
        const windowRef = this.windowService.open({
            content: DialogContentComponent,
            minHeight: 155,
            height: settings?.height,
            width: settings?.width ?? 425,
            modal: settings?.modal ?? true,
            title: settings?.title ?? DialogService.getDefaultTitle(settings?.type),
            draggable: true,
            windowClass: ["mona-dialog-window"]
        });
        const dialogHandler: DialogHandler = {
            close: () => {
                windowRef.close();
                dialogHandler.closed$.next({ viaClose: false });
            },
            closed$: new Subject()
        };

        const component = windowRef.component?.instance as DialogContentComponent;
        component.actions = settings?.actions ?? DialogService.getDefaultActions(settings?.type);
        component.inputType = settings?.inputType ?? "string";
        component.text = settings?.text ?? "";
        component.type = settings?.type ?? "info";

        if (component.inputType === "number") {
            component.valueNumber = (settings?.value as number) ?? null;
        } else {
            component.valueString = (settings?.value as string) ?? "";
        }
        component.dialogHandler = dialogHandler;
        windowRef.close$.pipe(take(1)).subscribe({
            next: event => dialogHandler.closed$.next({ viaClose: event.via === "closeButton" })
        });
        return component.dialogRef;
    }
}
