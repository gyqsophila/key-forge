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

    private currentProfile: 'vscode' | 'vim' = 'vscode';

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadProgress();
    }

    public setProfile(profile: 'vscode' | 'vim') {
        if (this.currentProfile !== profile) {
            this.currentProfile = profile;
            // 切换模式后，重置到该模式的第一关
            this.currentLevelIndex = 0;
            // 通知 UI 刷新 (通过重发当前关卡事件，虽然不太优雅，但 SidebarProvider 会刷新)
            // 更好的做法是 SidebarProvider 暴露 refresh 接口，或者这里发一个 Generic Event
            // 但既然 SidebarProvider 监听 onDidChangeLevel 并调用 refresh，我们可以发一个 dummy event 或者
            // 我们还是修改 startLevel 来触发刷新吧。
            this._onDidChangeLevel.fire(this.getCurrentLevel());
        }
    }

    public getProfile(): 'vscode' | 'vim' {
        return this.currentProfile;
    }

    public getLevels(): Level[] {
        if (this.currentProfile === 'vim') {
            return levels.filter(l => l.tags.includes('vim'));
        } else {
            return levels.filter(l => !l.tags.includes('vim'));
        }
    }

    public getCurrentLevel(): Level {
        const filteredLevels = this.getLevels();
        // 确保 index 不越界
        if (this.currentLevelIndex >= filteredLevels.length) {
            this.currentLevelIndex = 0;
        }
        return filteredLevels[this.currentLevelIndex];
    }

    public async startLevel(levelId: string) {
        const filteredLevels = this.getLevels();
        const index = filteredLevels.findIndex(l => l.id === levelId);

        if (index !== -1) {
            // 清理上一个关卡的环境
            await this.teardownEnvironment();

            this.currentLevelIndex = index;
            await this.setupEnvironment(filteredLevels[index]);
            this._onDidChangeLevel.fire(filteredLevels[index]);
        }
    }

    public async nextLevel() {
        const filteredLevels = this.getLevels();
        if (this.currentLevelIndex < filteredLevels.length - 1) {
            this.currentLevelIndex++;
            await this.startLevel(filteredLevels[this.currentLevelIndex].id);
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
