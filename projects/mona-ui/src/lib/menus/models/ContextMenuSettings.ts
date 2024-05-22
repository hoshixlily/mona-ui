import { PopupSettings } from "../../popup/models/PopupSettings";

export interface ContextMenuSettings extends Omit<PopupSettings, "hasBackdrop"> {}
