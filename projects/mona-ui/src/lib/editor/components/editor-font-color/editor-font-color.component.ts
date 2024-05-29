import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ColorPickerComponent } from "../../../inputs/color-picker/color-picker.component";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-font-color",
    standalone: true,
    imports: [ColorPickerComponent, FormsModule],
    templateUrl: "./editor-font-color.component.html",
    styleUrl: "./editor-font-color.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorFontColorComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly selectedColor = computed(() => {
        this.#editorService.state();
        const attributes = this.#editorService.editor.getAttributes("textStyle");
        return attributes["color"];
    });
    public onColorChange(color: string): void {
        this.#editorService.editor.chain().focus().setColor(color).run();
    }
}
