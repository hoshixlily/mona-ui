import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-horizontal-rule",
    standalone: true,
    imports: [ButtonDirective, FaIconComponent],
    templateUrl: "./editor-horizontal-rule.component.html",
    styleUrl: "./editor-horizontal-rule.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorHorizontalRuleComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly horizontalRuleIcon = faMinus;

    public onHorizontalRuleClick(): void {
        this.#editorService.editor.chain().focus().setHorizontalRule().run();
    }
}
