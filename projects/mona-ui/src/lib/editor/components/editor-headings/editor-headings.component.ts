import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DropDownItemTemplateDirective } from "../../../dropdowns/directives/drop-down-item-template.directive";
import { DropDownListComponent } from "../../../dropdowns/drop-down-list/components/drop-down-list/drop-down-list.component";
import { HeadingsDropdownListDataItem, HeadingType } from "../../models/HeadingsDropdownListDataItem";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-headings",
    standalone: true,
    imports: [DropDownListComponent, FormsModule, DropDownItemTemplateDirective],
    templateUrl: "./editor-headings.component.html",
    styleUrl: "./editor-headings.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorHeadingsComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly HeadingType = HeadingType;
    protected readonly headingsDropdownListData = [
        { text: "Paragraph", value: HeadingType.Paragraph },
        { text: "Heading 1", value: HeadingType.Heading1 },
        { text: "Heading 2", value: HeadingType.Heading2 },
        { text: "Heading 3", value: HeadingType.Heading3 },
        { text: "Heading 4", value: HeadingType.Heading4 },
        { text: "Heading 5", value: HeadingType.Heading5 },
        { text: "Heading 6", value: HeadingType.Heading6 }
    ];
    protected readonly selectedHeadingsDropdownItem = computed(() => {
        const state = this.#editorService.state();
        const node = state.selection.$from.node();
        if (node && node.type.name === "heading") {
            return this.headingsDropdownListData.find(item => item.value === node.attrs["level"]);
        }
        return this.headingsDropdownListData.find(item => item.value === HeadingType.Paragraph);
    });

    public onFormatChange(headingItem: HeadingsDropdownListDataItem): void {
        if (headingItem.value === HeadingType.Paragraph) {
            this.#editorService.editor.chain().focus().setParagraph().run();
        } else {
            this.#editorService.editor.chain().focus().setHeading({ level: headingItem.value }).run();
        }
    }
}
