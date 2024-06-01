import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DropDownListComponent } from "../../../dropdowns/drop-down-list/components/drop-down-list/drop-down-list.component";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-font-family",
    standalone: true,
    imports: [DropDownListComponent, FormsModule],
    templateUrl: "./editor-font-family.component.html",
    styleUrl: "./editor-font-family.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorFontFamilyComponent implements OnInit {
    protected readonly editorService: EditorService = inject(EditorService);
    protected readonly selectedFontFamily = computed(() => {
        this.editorService.state();
        return (
            this.editorService
                .fonts()
                .firstOrDefault(ff => this.editorService.editor.isActive("textStyle", { fontFamily: ff })) ?? null
        );
    });

    public ngOnInit(): void {
        const defaultFontFamily = this.editorService.fonts().first();
        this.editorService.editor.chain().focus().setFontFamily(defaultFontFamily).run();
    }

    public onFontFamilyChange(fontFamily: string): void {
        this.editorService.editor.chain().focus().setFontFamily(fontFamily).run();
    }
}
