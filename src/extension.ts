import * as vscode from 'vscode';
import { LevelManager } from './core/LevelManager';
import { SidebarProvider } from './ui/SidebarProvider';
import { DescriptionProvider } from './ui/DescriptionProvider';
import { Matcher } from './core/Matcher';

export function activate(context: vscode.ExtensionContext) {
    console.log('KeyForge is now active!');

    const levelManager = new LevelManager(context);
    const sidebarProvider = new SidebarProvider(levelManager);
    const matcher = new Matcher(levelManager);

    // 使用 createTreeView 以便获取 View 实例进行 reveal 操作
    const treeView = vscode.window.createTreeView('keyforge.levels', {
        treeDataProvider: sidebarProvider
    });

    // 监听关卡变更，自动展开和选中
    levelManager.onDidChangeLevel(async (level) => {
        // 等待 TreeView 刷新? 
        // SidebarProvider 监听了同一个事件并调用 refresh()。
        // refresh() fire event 是同步的，VSCode 虽然异步更新 UI，但我们在这里尝试获取 Item。

        // 我们需要确保 getChildren 返回的是新状态下的 Item (isCurrent=true)。
        // 由于 refresh() 已经触发，SidebarProvider.getChildren() 会被 VSCode 调用。
        // 我们手动调用 sidebarProvider.getLevelItem() 也会重新生成
        const item = await sidebarProvider.getLevelItem(level.id);
        if (item) {
            // reveal(item, { select: true, focus: true, expand: true });
            // expand: 3 (Recursive) might be too much, but let's try true (level 1)
            try {
                // Feature: Auto-collapse others (Accordion style)
                // This command ID depends on the view ID defined in package.json
                await vscode.commands.executeCommand('workbench.actions.treeView.keyforge.levels.collapseAll');

                await treeView.reveal(item, { select: true, focus: false, expand: true });
            } catch (e) {
                console.error("Failed to reveal item", e);
            }
        }
    });

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

    // 注册 WebviewViewProvider (描述窗口)
    const descriptionProvider = new DescriptionProvider(context.extensionUri, levelManager);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(DescriptionProvider.viewType, descriptionProvider)
    );

    context.subscriptions.push(startCmd, resetCmd, profileCmd, treeView);

    // Startup Logic
    if (levelManager.hasProgress()) {
        // Resume session
        levelManager.restoreSession();
    } else {
        // First time: prompt
        vscode.commands.executeCommand('keyforge.selectProfile');
    }
}

export function deactivate() { }
