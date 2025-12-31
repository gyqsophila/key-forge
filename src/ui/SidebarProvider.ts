import * as vscode from 'vscode';
import { LevelManager } from '../core/LevelManager';
import { Level } from '../types';

export class SidebarProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | null | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private levelManager: LevelManager) {
        this.levelManager.onDidChangeLevel(() => this.refresh());
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getParent(element: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem> {
        // Levels are root items, so they have no parent (return null/undefined).
        // Description items are children of LevelItems.
        // However, since we dynamically create Description items inside getChildren(LevelItem)
        // and they are simple TreeItems, we might not have a back-reference to the parent 
        // unless we store it.
        // For 'reveal' to work on ROOT items (LevelItems), returning null is sufficient.
        // We only reveal LevelItems.
        return null;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (element instanceof LevelItem) {
            // Return description as a child item
            const descItem = new vscode.TreeItem(element.fullDescription, vscode.TreeItemCollapsibleState.None);
            descItem.iconPath = new vscode.ThemeIcon('info');
            return Promise.resolve([descItem]);
        }

        if (element) {
            return Promise.resolve([]);
        }

        const levels = this.levelManager.getLevels();
        const currentLevel = this.levelManager.getCurrentLevel();

        return Promise.resolve(levels.map(level => {
            const isCurrent = level.id === currentLevel.id;
            const isCompleted = this.levelManager.isLevelCompleted(level.id);

            return new LevelItem(
                level.title,
                level.description,
                isCurrent ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
                level.id,
                isCurrent,
                isCompleted
            );
        }));
    }

    public async getLevelItem(levelId: string): Promise<LevelItem | undefined> {
        // Since we don't cache items, we need to regenerate them.
        // This is inefficient but acceptable for small lists.
        const children = await this.getChildren();
        return (children as LevelItem[]).find(item => item.levelId === levelId);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

class LevelItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly fullDescription: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly levelId: string,
        public readonly isCurrent: boolean,
        public readonly isCompleted: boolean
    ) {
        super(label, collapsibleState);
        this.id = levelId; // CRITICAL for find/reveal to work with new instances
        this.tooltip = fullDescription;
        // Do not set this.description to avoid it cluttering the label line
        // this.description = fullDescription; 

        if (isCurrent) {
            this.iconPath = new vscode.ThemeIcon('play-circle');
            this.contextValue = 'current-level';
        } else if (isCompleted) {
            this.iconPath = new vscode.ThemeIcon('check');
            this.contextValue = 'completed-level';
        } else {
            this.iconPath = new vscode.ThemeIcon('circle-outline');
        }

        // Only set command if it's a leaf node? 
        // No, we want clicking the level name to verify/start level too.
        // But clicking checks "selection" in TreeView. 
        // Note: In VS Code, clicking a parent node expands/collapses it. 
        // If we want it to also Start the level, triggering command on click might configure with `command` property.
        // However, standard behavior is expand/collapse.
        // Let's keep the command. VS Code allows command on clickable parent nodes, but it might conflict with expand behavior depending on where you click (arrow vs text).
        // Actually, usually it's better to keep the command for "starting".
        // Let's try keeping it.
        this.command = {
            command: 'keyforge.start',
            title: 'Start Level',
            arguments: [this.levelId]
        };
    }
}
