import { InjectionToken } from "@angular/core";
import { PopupSettings } from "./PopupSettings";

export const PopupDataInjectionToken = new InjectionToken("PopupInjectionToken");
export const PopupSettingsInjectionToken = new InjectionToken<PopupSettings>("PopupSettingsInjectionToken");
