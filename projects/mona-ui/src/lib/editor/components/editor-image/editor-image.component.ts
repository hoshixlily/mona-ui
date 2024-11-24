import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { WindowComponent } from "../../../window/components/window/window.component";
import { EditorImageInsertEvent } from "../../models/EditorImageInsertEvent";
import { EditorService } from "../../services/editor.service";
import { EditorImageInserterComponent } from "../editor-image-inserter/editor-image-inserter.component";

@Component({
    selector: "mona-editor-image",
    imports: [WindowComponent, EditorImageInserterComponent, ButtonDirective],
    templateUrl: "./editor-image.component.html",
    styleUrl: "./editor-image.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorImageComponent {
    readonly #editorService: EditorService = inject(EditorService);
    protected readonly inserterVisible = signal(false);

    public onDisplayInserterClick(): void {
        this.inserterVisible.set(true);
    }

    public onImageInsert(event: EditorImageInsertEvent): void {
        this.insertImage(event);
        this.closeInserter();
    }

    public onInsertCancel(): void {
        this.closeInserter();
    }

    public onInserterClose(): void {
        this.closeInserter();
    }

    private closeInserter(): void {
        this.inserterVisible.set(false);
    }

    private insertImage(event: EditorImageInsertEvent): void {
        this.#editorService.editor
            .chain()
            .setImage({
                src: event.link,
                alt: event.altText,
                title: event.altText
            })
            .updateAttributes("extendedImage", {
                width: event.width,
                height: event.height
            })
            .run();
    }
}
