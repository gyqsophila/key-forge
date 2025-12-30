import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Level } from '../types';
import { levels } from '../data/levels';

export class LevelManager {
    private currentLevelIndex: number = 0;
    private context: vscode.ExtensionContext;
    private _onDidChangeLevel = new vscode.EventEmitter<Level>();
    readonly onDidChangeLevel = this._onDidChangeLevel.event;
    private currentTempFilePath: string | undefined;

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
            // 清理上一个关卡的环境
            await this.teardownEnvironment();

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
            await this.teardownEnvironment();
            vscode.window.showInformationMessage("🎉 恭喜！你已完成所有训练关卡！");
        }
    }

    private async setupEnvironment(level: Level) {
        if (!level.setup) return;

        // 创建临时文件
        const extension = level.setup.fileType === 'javascript' ? 'js' : 'txt';
        const tempDir = os.tmpdir();
        const fileName = `keyforge_level_${level.id}.${extension}`;
        this.currentTempFilePath = path.join(tempDir, fileName);

        // 写入初始内容
        fs.writeFileSync(this.currentTempFilePath, level.setup.initialContent || '');

        // 打开文件
        const doc = await vscode.workspace.openTextDocument(this.currentTempFilePath);
        const editor = await vscode.window.showTextDocument(doc);

        // 设置光标位置
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

    private async teardownEnvironment() {
        // 关闭所有编辑器
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        // 删除临时文件
        if (this.currentTempFilePath && fs.existsSync(this.currentTempFilePath)) {
            try {
                fs.unlinkSync(this.currentTempFilePath);
            } catch (error) {
                console.error('Failed to cleanup temp file:', error);
            }
            this.currentTempFilePath = undefined;
        }
    }

    private loadProgress() {
        // TODO: 从 globalState 加载
    }
}
