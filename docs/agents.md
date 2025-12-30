# KeyForge 开发指南 (VSCode Extension Edition)

## 1. 技术栈规范

| 组件 | 技术选型 | 版本要求 |
|---|---|---|
| **Language** | TypeScript | 5.3+ |
| **Runtime** | VSCode Extension Host | 1.85+ |
| **UI Framework** | React (Webview) | 18+ |
| **Package Manager** | npm | 9+ |
| **Linter** | ESLint + Prettier | - |

---

## 2. 工程目录结构

```
keyforge-vscode/
├── .vscode/               # 调试配置
├── media/                 # 静态资源 (icons, svg)
├── src/
│   ├── extension.ts       # 插件入口 (激活、注册命令)
│   ├── types.ts           # 全局类型定义
│   ├── core/              # 核心业务逻辑
│   │   ├── LevelManager.ts  # 管理关卡加载与进度
│   │   ├── Matcher.ts       # 验证逻辑 (核心算法)
│   │   └── Storage.ts       # Memento 存储封装
│   ├── data/              # 关卡数据源
│   │   ├── levels.json      # 关卡定义文件
│   │   └── profiles/        # 预设配置
│   ├── ui/                # UI 相关代码
│   │   ├── SidebarProvider.ts  # 侧边栏 TreeView
│   │   └── WebviewPanel.ts     # 任务详情页
│   └── utils/             # 工具函数
├── package.json           # 插件清单 (Manifest)
└── tsconfig.json          # TS 配置
```

---

## 3. 核心开发规范

### 3.1 关卡设计哲学
*   **原子性 (Atomic)**：每个关卡只训练一个核心动作。
*   **可重置 (Resettable)**：关卡必须能随时重置到初始状态，通过 `LevelManager.resetLevel()` 实现。
*   **非侵入 (Non-intrusive)**：尽量使用临时文件 (`Untitled` Document) 进行训练，避免修改用户现有文件。

### 3.2 验证机制 (Verification System)
这是区别于 CLI 版的核心。我们不再验证"按键"，而是验证"结果"。

#### A. 基于命令的验证 (Command-based)
适用于不需要改变文件内容的动作，如"打开命令面板"、"切换侧边栏"。
*   **实现方式**：由于 VSCode 官方 `onDidExecuteCommand` API 仅限特定的内部命令，我们可能需要采用"特定上下文"策略或监听特定副作用。
*   **Hack 方案**：对于部分无法直接监听的命令，可以通过验证其产生的 UI 状态变化（如 activeEditor 改变）。

#### B. 基于内容的验证 (Content-based)
适用于编辑类动作。
*   **实现方式**：监听 `workspace.onDidChangeTextDocument`。
*   **算法**：比较操作后的 `document.getText()` 与 `level.expectedContent` 是否一致，或者使用正则匹配。

#### C. 基于状态的验证 (State-based)
适用于光标移动、选区操作。
*   **实现方式**：监听 `window.onDidChangeTextEditorSelection`。

### 3.3 数据存储
*   **GlobalState**：用于存储用户进度（已完成关卡 ID 列表、统计数据）。
*   **WorkspaceState**：本插件暂不依赖工作区状态，确保跨窗口体验一致。

---

## 4. 开发工作流

### 4.1 环境准备
```bash
# 安装依赖
npm install

# 启动 watch 模式 (TSC)
npm run watch

# F5 启动 "Extension Development Host"
```

### 4.2 添加新关卡
1.  在 `src/data/levels.json` 中添加关卡定义对象。
2.  如果是需要特定代码环境的关卡，在 `src/assets/templates/` 下创建对应的代码模板。
3.  无需重启 VSCode，执行 `KeyForge: Reload Levels` 命令（需开发此命令）即可热加载。

---

## 5. 打包与发布

```bash
# 打包成 .vsix
vsce package

# 发布到 Marketplace
vsce publish
```
