import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { take } from "rxjs";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { DialogService } from "../../../window/services/dialog.service";
import { EditorService } from "../../services/editor.service";

@Component({
    selector: "mona-editor-link",
    standalone: true,
    imports: [ButtonGroupComponent, ButtonDirective],
    templateUrl: "./editor-link.component.html",
    styleUrl: "./editor-link.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorLinkComponent {
    readonly #dialogService: DialogService = inject(DialogService);
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly linkSelected = computed(() => {
        this.#editorService.state();
        return this.#editorService.editor.isActive("link");
    });
    protected readonly unlinkDisabled = computed(() => {
        this.#editorService.state();
        return !this.#editorService.editor.isActive("link");
    });

    public onLinkDialogDisplay(): void {
        const link = this.#editorService.editor.getAttributes("link")["href"] ?? "";
        const dialogRef = this.#dialogService.show({
            title: "Insert Link",
            type: "input",
            inputType: "string",
            text: "Enter the URL",
            value: link
        });
        dialogRef.result.pipe(take(1)).subscribe(result => this.setLink(result.value as string));
    }

    public onUnlinkClick(): void {
        this.#editorService.editor.chain().focus().unsetLink().run();
    }

    private setLink(url: string): void {
        if (!url) {
            this.#editorService.editor.chain().focus().unsetLink().run();
            return;
        }
        this.#editorService.editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
}
