import * as vscode from 'vscode';
import { LevelManager } from './core/LevelManager';
import { SidebarProvider } from './ui/SidebarProvider';
import { Matcher } from './core/Matcher';

export function activate(context: vscode.ExtensionContext) {
    console.log('KeyForge is now active!');

    const levelManager = new LevelManager(context);
    const sidebarProvider = new SidebarProvider(levelManager);
    const matcher = new Matcher(levelManager);

    // 注册 Sidebar
    vscode.window.registerTreeDataProvider('keyforge.levels', sidebarProvider);

    // 注册命令：开始训练
    let startCmd = vscode.commands.registerCommand('keyforge.start', (levelId?: string) => {
        if (levelId) {
            levelManager.startLevel(levelId);
        } else {
            // 默认开始第一关
            levelManager.startLevel(levelManager.getCurrentLevel().id);
        }
    });

    // 注册命令：重置
    let resetCmd = vscode.commands.registerCommand('keyforge.resetLevel', () => {
        levelManager.startLevel(levelManager.getCurrentLevel().id);
    });

    // 注册命令：选择模式 (Profile)
    let profileCmd = vscode.commands.registerCommand('keyforge.selectProfile', async () => {
        const selected = await vscode.window.showQuickPick(['VSCode', 'Vim'], {
            placeHolder: 'Select Training Profile'
        });

        if (selected) {
            const profile = selected.toLowerCase() as 'vscode' | 'vim';
            levelManager.setProfile(profile);
            vscode.window.showInformationMessage(`Switched to ${selected} profile`);
        }
    });

    context.subscriptions.push(startCmd, resetCmd, profileCmd);

    // Hack: 监听 Undo 命令 (通过重写内置 undo 命令的 keybinding 是不推荐的)
    // 在 Extension 中，通常通过 sync 状态或 Proxy Command 来实现
    // 这里作为 MVP，我们展示一个手动触发的逻辑作为演示
}

export function deactivate() { }
