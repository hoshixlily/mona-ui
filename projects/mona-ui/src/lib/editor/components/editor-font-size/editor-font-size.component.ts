import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DropDownListComponent } from "../../../dropdowns/drop-down-list/components/drop-down-list/drop-down-list.component";
import { FontSizeDropdownListDataItem } from "../../models/FontSizeDropdownListDataItem";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-font-size",
    standalone: true,
    imports: [DropDownListComponent, FormsModule],
    templateUrl: "./editor-font-size.component.html",
    styleUrl: "./editor-font-size.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorFontSizeComponent implements OnInit {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly fontSizes: FontSizeDropdownListDataItem[] = [
        { text: "12px", value: "12px" },
        { text: "14px", value: "14px" },
        { text: "16px", value: "16px" },
        { text: "18px", value: "18px" },
        { text: "24px", value: "24px" },
        { text: "36px", value: "36px" }
    ];
    protected readonly selectedFontSize = computed(() => {
        this.#editorService.state();
        return (
            this.fontSizes.find(fs => this.#editorService.editor.isActive("textStyle", { fontSize: fs.value })) ?? null
        );
    });

    public ngOnInit(): void {
        // this.#editorService.editor.chain().focus().setFontSize(this.selectedFontSize().value).run();
    }

    public onFontSizeChange(fontSizeItem: FontSizeDropdownListDataItem): void {
        this.#editorService.editor.chain().focus().setFontSize(fontSizeItem.value).run();
    }
}
