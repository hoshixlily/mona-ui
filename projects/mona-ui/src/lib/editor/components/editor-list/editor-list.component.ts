import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faListOl, faListUl } from "@fortawesome/free-solid-svg-icons";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-list",
    standalone: true,
    imports: [ButtonGroupComponent, ButtonDirective, FaIconComponent],
    templateUrl: "./editor-list.component.html",
    styleUrl: "./editor-list.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorListComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly orderedListIcon = faListOl;
    protected readonly orderedListSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("orderedList");
    });
    protected readonly unorderedListIcon = faListUl;
    protected readonly unorderedListSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("bulletList");
    });

    public onOrderedListToggle(): void {
        this.#editorService.editor.chain().focus().toggleOrderedList().run();
    }

    public onUnorderedListToggle(): void {
        this.#editorService.editor.chain().focus().toggleBulletList().run();
    }
}
