import * as vscode from 'vscode';
import { LevelManager } from '../core/LevelManager';
import { Level } from '../types';

export class SidebarProvider implements vscode.TreeDataProvider<LevelItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<LevelItem | undefined | null | void> = new vscode.EventEmitter<LevelItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<LevelItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private levelManager: LevelManager) {
        // 当关卡变化时刷新列表高亮状态 (将来实现)
    }

    getTreeItem(element: LevelItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: LevelItem): Thenable<LevelItem[]> {
        if (element) {
            return Promise.resolve([]);
        }

        const levels = this.levelManager.getLevels();
        const currentLevel = this.levelManager.getCurrentLevel();

        return Promise.resolve(levels.map(level => {
            const isCurrent = level.id === currentLevel.id;
            return new LevelItem(
                level.title,
                level.description,
                isCurrent ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.None,
                level.id,
                isCurrent
            );
        }));
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

class LevelItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly levelId: string,
        public readonly isCurrent: boolean
    ) {
        super(label, collapsibleState);
        this.tooltip = description;
        this.description = description;

        if (isCurrent) {
            this.iconPath = new vscode.ThemeIcon('play-circle');
            this.contextValue = 'current-level';
        } else {
            this.iconPath = new vscode.ThemeIcon('circle-outline');
        }

        this.command = {
            command: 'keyforge.start',
            title: 'Start Level',
            arguments: [this.levelId]
        };
    }
}
