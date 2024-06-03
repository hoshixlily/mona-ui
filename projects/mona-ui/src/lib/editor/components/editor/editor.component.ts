import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    input,
    OnDestroy,
    untracked,
    viewChild
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ButtonGroupComponent } from "../../../buttons/button-group/button-group.component";
import { ButtonDirective } from "../../../buttons/button/button.directive";
import { DropDownItemTemplateDirective } from "../../../dropdowns/directives/drop-down-item-template.directive";
import { DropDownListComponent } from "../../../dropdowns/drop-down-list/components/drop-down-list/drop-down-list.component";
import { EditorSettings } from "../../models/EditorSettings";
import { EditorService } from "../../services/editor.service";
import { EditorBasicTextStylesComponent } from "../editor-basic-text-styles/editor-basic-text-styles.component";
import { EditorBlockquoteComponent } from "../editor-blockquote/editor-blockquote.component";
import { EditorFontColorComponent } from "../editor-font-color/editor-font-color.component";
import { EditorFontFamilyComponent } from "../editor-font-family/editor-font-family.component";
import { EditorFontHighlightComponent } from "../editor-font-highlight/editor-font-highlight.component";
import { EditorFontSizeComponent } from "../editor-font-size/editor-font-size.component";
import { EditorHeadingsComponent } from "../editor-headings/editor-headings.component";
import { EditorHistoryComponent } from "../editor-history/editor-history.component";
import { EditorHorizontalRuleComponent } from "../editor-horizontal-rule/editor-horizontal-rule.component";
import { EditorImageComponent } from "../editor-image/editor-image.component";
import { EditorIndentComponent } from "../editor-indent/editor-indent.component";
import { EditorLinkComponent } from "../editor-link/editor-link.component";
import { EditorListComponent } from "../editor-list/editor-list.component";
import { EditorTableComponent } from "../editor-table/editor-table.component";
import { EditorTaskListComponent } from "../editor-task-list/editor-task-list.component";
import { EditorTextAlignmentsComponent } from "../editor-text-alignments/editor-text-alignments.component";

@Component({
    selector: "mona-editor",
    standalone: true,
    imports: [
        ButtonDirective,
        ButtonGroupComponent,
        FaIconComponent,
        DropDownListComponent,
        DropDownItemTemplateDirective,
        FormsModule,
        EditorBasicTextStylesComponent,
        EditorHeadingsComponent,
        EditorTextAlignmentsComponent,
        EditorFontSizeComponent,
        EditorFontColorComponent,
        EditorFontHighlightComponent,
        EditorBlockquoteComponent,
        EditorLinkComponent,
        EditorListComponent,
        EditorIndentComponent,
        EditorHistoryComponent,
        EditorFontFamilyComponent,
        EditorHorizontalRuleComponent,
        EditorTaskListComponent,
        EditorImageComponent,
        EditorTableComponent
    ],
    templateUrl: "./editor.component.html",
    styleUrl: "./editor.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [EditorService],
    host: {
        class: "mona-editor"
    }
})
export class EditorComponent implements OnDestroy {
    protected readonly editorContainer = viewChild.required<ElementRef<HTMLDivElement>>("editorContainer");
    protected readonly editorService: EditorService = inject(EditorService);
    public settings = input<Partial<EditorSettings>>({});

    public constructor() {
        effect(() => {
            const settings = this.settings();
            untracked(() => {
                this.editorService.setupEditor(this.editorContainer().nativeElement, settings);
            });
        });
    }

    public ngOnDestroy(): void {
        this.editorService.destroy();
    }
}
