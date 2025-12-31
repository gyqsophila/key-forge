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

    private completedLevels: Set<string> = new Set();
    private static STORAGE_KEY = 'keyforge.progress';

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.loadProgress();
    }

    public hasProgress(): boolean {
        // 如果有上次活跃的 Profile 或已有完成的关卡，则视为有进度
        const saved = this.context.globalState.get<any>(LevelManager.STORAGE_KEY);
        return !!saved;
    }

    public setProfile(profile: 'vscode' | 'vim') {
        if (this.currentProfile !== profile) {
            this.currentProfile = profile;
            // 切换 Profile 时，不强制重置为 0，而是尝试恢复到该 Profile 的进度
            this.restoreSession(profile, false);
        }
    }

    public getProfile(): 'vscode' | 'vim' {
        return this.currentProfile;
    }

    public getCompletedLevels(): string[] {
        return Array.from(this.completedLevels);
    }

    public isLevelCompleted(levelId: string): boolean {
        return this.completedLevels.has(levelId);
    }

    public markCurrentLevelComplete() {
        const currentId = this.getCurrentLevel().id;
        if (!this.completedLevels.has(currentId)) {
            this.completedLevels.add(currentId);
            this.saveProgress();
        }
    }

    /**
     * 恢复会话
     * @param forceProfile 如果指定，强制使用该 Profile，否则尝试使用上次保存的 Profile
     * @param autoStart 是否自动开始关卡
     */
    public async restoreSession(forceProfile?: 'vscode' | 'vim', autoStart: boolean = true) {
        if (forceProfile) {
            this.currentProfile = forceProfile;
        }

        // 查找当前 Profile 下第一个未完成的关卡
        const filteredLevels = this.getLevels();
        let nextLevelIndex = filteredLevels.findIndex(l => !this.completedLevels.has(l.id));

        if (nextLevelIndex === -1 && filteredLevels.length > 0) {
            // 如果都完成了，停留在最后一关? 或者第一关?
            // 这里选择第一关，或者我们可以做个 "全部完成" 的状态。
            // 暂时设为 0 (第一关)
            nextLevelIndex = 0;
        }

        this.currentLevelIndex = nextLevelIndex !== -1 ? nextLevelIndex : 0;

        // 保存当前状态 (Profile 可能变了)
        this.saveProgress();

        if (autoStart) {
            await this.startLevel(this.getCurrentLevel().id);
        } else {
            // 即使不自动开始，也应该触发事件刷新 UI
            this._onDidChangeLevel.fire(this.getCurrentLevel());
        }
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
            const choice = await vscode.window.showInformationMessage(
                "🎉 恭喜！你已完成所有训练关卡！要重新挑战吗？",
                { modal: true },
                "再来一次", "退出"
            );

            if (choice === "再来一次") {
                await this.resetProgress();
            }
        }
    }

    private async resetProgress() {
        // 清空当前 Profile 下的已完成关卡
        const levels = this.getLevels();
        const levelIds = levels.map(l => l.id);

        // 从 completedLevels 中移除当前 profile 的所有关卡 ID
        levelIds.forEach(id => this.completedLevels.delete(id));

        // 重置索引
        this.currentLevelIndex = 0;

        // 保存清除后的状态
        this.saveProgress();

        // 重新开始第一关
        if (levels.length > 0) {
            await this.startLevel(levels[0].id);
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

    private saveProgress() {
        const data = {
            lastActiveProfile: this.currentProfile,
            completedLevels: Array.from(this.completedLevels),
            lastLevelId: this.getCurrentLevel().id
        };
        this.context.globalState.update(LevelManager.STORAGE_KEY, data);
    }

    private loadProgress() {
        const data = this.context.globalState.get<any>(LevelManager.STORAGE_KEY);
        if (data) {
            if (data.lastActiveProfile) {
                this.currentProfile = data.lastActiveProfile;
            }
            if (data.completedLevels && Array.isArray(data.completedLevels)) {
                this.completedLevels = new Set(data.completedLevels);
            }
        }
    }
}
