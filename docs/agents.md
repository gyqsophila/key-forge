# KeyForge 开发指南

本文档定义了 KeyForge 项目的开发规范、技术栈、目录结构和工作流程规则。

---

## 技术栈

| 类别 | 技术 | 版本要求 |
|------|------|----------|
| 语言 | Go | >= 1.21 |
| CLI 框架 | [Cobra](https://github.com/spf13/cobra) | latest |
| 终端 UI | [Bubble Tea](https://github.com/charmbracelet/bubbletea) | latest |
| 样式渲染 | [Lipgloss](https://github.com/charmbracelet/lipgloss) | latest |
| 配置管理 | [Viper](https://github.com/spf13/viper) | latest |
| 按键捕获 | [keyboard](https://github.com/eiannone/keyboard) | latest |
| 数据格式 | YAML (关卡) / JSON (用户数据) | - |

---

## 目录结构

```
keyforge/
├── cmd/                        # 命令行入口
│   └── keyforge/
│       └── main.go             # 主程序入口
│
├── internal/                   # 内部包 (不对外暴露)
│   ├── cli/                    # CLI 命令定义
│   │   ├── root.go             # 根命令
│   │   ├── play.go             # play 命令
│   │   ├── hint.go             # hint 命令
│   │   ├── levels.go           # levels 命令
│   │   ├── stats.go            # stats 命令
│   │   └── config.go           # config 命令
│   │
│   ├── engine/                 # 核心游戏引擎
│   │   ├── game.go             # 游戏主控制器
│   │   ├── level.go            # 关卡数据结构与加载
│   │   └── verifier.go         # 按键捕获与验证
│   │
│   ├── storage/                # 数据持久化
│   │   ├── progress.go         # 用户进度存储
│   │   └── stats.go            # 统计数据存储
│   │
│   └── ui/                     # 终端 UI 组件
│       ├── renderer.go         # 渲染器
│       └── styles.go           # 样式定义
│
├── levels/                     # 关卡定义文件 (YAML)
│   ├── beginner/               # 初级关卡 (001-030)
│   ├── intermediate/           # 中级关卡 (101-140)
│   ├── advanced/               # 高级关卡 (201-230)
│   └── vim/                    # Vim 专属关卡 (V01-V50)
│
├── docs/                       # 项目文档
│   ├── PRD.md                  # 产品需求文档
│   └── agents.md               # 开发指南 (本文档)
│
├── configs/                    # 配置模板
│   └── default.yaml            # 默认配置
│
├── scripts/                    # 构建/发布脚本
│   ├── build.sh
│   └── release.sh
│
├── go.mod
├── go.sum
├── README.md
└── .gitignore
```

### 目录职责说明

| 目录 | 职责 | 注意事项 |
|------|------|----------|
| `cmd/` | 程序入口点 | 只包含 main 函数，尽量薄 |
| `internal/` | 内部业务逻辑 | 不暴露给外部，Go 编译器强制 |
| `levels/` | 关卡 YAML 文件 | 文件名格式: `{id}_{name}.yaml` |
| `docs/` | 文档 | 使用 Markdown 格式 |
| `configs/` | 配置模板 | 用户配置存放于 `~/.keyforge/` |

---

## 代码规范

### 命名约定

```go
// 包名：小写单词
package engine

// 导出类型：大驼峰
type LevelLoader struct {}

// 私有类型：小驼峰
type levelCache struct {}

// 常量：大驼峰或全大写
const MaxHints = 3
const DEFAULT_TIMEOUT = 30

// 接口：以 -er 结尾 (如适用)
type Verifier interface {}
```

### 错误处理

```go
// ✅ 始终使用 error wrapping
if err != nil {
    return fmt.Errorf("加载关卡失败 %s: %w", id, err)
}

// ✅ 自定义错误类型用于可区分的错误
var ErrLevelNotFound = errors.New("关卡不存在")

// ❌ 避免 panic，除非是不可恢复的错误
```

### 日志规范

```go
// 使用结构化日志 (推荐 slog 或 zerolog)
slog.Info("关卡加载完成", "count", len(levels))
slog.Error("验证失败", "expected", expected, "actual", actual)
```

---

## 关卡文件规范

### 文件命名

```
{难度目录}/{ID}_{英文名}.yaml

示例:
levels/beginner/001_save_file.yaml
levels/intermediate/101_quick_open.yaml
levels/vim/V01_normal_mode.yaml
```

### YAML 结构

```yaml
id: "001"                      # 必填，唯一标识
name: "保存文件"                # 必填，中文名称
category: "basic"              # 必填，分类标签
difficulty: "beginner"         # 必填，beginner|intermediate|advanced
profile: "vscode"              # 必填，vscode|vim|both

description: |                 # 必填，场景描述
  你刚写完一段代码，需要保存文件。

expected_keys:                 # 必填，平台快捷键
  macos: ["Cmd", "S"]
  windows: ["Ctrl", "S"]
  linux: ["Ctrl", "S"]

hints:                         # 必填，分级提示 (至少 1 条)
  - "提示1：基础提示"
  - "提示2：更明确的提示"
  - "提示3：几乎是答案"

tips: |                        # 可选，助记技巧
  💡 S = Save

prerequisites: []              # 可选，前置关卡 ID 列表
tags: ["file", "basic"]        # 可选，标签列表
```

### 按键格式

| 按键类型 | 格式示例 |
|----------|----------|
| 修饰键 | `Cmd`, `Ctrl`, `Alt`, `Shift`, `Option` |
| 字母键 | `A`, `B`, `S` (大写) |
| 功能键 | `F1`, `F2`, ..., `F12` |
| 特殊键 | `Space`, `Enter`, `Esc`, `Tab`, `Backspace` |
| 方向键 | `Up`, `Down`, `Left`, `Right` |
| Vim 键 | `j`, `k`, `h`, `l`, `w`, `b`, `dd`, `yy` (小写) |

---

## 用户数据存储

用户数据统一存储在 `~/.keyforge/` 目录：

```
~/.keyforge/
├── config.yaml          # 用户配置
├── data/
│   ├── progress.json    # 训练进度
│   └── stats.json       # 详细统计
└── levels/              # 用户自定义关卡 (可选)
    └── custom/
```

### 配置文件格式

```yaml
# ~/.keyforge/config.yaml
profile: vscode          # vscode | vim
platform: auto           # auto | macos | windows | linux
language: zh-CN
```

---

## Git 工作流

### 分支命名

| 类型 | 格式 | 示例 |
|------|------|------|
| 功能 | `feat/{描述}` | `feat/vim-mode` |
| 修复 | `fix/{描述}` | `fix/key-capture` |
| 文档 | `docs/{描述}` | `docs/readme` |
| 重构 | `refactor/{描述}` | `refactor/engine` |

### Commit 消息规范

```
<type>: <简短描述>

type 可选值:
- feat:     新功能
- fix:      Bug 修复
- docs:     文档更新
- style:    代码格式 (不影响逻辑)
- refactor: 重构
- test:     测试
- chore:    构建/工具

示例:
feat: 添加 Vim 模式关卡支持
fix: 修复 macOS 下 Cmd 键捕获问题
docs: 更新 README 安装说明
```

---

## 开发流程

### 1. 新功能开发

```bash
# 1. 创建功能分支
git checkout -b feat/feature-name

# 2. 开发并测试
go test ./...

# 3. 提交代码
git add .
git commit -m "feat: 功能描述"

# 4. 合并到主分支
git checkout main
git merge feat/feature-name
```

### 2. 添加新关卡

```bash
# 1. 在对应难度目录创建 YAML 文件
vim levels/beginner/002_select_all.yaml

# 2. 验证 YAML 格式
go run cmd/keyforge/main.go validate-levels

# 3. 本地测试
go run cmd/keyforge/main.go play

# 4. 提交
git add levels/
git commit -m "feat: 添加关卡 002 - 全选"
```

### 3. 构建发布

```bash
# 构建所有平台
./scripts/build.sh

# 输出:
# dist/keyforge-darwin-amd64
# dist/keyforge-darwin-arm64
# dist/keyforge-linux-amd64
# dist/keyforge-windows-amd64.exe
```

---

## 测试规范

### 单元测试

```go
// 文件命名: xxx_test.go
// 测试函数: TestXxx

func TestLevelLoader_LoadAll(t *testing.T) {
    loader := NewLevelLoader("./testdata/levels")
    err := loader.LoadAll()
    if err != nil {
        t.Fatalf("加载失败: %v", err)
    }
    // ...
}
```

### 测试命令

```bash
# 运行所有测试
go test ./...

# 运行特定包测试
go test ./internal/engine/...

# 查看覆盖率
go test -cover ./...
```

---

## 常见问题

### Q: 如何添加新的快捷键支持？

1. 在 `internal/engine/verifier.go` 的 `parseKey` 函数中添加按键映射
2. 更新测试用例
3. 在关卡 YAML 中使用新按键

### Q: 如何支持新平台？

1. 在 `PlatformKeys` 结构体中添加新平台字段
2. 更新 `detectPlatform()` 函数
3. 更新所有关卡 YAML 的 `expected_keys`

### Q: 用户数据如何迁移？

用户数据存储在 `~/.keyforge/data/` 目录，直接复制到新环境即可。

---

*最后更新: 2024-12*
