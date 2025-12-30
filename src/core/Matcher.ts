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
                // 暂时简单处理：只要有变动就触发检查
                // 实际应该分析 changeKind
            }
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
            // 特殊处理 Undo - 很难直接监听，通常看内容变化
            // 这里为了演示，我们假设如果用户按了 Undo，内容会变回以前的状态。
        }

        // 2. Content Based Verification
        if (currentLevel.trigger.type === 'content' && currentLevel.trigger.matchContent) {
            // Normalize: remove CR (\r) for consistent comparison across platforms
            const docText = document.getText().replace(/\r/g, '').trim();
            const expectedText = currentLevel.trigger.matchContent.replace(/\r/g, '').trim();

            if (docText === expectedText) {
                this.onSuccess(currentLevel.title);
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
        vscode.window.showInformationMessage(`✅ 完成任务: ${levelTitle}`, "下一关").then(selection => {
            if (selection === "下一关") {
                this.levelManager.nextLevel();
            }
        });
    }

    public dispose() {
        this.disposables.forEach(d => d.dispose());
    }
}
