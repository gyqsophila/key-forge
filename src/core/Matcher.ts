import * as vscode from 'vscode';
import { LevelManager } from './LevelManager';

export class Matcher {
    private levelManager: LevelManager;
    private disposables: vscode.Disposable[] = [];

    constructor(levelManager: LevelManager) {
        this.levelManager = levelManager;
        this.registerListeners(); // Global listener
    }

    private registerListeners() {
        // 监听命令执行
        // 注意：onDidExecuteCommand 是一个 Proposed API，在稳定版中可能不可用，
        // 或者只能监听 extension 注册的命令。
        // 对于内置命令，通常需要 verify by state change (Content/Selection/Dirty).

        // 但对于 MVP，我们可以利用 "side effect" 验证。
        // 例如：保存文件 -> 监听 onDidSaveTextDocument
        vscode.workspace.onDidSaveTextDocument((doc) => {
            this.check(doc, 'workbench.action.files.save');
        }, null, this.disposables);

        // 监听文本变化 (Undo/Delete)
        vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.contentChanges.length > 0) {
                this.check(e.document);
            }
        }, null, this.disposables);

        // 监听光标变化 (Selection)
        vscode.window.onDidChangeTextEditorSelection((e) => {
            this.check(e.textEditor.document);
        }, null, this.disposables);
    }

    public async check(document: vscode.TextDocument, commandId?: string) {
        const currentLevel = this.levelManager.getCurrentLevel();
        if (!currentLevel) return;

        // 1. Command Based Verification (Indirect)
        if (currentLevel.trigger.type === 'command') {
            // 特殊处理 Save
            if (currentLevel.trigger.commandId === 'workbench.action.files.save' && commandId === 'workbench.action.files.save') {
                this.onSuccess(currentLevel.title);
                return;
            }
        }

        // 2. Content Based Verification
        if (currentLevel.trigger.type === 'content' && currentLevel.trigger.matchContent) {
            // Using includes() allows for trailing newlines differences, 
            // while ensuring the core content modification is present.
            // We still normalize CR for Windows compatibility.
            const docText = document.getText().replace(/\r/g, '');
            const expectedText = currentLevel.trigger.matchContent.replace(/\r/g, '');

            if (docText.includes(expectedText)) {
                this.onSuccess(currentLevel.title);
                return;
            }
        }

        // 3. Selection Based Verification
        if (currentLevel.trigger.type === 'selection' && currentLevel.trigger.matchSelection) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document === document) {
                const selection = editor.selection;
                const target = currentLevel.trigger.matchSelection;

                // Allow a small tolerance?? No, Vim training should be precise.
                if (selection.active.line === target.line && selection.active.character === target.character) {
                    this.onSuccess(currentLevel.title);
                    return;
                }
            }
        }
    }

    public manualCheckCommand(commandId: string) {
        const currentLevel = this.levelManager.getCurrentLevel();
        if (currentLevel && currentLevel.trigger.commandId === commandId) {
            this.onSuccess(currentLevel.title);
        }
    }

    private onSuccess(levelTitle: string) {
        // 1. Mark complete immediately
        this.levelManager.markCurrentLevelComplete();

        // 2. Show success message
        vscode.window.setStatusBarMessage(`✅ 完成任务: ${levelTitle} | 正在跳转下一关...`, 3000);

        // 3. Auto-advance after a short delay
        setTimeout(() => {
            this.levelManager.nextLevel();
        }, 1500);
    }

    public dispose() {
        this.disposables.forEach(d => d.dispose());
    }
}
