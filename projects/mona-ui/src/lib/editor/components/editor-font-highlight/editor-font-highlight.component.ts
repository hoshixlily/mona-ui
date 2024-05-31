import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { ColorPickerComponent } from "../../../inputs/color-picker/components/color-picker/color-picker.component";
import { ColorPickerValueTemplateDirective } from "../../../inputs/color-picker/directives/color-picker-value-template.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-font-highlight",
    standalone: true,
    imports: [ColorPickerComponent, ColorPickerValueTemplateDirective, FaIconComponent, FormsModule],
    templateUrl: "./editor-font-highlight.component.html",
    styleUrl: "./editor-font-highlight.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorFontHighlightComponent {
    readonly #editorService: EditorService = inject(EditorService);
    #lastColor: string = "";
    protected readonly highlightIcon = faDroplet;
    protected readonly selectedColor = computed(() => {
        const state = this.#editorService.state();
        if (state.selection.empty) {
            const marks = state.storedMarks || state.selection.$from.marks();
            const highlightMark = marks.find(mark => mark.type.name === "highlight");
            return highlightMark ? highlightMark.attrs["color"] : this.#lastColor;
        } else {
            const node = state.doc.nodeAt(state.selection.from);
            if (node) {
                const highlightMark = node.marks.find(mark => mark.type.name === "highlight");
                return highlightMark ? highlightMark.attrs["color"] : this.#lastColor;
            }
            return "";
        }
    });

    public onColorChange(color: string): void {
        if (color) {
            this.#editorService.editor.chain().focus().setHighlight({ color }).run();
            this.#lastColor = color;
        } else {
            this.#editorService.editor.chain().focus().unsetHighlight().run();
        }
    }
}
