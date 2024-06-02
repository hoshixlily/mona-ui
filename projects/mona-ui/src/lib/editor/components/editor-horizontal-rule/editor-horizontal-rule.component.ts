import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-horizontal-rule",
    standalone: true,
    imports: [ButtonDirective],
    templateUrl: "./editor-horizontal-rule.component.html",
    styleUrl: "./editor-horizontal-rule.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorHorizontalRuleComponent {
    readonly #editorService: EditorService = inject(EditorService);

    public onHorizontalRuleClick(): void {
        this.#editorService.editor.chain().focus().setHorizontalRule().run();
    }
}
