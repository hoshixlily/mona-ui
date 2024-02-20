import { TabComponent } from "../components/tab/tab.component";

export class TabCloseEvent {
    public index: number;
    public selected: boolean;

    public constructor(index: number, tabComponent: TabComponent) {
        this.index = index;
        this.selected = tabComponent.selected();
    }
}
