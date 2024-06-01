import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { ColorPickerComponent } from "../../../inputs/color-picker/components/color-picker/color-picker.component";
import { ColorPickerValueTemplateDirective } from "../../../inputs/color-picker/directives/color-picker-value-template.directive";
import { ColorService } from "../../../inputs/services/color.service";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-font-color",
    standalone: true,
    imports: [ColorPickerComponent, FormsModule, ColorPickerValueTemplateDirective, FaIconComponent],
    templateUrl: "./editor-font-color.component.html",
    styleUrl: "./editor-font-color.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorFontColorComponent {
    readonly #editorService: EditorService = inject(EditorService);
    #lastColor: string = "";
    protected readonly fontIcon = faFont;
    protected readonly selectedColor = computed(() => {
        this.#editorService.state();
        const attributes = this.#editorService.editor.getAttributes("textStyle");
        const color = attributes["color"] || this.#lastColor;
        return ColorService.getHtmlColorCode(color);
    });

    public onColorChange(color: string): void {
        this.#editorService.editor.chain().focus().setColor(color).run();
        this.#lastColor = color;
    }
}
