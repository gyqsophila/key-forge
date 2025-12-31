import * as vscode from 'vscode';
import { LevelManager } from '../core/LevelManager';
import { Level } from '../types';

export class DescriptionProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'keyforge.description';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
        private readonly levelManager: LevelManager
    ) {
        // Listen to level changes
        this.levelManager.onDidChangeLevel((level) => {
            this.updateContent(level);
        });
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        // Initialize with current level
        this.updateContent(this.levelManager.getCurrentLevel());
    }

    private updateContent(level: Level | undefined) {
        if (!this._view) {
            return;
        }

        if (!level) {
            this._view.webview.html = this.getHtmlContent("<h3>Ready to start?</h3>");
            return;
        }

        const tagsHtml = level.tags.map(t => `<span class="tag">${t}</span>`).join('');
        const hintsHtml = level.hints.map(h => `<li>${h}</li>`).join('');

        const content = `
            <h2>${level.title}</h2>
            <div class="tags">${tagsHtml}</div>
            <p class="description">${level.description}</p>
            
            ${level.trigger.matchContent ? `
            <div class="target-box">
                <h4>🎯 Target Content:</h4>
                <pre><code>${level.trigger.matchContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
            </div>
            ` : ''}

            ${level.hints.length > 0 ? `
            <div class="hints-box">
                <h4>💡 Hints:</h4>
                <ul>${hintsHtml}</ul>
            </div>
            ` : ''}
        `;

        this._view.webview.html = this.getHtmlContent(content);
    }

    private getHtmlContent(bodyContent: string): string {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    color: var(--vscode-foreground);
                    padding: 10px;
                    line-height: 1.5;
                }
                h2 {
                    margin-top: 0;
                    color: var(--vscode-textLink-foreground);
                }
                .tags {
                    margin-bottom: 10px;
                }
                .tag {
                    background-color: var(--vscode-badge-background);
                    color: var(--vscode-badge-foreground);
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 0.85em;
                    margin-right: 5px;
                }
                .description {
                    font-size: 1.1em;
                    margin-bottom: 15px;
                }
                .target-box {
                    background-color: var(--vscode-editor-background);
                    border: 1px solid var(--vscode-widget-border);
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                }
                .target-box h4 {
                    margin-top: 0;
                    margin-bottom: 5px;
                }
                pre {
                    margin: 0;
                    overflow-x: auto;
                }
                .hints-box {
                    background-color: var(--vscode-textBlockQuote-background);
                    border-left: 4px solid var(--vscode-textBlockQuote-border);
                    padding: 10px;
                }
                .hints-box h4 {
                    margin-top: 0;
                    margin-bottom: 5px;
                }
                ul {
                    margin: 0;
                    padding-left: 20px;
                }
            </style>
        </head>
        <body>
            ${bodyContent}
        </body>
        </html>`;
    }
}
