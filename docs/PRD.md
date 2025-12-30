# KeyForge 产品需求文档 (VSCode 插件版)

## 1. 产品概述 (Product Overview)

### 1.1 产品名称
KeyForge (VSCode Edition)

### 1.2 背景与价值 (Background & Value)
尽管 VSCode 拥有强大的快捷键系统，但开发者往往只使用最基础的几个组合。现有的学习方式（查表、记忆）枯燥且脱离实际场景。CLI 版工具虽然能训练记忆，但无法提供真实的"上下文"和"肌肉记忆"。

KeyForge 插件旨在**将训练融入 IDE 本身**。它不是一个外部的问答工具，而是一个在开发者真实的编码环境中，通过监听实际操作来提供反馈的智能教练。

**核心价值：**
*   **场景化训练**：在真实的编辑器窗口中练习，直接操作代码文件。
*   **零干扰感知**：通过 Extension API 监听命令触发，不需要用户切换窗口或手动提交答案。
*   **即时正反馈**：操作正确立即获得祝贺，操作错误提供非打断式提示。

### 1.3 目标用户 (Target Audience)
*   想要从鼠标流转变为键盘流的 VSCode 用户。
*   希望在 VSCode 中掌握 Vim 高效编辑模式的开发者。
*   需要快速熟悉新 IDE 快捷键的迁移用户。

---

## 2. 核心功能 (Core Features)

### 2.1 交互流程 (User Flow)

1.  **侧边栏引导**：用户在 VSCode 侧边栏 (Activity Bar) 点击 KeyForge 图标，展开关卡列表。
2.  **关卡激活**：点击某个关卡，「KeyForge 教练」自动配置环境：
    *   打开一个临时的练习文件（如 `exercise.js`）。
    *   在编辑器中填入特定的代码片段。
    *   在状态栏或侧边栏显示当前任务：“使用快捷键删除当前行”。
3.  **实战操作**：用户在编辑器中直接按下 `Cmd+Shift+K` (macOS) 或 `Ctrl+Shift+K` (Windows)。
4.  **智能判定**：插件监听到 `editor.action.deleteLines` 命令被触发，判定任务完成。
5.  **即时反馈**：弹出 🎉 动画，自动跳转下一关。

### 2.2 功能模块 (Feature Modules)

#### 2.2.1 关卡系统 (Level System)
| 功能点 | 描述 | 优先级 |
|---|---|---|
| **环境预设** | 每个关卡可定义初始文件内容、光标位置、文件类型 | P0 |
| **触发验证** | 验证完成的标准：触发特定 Command ID 或文档内容变为特定状态 | P0 |
| **场景描述** | 嵌入在侧边栏 Webview 中的富文本任务描述 | P0 |
| **自动重置** | 练习失败或想重试时，一键重置文件内容到初始状态 | P1 |

#### 2.2.2 验证引擎 (Verification Engine)
利用 VSCode Extension API 进行多维度的验证：
*   **Command 监听**：监听 `vscode.commands.onDidExecuteCommand` (需要 trick 或特定 API)，或通过封装一层代理命令。
*   **Document 监听**：监听 `vscode.workspace.onDidChangeTextDocument`，验证文本变更是否符合预期（例如：多光标编辑产生的特定文本结构）。
*   **State 监听**：监听 `isDirty` (是否保存)、`selections` (光标位置) 等状态。

#### 2.2.3 进度管理 (Progress)
*   利用 `ExtensionContext.globalState` 存储用户通关记录。
*   侧边栏 TreeView 实时显示关卡解锁/完成状态（🔒/✅/▶️）。

#### 2.2.4 Vim 模式支持 (Vim Support)
*   检测用户是否安装了 `vscodevim` 插件。
*   针对 Vim 关卡，提供专门的验证逻辑（如监听 Mode 变化，监听 Vim 特有的操作序列）。

---

## 3. 技术架构 (Technical Architecture)

### 3.1 技术栈 (Tech Stack)
*   **Core**: TypeScript
*   **Runtime**: Node.js (VSCode内置环境)
*   **Extension API**: VSCode API (commands, window, workspace, webview)
*   **UI Framework**: React (用于侧边栏 Webview 和复杂的任务展示页)
*   **Build Tool**: Webpack / esbuild

### 3.2 目录结构 (Directory Structure)

```
keyforge-vscode/
├── src/
│   ├── commands/          # 注册的插件命令 (如: resetLevel, nextLevel)
│   ├── data/              # 关卡数据 (YAML/JSON)
│   ├── engine/            # 游戏引擎
│   │   ├── ConditionMatcher.ts # 验证逻辑核心
│   │   ├── LevelLoader.ts      # 关卡加载
│   │   └── StateMachine.ts     # 关卡状态流转
│   ├── providers/         # TreeView 数据提供者
│   ├── views/             # Webview UI (React组件)
│   └── extension.ts       # 入口文件
├── media/                 # 图标、图片资源
├── package.json           # 插件清单 (Manifest)
└── tsconfig.json
```

### 3.3 关卡定义规范 (Level Definition Schema)

关卡将使用 JSON 或 YAML 定义：

```yaml
id: "basic-delete-line"
title: "删除当前行"
description: "快速删除代码中不需要的行，无需选中整行。"

# 环境初始化
setup:
  language: "javascript"
  content: |
    function hello() {
      console.log("Keep this line");
      console.log("Delete this line"); // <-- Cursor here
      return true;
    }
  cursor: { line: 2, character: 10 }

# 验证条件 (满足其一即可)
win_conditions:
  - type: "command_triggered"
    commandId: "editor.action.deleteLines"
    
  - type: "content_match"
    expected: |
      function hello() {
        console.log("Keep this line");
        return true;
      }
```

---

## 4. 实施路线图 (Roadmap)

### Phase 1: 核心验证原型 (P0)
*   搭建 VSCode 插件脚手架。
*   实现 Sidebar TreeView 展示关卡列表。
*   实现基本的"命令监听"机制。
*   完成 5 个基础关卡 (保存、删除行、复制、撤销)。

### Phase 2: 沉浸式体验 (P1)
*   引入 Webview 优化任务描述界面。
*   实现环境自动初始化 (自动新建临时文件并写入代码)。
*   支持丰富的验证条件 (光标位置验证、文本内容验证)。

### Phase 3: 高级功能 (P2)
*   Vim 专项训练模块。
*   统计大屏 (Dashboard Webview)。
*   自定义关卡导入。
