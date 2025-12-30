import * as vscode from 'vscode';
import { Level, UserProgress } from '../types';
import { levels } from '../data/levels';

export class LevelManager {
    private currentLevelIndex: number = 0;
    private context: vscode.ExtensionContext;
    private _onDidChangeLevel = new vscode.EventEmitter<Level>();
    readonly onDidChangeLevel = this._onDidChangeLevel.event;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadProgress();
    }

    public getLevels(): Level[] {
        return levels;
    }

    public getCurrentLevel(): Level {
        return levels[this.currentLevelIndex];
    }

    public async startLevel(levelId: string) {
        const index = levels.findIndex(l => l.id === levelId);
        if (index !== -1) {
            this.currentLevelIndex = index;
            await this.setupEnvironment(levels[index]);
            this._onDidChangeLevel.fire(levels[index]);
        }
    }

    public async nextLevel() {
        if (this.currentLevelIndex < levels.length - 1) {
            this.currentLevelIndex++;
            await this.startLevel(levels[this.currentLevelIndex].id);
        } else {
            vscode.window.showInformationMessage("🎉 恭喜！你已完成所有训练关卡！");
        }
    }

    private async setupEnvironment(level: Level) {
        // 1. 关闭当前所有编辑器 (可选，避免混乱)
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        if (!level.setup) return;

        // 2. 创建临时文件
        const doc = await vscode.workspace.openTextDocument({
            content: level.setup.initialContent || '',
            language: level.setup.fileType || 'plaintext'
        });

        // 3. 显示文件
        const editor = await vscode.window.showTextDocument(doc);

        // 4. 设置光标位置
        if (level.setup.initialSelection) {
            const pos = new vscode.Position(
                level.setup.initialSelection.line,
                level.setup.initialSelection.character
            );
            editor.selection = new vscode.Selection(pos, pos);
            editor.revealRange(new vscode.Range(pos, pos));
        }

        vscode.window.setStatusBarMessage(`👉 任务: ${level.title}`, 5000);
    }

    private loadProgress() {
        // TODO: 从 globalState 加载
    }
}
