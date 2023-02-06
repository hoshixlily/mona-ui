import { MenuItem } from "./MenuItem";

export interface ContextMenuNavigationEvent {
    currentItem: MenuItem | null;
    direction: "down" | "up" | "left" | "right";
    previousItem: MenuItem | null;
}
