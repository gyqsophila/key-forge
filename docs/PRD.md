# KeyForge - 编辑器快捷键训练工具

## 产品需求文档 (PRD)

---

## 1. 产品概述

### 1.1 产品定位

**KeyForge** 是一个基于命令行的交互式编辑器快捷键训练工具，灵感来源于 [Githug](https://github.com/Gazler/githug)。通过关卡制的挑战模式，帮助用户快速掌握 VSCode 和 VSCode+Vim 的快捷键组合，形成肌肉记忆。

### 1.2 目标用户

- 刚接触 VSCode 的新手开发者
- 希望提升编码效率的中级开发者
- 想要学习 Vim 模式的 VSCode 用户
- 从其他编辑器迁移到 VSCode 的开发者

### 1.3 核心价值

| 痛点 | 解决方案 |
|------|----------|
| 快捷键太多，难以记忆 | 分类分级，循序渐进 |
| 缺乏实践场景 | 情景化挑战，模拟真实编辑场景 |
| 遗忘快 | 间隔重复训练，强化记忆 |
| 无法追踪进度 | 完整的进度追踪和统计系统 |

---

## 2. 功能列表

### 2.1 核心功能

```
┌─────────────────────────────────────────────────────────────────┐
│                        KeyForge 功能架构                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  关卡系统   │  │  训练模式   │  │      进度追踪           │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────────┤  │
│  │ • 解锁机制  │  │ • 挑战模式  │  │ • 完成状态             │  │
│  │ • 难度分级  │  │ • 自由练习  │  │ • 统计数据             │  │
│  │ • 场景描述  │  │ • 复习模式  │  │ • 弱项分析             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  键位配置   │  │  提示系统   │  │      命令行接口         │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────────┤  │
│  │ • VSCode    │  │ • 分级提示  │  │ • play/hint/reset      │  │
│  │ • VSCode+Vim│  │ • 答案展示  │  │ • levels/stats         │  │
│  │ • 自定义    │  │ • 助记技巧  │  │ • config               │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 详细功能清单

#### 2.2.1 关卡系统 (Level System)

| 功能 | 描述 | 优先级 | 进度 |
|------|------|--------|------|
| 关卡定义 | YAML/JSON 格式的关卡配置文件 | P0 | ✅ 已完成 |
| 难度分级 | 初级/中级/高级三个难度等级 | P0 | ✅ 已完成 |
| 分类标签 | 按功能分类：导航、编辑、搜索、调试等 | P0 | ✅ 已完成 |
| 场景描述 | 每个关卡包含实际使用场景的描述 | P0 | ✅ 已完成 |
| 解锁机制 | 完成前置关卡后解锁后续关卡 | P1 | ⬜ 待开发 |
| 自定义关卡 | 用户可以创建自定义关卡 | P2 | ⬜ 待开发 |

#### 2.2.2 训练模式 (Training Modes)

| 功能 | 描述 | 优先级 | 进度 |
|------|------|--------|------|
| 挑战模式 | 按顺序完成关卡，类似 Githug | P0 | ✅ 已完成 |
| 自由练习 | 可选择任意已解锁关卡练习 | P1 | ⬜ 待开发 |
| 复习模式 | 基于遗忘曲线的间隔重复复习 | P2 | ⬜ 待开发 |
| 限时模式 | 在限定时间内完成挑战 | P2 | ⬜ 待开发 |
| 随机模式 | 随机抽取已解锁关卡进行测试 | P2 | ⬜ 待开发 |

#### 2.2.3 键位配置 (Keymap Profiles)

| 功能 | 描述 | 优先级 | 进度 |
|------|------|--------|------|
| VSCode 默认 | 支持 VSCode 原生快捷键 | P0 | ✅ 已完成 |
| VSCode + Vim | 支持 Vim 扩展的额外快捷键 | P0 | ✅ 已完成 |
| 平台适配 | 自动识别 macOS/Windows/Linux | P0 | ✅ 已完成 |
| 自定义映射 | 允许用户导入自定义 keybindings.json | P2 | ⬜ 待开发 |

#### 2.2.4 交互命令 (CLI Commands)

| 命令 | 描述 | 示例 |
|------|------|------|
| `keyforge play` | 开始/继续当前关卡 | `keyforge play` |
| `keyforge hint` | 获取当前关卡提示 | `keyforge hint` |
| `keyforge answer` | 查看答案（会扣分） | `keyforge answer` |
| `keyforge reset` | 重置当前关卡 | `keyforge reset` |
| `keyforge reset all` | 重置所有进度 | `keyforge reset all` |
| `keyforge levels` | 查看所有关卡列表 | `keyforge levels` |
| `keyforge stats` | 查看训练统计 | `keyforge stats` |
| `keyforge config` | 配置键位方案 | `keyforge config --profile vim` |

#### 2.2.5 进度与统计 (Progress & Stats)

| 功能 | 描述 | 优先级 | 进度 |
|------|------|--------|------|
| 进度保存 | 本地保存训练进度 | P0 | ✅ 已完成 |
| 完成统计 | 已完成/总关卡数量 | P0 | ✅ 已完成 |
| 响应时间 | 记录每次回答的响应时间 | P1 | ✅ 已完成 |
| 错误分析 | 分析最常出错的快捷键 | P1 | ⬜ 待开发 |
| 弱项推荐 | 基于错误率推荐复习内容 | P2 | ⬜ 待开发 |

---

## 3. 技术架构

### 3.1 系统架构图

```
┌────────────────────────────────────────────────────────────────────┐
│                           KeyForge                                  │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   CLI Layer  │───▶│  Game Engine │───▶│   Storage Layer      │  │
│  │   (Cobra)    │    │              │    │   (Local JSON/YAML)  │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│         │                   │                      │                │
│         ▼                   ▼                      ▼                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   Terminal   │    │ Level Loader │    │   Progress Store     │  │
│  │   Renderer   │    │              │    │                      │  │
│  │ (lipgloss/   │    ├──────────────┤    ├──────────────────────┤  │
│  │  bubbletea)  │    │ Key Verifier │    │   Statistics Store   │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 目录结构

```
keyforge/
├── cmd/                    # 命令行入口
│   └── keyforge/
│       └── main.go
├── internal/
│   ├── cli/               # CLI 命令定义
│   │   ├── root.go
│   │   ├── play.go
│   │   ├── hint.go
│   │   ├── levels.go
│   │   └── stats.go
│   ├── engine/            # 核心游戏引擎
│   │   ├── game.go
│   │   ├── level.go
│   │   └── verifier.go
│   ├── keymap/            # 键位映射
│   │   ├── keymap.go
│   │   ├── vscode.go
│   │   └── vim.go
│   ├── storage/           # 数据存储
│   │   ├── progress.go
│   │   └── stats.go
│   └── ui/                # 终端 UI
│       ├── renderer.go
│       └── styles.go
├── levels/                # 关卡定义文件
│   ├── beginner/
│   ├── intermediate/
│   └── advanced/
├── configs/               # 配置文件
│   └── keymaps/
└── go.mod
```

### 3.3 技术选型

| 组件 | 技术选择 | 理由 |
|------|----------|------|
| CLI 框架 | [Cobra](https://github.com/spf13/cobra) | Go 生态最流行的 CLI 框架 |
| 终端 UI | [Bubble Tea](https://github.com/charmbracelet/bubbletea) | 现代化的终端 UI 框架 |
| 样式渲染 | [Lipgloss](https://github.com/charmbracelet/lipgloss) | 声明式终端样式 |
| 配置解析 | [Viper](https://github.com/spf13/viper) | 支持多种配置格式 |
| 按键捕获 | [keyboard](https://github.com/eiannone/keyboard) | 跨平台键盘事件捕获 |
| 数据存储 | JSON/YAML 文件 | 轻量级，无需数据库依赖 |

---

## 4. 核心模块实现方案

### 4.1 关卡定义结构 (Level Definition)

关卡使用 YAML 格式定义，便于阅读和维护。

```yaml
# levels/beginner/001_save_file.yaml
id: "001"
name: "保存文件"
category: "basic"
difficulty: "beginner"
profile: "vscode"  # vscode | vim | both

description: |
  你刚写完一段代码，现在需要保存文件。
  请输入正确的快捷键组合来保存当前文件。

scenario: "save_file"

expected_keys:
  macos: ["Cmd", "S"]
  windows: ["Ctrl", "S"]
  linux: ["Ctrl", "S"]

hints:
  - "这是一个非常基础的操作，几乎所有编辑器都使用相同的快捷键"
  - "在 macOS 上，Command 键替代了 Windows/Linux 上的 Ctrl 键"
  - "答案是 Cmd+S (macOS) 或 Ctrl+S (Windows/Linux)"

tips: |
  💡 助记技巧：S = Save，简单直接！

prerequisites: []  # 前置关卡 ID 列表

tags: ["file", "basic", "essential"]
```

#### 关卡数据结构的 Go 实现

```go
// internal/engine/level.go
package engine

import (
    "fmt"
    "os"
    "path/filepath"
    "gopkg.in/yaml.v3"
)

// Level 表示一个训练关卡
type Level struct {
    ID            string            `yaml:"id"`
    Name          string            `yaml:"name"`
    Category      string            `yaml:"category"`
    Difficulty    Difficulty        `yaml:"difficulty"`
    Profile       KeymapProfile     `yaml:"profile"`
    Description   string            `yaml:"description"`
    Scenario      string            `yaml:"scenario"`
    ExpectedKeys  PlatformKeys      `yaml:"expected_keys"`
    Hints         []string          `yaml:"hints"`
    Tips          string            `yaml:"tips"`
    Prerequisites []string          `yaml:"prerequisites"`
    Tags          []string          `yaml:"tags"`
}

type Difficulty string

const (
    DifficultyBeginner     Difficulty = "beginner"
    DifficultyIntermediate Difficulty = "intermediate"
    DifficultyAdvanced     Difficulty = "advanced"
)

type KeymapProfile string

const (
    ProfileVSCode KeymapProfile = "vscode"
    ProfileVim    KeymapProfile = "vim"
    ProfileBoth   KeymapProfile = "both"
)

// PlatformKeys 存储不同平台的快捷键
type PlatformKeys struct {
    MacOS   []string `yaml:"macos"`
    Windows []string `yaml:"windows"`
    Linux   []string `yaml:"linux"`
}

// LevelLoader 负责加载和管理关卡
type LevelLoader struct {
    levelsDir string
    levels    map[string]*Level
    order     []string // 关卡顺序
}

// NewLevelLoader 创建关卡加载器
func NewLevelLoader(levelsDir string) *LevelLoader {
    return &LevelLoader{
        levelsDir: levelsDir,
        levels:    make(map[string]*Level),
        order:     make([]string, 0),
    }
}

// LoadAll 加载所有关卡
func (l *LevelLoader) LoadAll() error {
    difficulties := []string{"beginner", "intermediate", "advanced"}
    
    for _, diff := range difficulties {
        dir := filepath.Join(l.levelsDir, diff)
        entries, err := os.ReadDir(dir)
        if err != nil {
            if os.IsNotExist(err) {
                continue
            }
            return fmt.Errorf("读取目录失败 %s: %w", dir, err)
        }
        
        for _, entry := range entries {
            if entry.IsDir() || filepath.Ext(entry.Name()) != ".yaml" {
                continue
            }
            
            level, err := l.loadLevel(filepath.Join(dir, entry.Name()))
            if err != nil {
                return fmt.Errorf("加载关卡失败 %s: %w", entry.Name(), err)
            }
            
            l.levels[level.ID] = level
            l.order = append(l.order, level.ID)
        }
    }
    
    return nil
}

func (l *LevelLoader) loadLevel(path string) (*Level, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, err
    }
    
    var level Level
    if err := yaml.Unmarshal(data, &level); err != nil {
        return nil, err
    }
    
    return &level, nil
}

// GetLevel 获取指定 ID 的关卡
func (l *LevelLoader) GetLevel(id string) (*Level, bool) {
    level, ok := l.levels[id]
    return level, ok
}

// GetNextLevel 获取下一个关卡
func (l *LevelLoader) GetNextLevel(currentID string) (*Level, bool) {
    for i, id := range l.order {
        if id == currentID && i+1 < len(l.order) {
            return l.levels[l.order[i+1]], true
        }
    }
    return nil, false
}
```

---

### 4.2 按键捕获与验证 (Key Capture & Verification)

这是整个工具的核心模块，负责捕获用户输入的按键组合并与正确答案进行比对。

```go
// internal/engine/verifier.go
package engine

import (
    "runtime"
    "sort"
    "strings"
    "time"

    "github.com/eiannone/keyboard"
)

// KeyCombination 表示一个快捷键组合
type KeyCombination struct {
    Modifiers []string // Ctrl, Alt, Shift, Cmd/Meta
    Key       string   // 主键
}

// KeyVerifier 负责验证用户输入的快捷键
type KeyVerifier struct {
    platform      string
    currentLevel  *Level
    capturedKeys  []string
    modifiersHeld map[string]bool
    startTime     time.Time
}

// NewKeyVerifier 创建按键验证器
func NewKeyVerifier() *KeyVerifier {
    return &KeyVerifier{
        platform:      detectPlatform(),
        modifiersHeld: make(map[string]bool),
    }
}

func detectPlatform() string {
    switch runtime.GOOS {
    case "darwin":
        return "macos"
    case "windows":
        return "windows"
    default:
        return "linux"
    }
}

// SetLevel 设置当前关卡
func (v *KeyVerifier) SetLevel(level *Level) {
    v.currentLevel = level
    v.capturedKeys = nil
    v.modifiersHeld = make(map[string]bool)
}

// CaptureAndVerify 捕获用户按键并验证
func (v *KeyVerifier) CaptureAndVerify() (VerifyResult, error) {
    if err := keyboard.Open(); err != nil {
        return VerifyResult{}, err
    }
    defer keyboard.Close()

    v.startTime = time.Now()
    v.capturedKeys = nil

    // 等待用户输入完整的快捷键组合
    for {
        char, key, err := keyboard.GetKey()
        if err != nil {
            return VerifyResult{}, err
        }

        // 处理按键
        keyStr := v.parseKey(char, key)
        if keyStr == "" {
            continue
        }

        // 检查是否是修饰键
        if isModifier(keyStr) {
            v.modifiersHeld[keyStr] = true
            continue
        }

        // 非修饰键，构建完整的组合
        v.capturedKeys = v.buildKeyCombination(keyStr)
        break
    }

    // 验证按键组合
    result := v.verify()
    result.ResponseTime = time.Since(v.startTime)
    
    return result, nil
}

func (v *KeyVerifier) parseKey(char rune, key keyboard.Key) string {
    // 处理特殊键
    switch key {
    case keyboard.KeyCtrlC:
        return "Ctrl+C"
    case keyboard.KeyCtrlD:
        return "Ctrl+D"
    case keyboard.KeySpace:
        return "Space"
    case keyboard.KeyEnter:
        return "Enter"
    case keyboard.KeyEsc:
        return "Esc"
    case keyboard.KeyArrowUp:
        return "Up"
    case keyboard.KeyArrowDown:
        return "Down"
    case keyboard.KeyArrowLeft:
        return "Left"
    case keyboard.KeyArrowRight:
        return "Right"
    case keyboard.KeyTab:
        return "Tab"
    case keyboard.KeyBackspace, keyboard.KeyBackspace2:
        return "Backspace"
    case keyboard.KeyDelete:
        return "Delete"
    case keyboard.KeyHome:
        return "Home"
    case keyboard.KeyEnd:
        return "End"
    case keyboard.KeyPgup:
        return "PageUp"
    case keyboard.KeyPgdn:
        return "PageDown"
    case keyboard.KeyF1:
        return "F1"
    case keyboard.KeyF2:
        return "F2"
    // ... 其他 F 键
    }

    // 处理普通字符
    if char != 0 {
        return strings.ToUpper(string(char))
    }

    return ""
}

func isModifier(key string) bool {
    modifiers := []string{"Ctrl", "Alt", "Shift", "Cmd", "Meta", "Option"}
    for _, m := range modifiers {
        if strings.EqualFold(key, m) {
            return true
        }
    }
    return false
}

func (v *KeyVerifier) buildKeyCombination(mainKey string) []string {
    var combo []string
    
    // 按固定顺序添加修饰键
    modifierOrder := []string{"Ctrl", "Alt", "Shift", "Cmd"}
    for _, mod := range modifierOrder {
        if v.modifiersHeld[mod] {
            combo = append(combo, mod)
        }
    }
    
    combo = append(combo, mainKey)
    return combo
}

// VerifyResult 验证结果
type VerifyResult struct {
    Correct      bool
    Expected     []string
    Actual       []string
    ResponseTime time.Duration
}

func (v *KeyVerifier) verify() VerifyResult {
    expected := v.getExpectedKeys()
    actual := v.capturedKeys

    result := VerifyResult{
        Expected: expected,
        Actual:   actual,
    }

    // 标准化并比较
    result.Correct = keysEqual(
        normalizeKeys(expected),
        normalizeKeys(actual),
    )

    return result
}

func (v *KeyVerifier) getExpectedKeys() []string {
    switch v.platform {
    case "macos":
        return v.currentLevel.ExpectedKeys.MacOS
    case "windows":
        return v.currentLevel.ExpectedKeys.Windows
    default:
        return v.currentLevel.ExpectedKeys.Linux
    }
}

func normalizeKeys(keys []string) []string {
    normalized := make([]string, len(keys))
    for i, k := range keys {
        normalized[i] = strings.ToLower(strings.TrimSpace(k))
    }
    sort.Strings(normalized[:len(normalized)-1]) // 只排序修饰键
    return normalized
}

func keysEqual(a, b []string) bool {
    if len(a) != len(b) {
        return false
    }
    for i := range a {
        if a[i] != b[i] {
            return false
        }
    }
    return true
}
```

---

### 4.3 游戏引擎 (Game Engine)

游戏引擎是核心控制器，负责管理游戏流程、关卡切换和状态同步。

```go
// internal/engine/game.go
package engine

import (
    "errors"
    "fmt"
)

// GameState 游戏状态
type GameState string

const (
    StateIdle      GameState = "idle"
    StatePlaying   GameState = "playing"
    StateCompleted GameState = "completed"
)

// Game 游戏引擎
type Game struct {
    loader       *LevelLoader
    verifier     *KeyVerifier
    progress     *ProgressStore
    stats        *StatsStore
    currentLevel *Level
    state        GameState
    profile      KeymapProfile
    hintLevel    int // 当前提示级别 (0 = 未使用提示)
}

// NewGame 创建游戏实例
func NewGame(levelsDir, dataDir string) (*Game, error) {
    loader := NewLevelLoader(levelsDir)
    if err := loader.LoadAll(); err != nil {
        return nil, fmt.Errorf("加载关卡失败: %w", err)
    }

    progress, err := NewProgressStore(dataDir)
    if err != nil {
        return nil, fmt.Errorf("初始化进度存储失败: %w", err)
    }

    stats, err := NewStatsStore(dataDir)
    if err != nil {
        return nil, fmt.Errorf("初始化统计存储失败: %w", err)
    }

    return &Game{
        loader:   loader,
        verifier: NewKeyVerifier(),
        progress: progress,
        stats:    stats,
        state:    StateIdle,
        profile:  ProfileVSCode,
    }, nil
}

// SetProfile 设置键位配置文件
func (g *Game) SetProfile(profile KeymapProfile) {
    g.profile = profile
}

// Play 开始或继续游戏
func (g *Game) Play() (*PlayResult, error) {
    // 获取当前关卡
    currentID := g.progress.GetCurrentLevelID()
    level, ok := g.loader.GetLevel(currentID)
    if !ok {
        // 如果没有当前进度，从第一关开始
        level = g.loader.GetFirstLevel()
        if level == nil {
            return nil, errors.New("没有可用的关卡")
        }
    }

    // 检查关卡是否适用于当前配置
    if !g.isLevelApplicable(level) {
        return nil, fmt.Errorf("关卡 %s 不适用于当前键位配置 %s", level.ID, g.profile)
    }

    g.currentLevel = level
    g.verifier.SetLevel(level)
    g.state = StatePlaying
    g.hintLevel = 0

    return &PlayResult{
        Level:       level,
        Description: level.Description,
    }, nil
}

func (g *Game) isLevelApplicable(level *Level) bool {
    if level.Profile == ProfileBoth {
        return true
    }
    return level.Profile == g.profile
}

// SubmitAnswer 提交答案
func (g *Game) SubmitAnswer() (*SubmitResult, error) {
    if g.state != StatePlaying {
        return nil, errors.New("当前没有正在进行的关卡")
    }

    // 捕获并验证按键
    verifyResult, err := g.verifier.CaptureAndVerify()
    if err != nil {
        return nil, fmt.Errorf("按键捕获失败: %w", err)
    }

    result := &SubmitResult{
        Correct:      verifyResult.Correct,
        Expected:     verifyResult.Expected,
        Actual:       verifyResult.Actual,
        ResponseTime: verifyResult.ResponseTime,
        HintsUsed:    g.hintLevel,
    }

    // 记录统计
    g.stats.RecordAttempt(g.currentLevel.ID, AttemptRecord{
        Correct:      verifyResult.Correct,
        ResponseTime: verifyResult.ResponseTime,
        HintsUsed:    g.hintLevel,
    })

    if verifyResult.Correct {
        // 标记关卡完成
        g.progress.MarkCompleted(g.currentLevel.ID, g.calculateScore())
        
        // 检查下一关
        if nextLevel, ok := g.loader.GetNextLevel(g.currentLevel.ID); ok {
            g.progress.SetCurrentLevel(nextLevel.ID)
            result.NextLevel = nextLevel
        } else {
            g.state = StateCompleted
            result.GameCompleted = true
        }
    }

    return result, nil
}

// GetHint 获取提示
func (g *Game) GetHint() (string, error) {
    if g.currentLevel == nil {
        return "", errors.New("当前没有正在进行的关卡")
    }

    if g.hintLevel >= len(g.currentLevel.Hints) {
        return "没有更多提示了。输入 'keyforge answer' 查看答案。", nil
    }

    hint := g.currentLevel.Hints[g.hintLevel]
    g.hintLevel++

    return hint, nil
}

// GetAnswer 获取答案
func (g *Game) GetAnswer() (string, error) {
    if g.currentLevel == nil {
        return "", errors.New("当前没有正在进行的关卡")
    }

    g.hintLevel = len(g.currentLevel.Hints) + 1 // 标记已查看答案
    
    expected := g.verifier.getExpectedKeys()
    return fmt.Sprintf("答案: %s\n\n%s", 
        formatKeyCombination(expected),
        g.currentLevel.Tips,
    ), nil
}

// 计算本次得分 (使用提示会减少得分)
func (g *Game) calculateScore() int {
    baseScore := 100
    hintPenalty := g.hintLevel * 20
    score := baseScore - hintPenalty
    if score < 0 {
        score = 0
    }
    return score
}

func formatKeyCombination(keys []string) string {
    return strings.Join(keys, " + ")
}

// PlayResult Play 命令的结果
type PlayResult struct {
    Level       *Level
    Description string
}

// SubmitResult 提交答案的结果
type SubmitResult struct {
    Correct       bool
    Expected      []string
    Actual        []string
    ResponseTime  time.Duration
    HintsUsed     int
    NextLevel     *Level
    GameCompleted bool
}
```

---

### 4.4 进度存储 (Progress Store)

```go
// internal/storage/progress.go
package storage

import (
    "encoding/json"
    "os"
    "path/filepath"
    "sync"
    "time"
)

// Progress 用户进度数据
type Progress struct {
    CurrentLevelID  string                    `json:"current_level_id"`
    CompletedLevels map[string]CompletedLevel `json:"completed_levels"`
    Profile         string                    `json:"profile"`
    CreatedAt       time.Time                 `json:"created_at"`
    UpdatedAt       time.Time                 `json:"updated_at"`
}

// CompletedLevel 已完成关卡的记录
type CompletedLevel struct {
    CompletedAt  time.Time `json:"completed_at"`
    Score        int       `json:"score"`
    Attempts     int       `json:"attempts"`
    BestTime     int64     `json:"best_time_ms"`
}

// ProgressStore 进度存储
type ProgressStore struct {
    filePath string
    progress *Progress
    mu       sync.RWMutex
}

// NewProgressStore 创建进度存储
func NewProgressStore(dataDir string) (*ProgressStore, error) {
    filePath := filepath.Join(dataDir, "progress.json")
    
    store := &ProgressStore{
        filePath: filePath,
    }

    if err := store.load(); err != nil {
        // 文件不存在时创建新进度
        store.progress = &Progress{
            CompletedLevels: make(map[string]CompletedLevel),
            CreatedAt:       time.Now(),
            UpdatedAt:       time.Now(),
        }
    }

    return store, nil
}

func (s *ProgressStore) load() error {
    data, err := os.ReadFile(s.filePath)
    if err != nil {
        return err
    }

    var progress Progress
    if err := json.Unmarshal(data, &progress); err != nil {
        return err
    }

    s.progress = &progress
    return nil
}

func (s *ProgressStore) save() error {
    s.progress.UpdatedAt = time.Now()
    
    data, err := json.MarshalIndent(s.progress, "", "  ")
    if err != nil {
        return err
    }

    // 确保目录存在
    if err := os.MkdirAll(filepath.Dir(s.filePath), 0755); err != nil {
        return err
    }

    return os.WriteFile(s.filePath, data, 0644)
}

// GetCurrentLevelID 获取当前关卡 ID
func (s *ProgressStore) GetCurrentLevelID() string {
    s.mu.RLock()
    defer s.mu.RUnlock()
    return s.progress.CurrentLevelID
}

// SetCurrentLevel 设置当前关卡
func (s *ProgressStore) SetCurrentLevel(levelID string) error {
    s.mu.Lock()
    defer s.mu.Unlock()

    s.progress.CurrentLevelID = levelID
    return s.save()
}

// MarkCompleted 标记关卡完成
func (s *ProgressStore) MarkCompleted(levelID string, score int) error {
    s.mu.Lock()
    defer s.mu.Unlock()

    existing, exists := s.progress.CompletedLevels[levelID]
    
    completed := CompletedLevel{
        CompletedAt: time.Now(),
        Score:       score,
        Attempts:    1,
    }

    if exists {
        completed.Attempts = existing.Attempts + 1
        // 保留最高分
        if existing.Score > score {
            completed.Score = existing.Score
        }
    }

    s.progress.CompletedLevels[levelID] = completed
    return s.save()
}

// GetStats 获取进度统计
func (s *ProgressStore) GetStats() ProgressStats {
    s.mu.RLock()
    defer s.mu.RUnlock()

    totalScore := 0
    for _, level := range s.progress.CompletedLevels {
        totalScore += level.Score
    }

    return ProgressStats{
        CompletedCount: len(s.progress.CompletedLevels),
        TotalScore:     totalScore,
    }
}

// Reset 重置所有进度
func (s *ProgressStore) Reset() error {
    s.mu.Lock()
    defer s.mu.Unlock()

    s.progress = &Progress{
        CompletedLevels: make(map[string]CompletedLevel),
        CreatedAt:       s.progress.CreatedAt,
        UpdatedAt:       time.Now(),
    }

    return s.save()
}

// ProgressStats 进度统计
type ProgressStats struct {
    CompletedCount int
    TotalScore     int
}
```

---

### 4.5 CLI 命令实现 (CLI Commands)

使用 Cobra 框架实现命令行接口。

```go
// internal/cli/root.go
package cli

import (
    "fmt"
    "os"

    "github.com/spf13/cobra"
    "github.com/user/keyforge/internal/engine"
)

var (
    game       *engine.Game
    configFile string
    profile    string
)

// rootCmd 根命令
var rootCmd = &cobra.Command{
    Use:   "keyforge",
    Short: "KeyForge - 编辑器快捷键训练工具",
    Long: `KeyForge 是一个交互式的编辑器快捷键训练工具。
通过闯关的方式，帮助你快速掌握 VSCode 和 Vim 的快捷键组合。

类似于 Githug 工具，通过实践来学习和记忆快捷键。`,
}

// Execute 执行 CLI
func Execute() {
    if err := rootCmd.Execute(); err != nil {
        fmt.Fprintln(os.Stderr, err)
        os.Exit(1)
    }
}

func init() {
    cobra.OnInitialize(initConfig)
    
    rootCmd.PersistentFlags().StringVar(&configFile, "config", "", 
        "配置文件路径 (默认为 $HOME/.keyforge/config.yaml)")
    rootCmd.PersistentFlags().StringVar(&profile, "profile", "vscode",
        "键位配置: vscode, vim")
}

func initConfig() {
    // 初始化游戏引擎
    homeDir, _ := os.UserHomeDir()
    levelsDir := filepath.Join(homeDir, ".keyforge", "levels")
    dataDir := filepath.Join(homeDir, ".keyforge", "data")

    var err error
    game, err = engine.NewGame(levelsDir, dataDir)
    if err != nil {
        fmt.Fprintf(os.Stderr, "初始化失败: %v\n", err)
        os.Exit(1)
    }

    // 设置键位配置
    game.SetProfile(engine.KeymapProfile(profile))
}
```

```go
// internal/cli/play.go
package cli

import (
    "fmt"

    "github.com/charmbracelet/lipgloss"
    "github.com/spf13/cobra"
)

var playCmd = &cobra.Command{
    Use:   "play",
    Short: "开始或继续训练",
    Long:  "开始新的训练或继续上次的进度",
    Run:   runPlay,
}

func init() {
    rootCmd.AddCommand(playCmd)
}

func runPlay(cmd *cobra.Command, args []string) {
    result, err := game.Play()
    if err != nil {
        fmt.Printf("❌ 错误: %v\n", err)
        return
    }

    // 渲染关卡信息
    renderLevel(result)

    // 等待用户输入快捷键
    fmt.Println("\n🎯 请输入快捷键组合...")
    fmt.Println("(按下你认为正确的快捷键)")
    fmt.Println()

    submitResult, err := game.SubmitAnswer()
    if err != nil {
        fmt.Printf("❌ 错误: %v\n", err)
        return
    }

    renderResult(submitResult)
}

func renderLevel(result *engine.PlayResult) {
    level := result.Level

    // 使用 lipgloss 渲染样式
    titleStyle := lipgloss.NewStyle().
        Bold(true).
        Foreground(lipgloss.Color("212")).
        MarginBottom(1)

    descStyle := lipgloss.NewStyle().
        Foreground(lipgloss.Color("252")).
        PaddingLeft(2)

    infoStyle := lipgloss.NewStyle().
        Foreground(lipgloss.Color("241"))

    fmt.Println()
    fmt.Println(titleStyle.Render(fmt.Sprintf("📚 关卡 %s: %s", level.ID, level.Name)))
    fmt.Println(infoStyle.Render(fmt.Sprintf("   难度: %s | 分类: %s", level.Difficulty, level.Category)))
    fmt.Println()
    fmt.Println(descStyle.Render(level.Description))
}

func renderResult(result *engine.SubmitResult) {
    if result.Correct {
        successStyle := lipgloss.NewStyle().
            Bold(true).
            Foreground(lipgloss.Color("46"))
        
        fmt.Println()
        fmt.Println(successStyle.Render("✅ 正确！"))
        fmt.Printf("   响应时间: %v\n", result.ResponseTime)

        if result.GameCompleted {
            fmt.Println()
            fmt.Println("🎉 恭喜！你已完成所有关卡！")
        } else if result.NextLevel != nil {
            fmt.Println()
            fmt.Printf("⏭️  下一关: %s - %s\n", result.NextLevel.ID, result.NextLevel.Name)
            fmt.Println("   输入 'keyforge play' 继续")
        }
    } else {
        errorStyle := lipgloss.NewStyle().
            Bold(true).
            Foreground(lipgloss.Color("196"))
        
        fmt.Println()
        fmt.Println(errorStyle.Render("❌ 不正确"))
        fmt.Printf("   你输入的: %v\n", formatKeys(result.Actual))
        fmt.Println()
        fmt.Println("💡 使用 'keyforge hint' 获取提示")
        fmt.Println("   使用 'keyforge play' 重新尝试")
    }
}

func formatKeys(keys []string) string {
    return strings.Join(keys, " + ")
}
```

```go
// internal/cli/hint.go
package cli

import (
    "fmt"

    "github.com/charmbracelet/lipgloss"
    "github.com/spf13/cobra"
)

var hintCmd = &cobra.Command{
    Use:   "hint",
    Short: "获取当前关卡的提示",
    Run:   runHint,
}

func init() {
    rootCmd.AddCommand(hintCmd)
}

func runHint(cmd *cobra.Command, args []string) {
    hint, err := game.GetHint()
    if err != nil {
        fmt.Printf("❌ 错误: %v\n", err)
        return
    }

    hintStyle := lipgloss.NewStyle().
        Foreground(lipgloss.Color("226")).
        PaddingLeft(2)

    fmt.Println()
    fmt.Println("💡 提示:")
    fmt.Println(hintStyle.Render(hint))
    fmt.Println()
}
```

```go
// internal/cli/levels.go
package cli

import (
    "fmt"

    "github.com/charmbracelet/lipgloss"
    "github.com/spf13/cobra"
)

var levelsCmd = &cobra.Command{
    Use:   "levels",
    Short: "查看所有关卡",
    Run:   runLevels,
}

func init() {
    rootCmd.AddCommand(levelsCmd)
}

func runLevels(cmd *cobra.Command, args []string) {
    levels := game.GetAllLevels()
    progress := game.GetProgress()

    // 样式定义
    completedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("46"))
    currentStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("226")).Bold(true)
    lockedStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("241"))

    fmt.Println()
    fmt.Println("📋 关卡列表")
    fmt.Println()

    currentDifficulty := ""
    for _, level := range levels {
        // 打印难度分类标题
        if level.Difficulty != currentDifficulty {
            currentDifficulty = level.Difficulty
            fmt.Printf("\n  == %s ==\n\n", difficultyLabel(currentDifficulty))
        }

        // 确定状态和样式
        var status string
        var style lipgloss.Style

        if progress.IsCompleted(level.ID) {
            status = "✅"
            style = completedStyle
        } else if progress.IsCurrent(level.ID) {
            status = "▶️"
            style = currentStyle
        } else if progress.IsUnlocked(level.ID) {
            status = "🔓"
            style = lipgloss.NewStyle()
        } else {
            status = "🔒"
            style = lockedStyle
        }

        line := fmt.Sprintf("  %s %s: %s", status, level.ID, level.Name)
        fmt.Println(style.Render(line))
    }

    fmt.Println()
}

func difficultyLabel(d string) string {
    switch d {
    case "beginner":
        return "🌱 初级"
    case "intermediate":
        return "🌿 中级"
    case "advanced":
        return "🌳 高级"
    default:
        return d
    }
}
```

```go
// internal/cli/stats.go
package cli

import (
    "fmt"

    "github.com/charmbracelet/lipgloss"
    "github.com/spf13/cobra"
)

var statsCmd = &cobra.Command{
    Use:   "stats",
    Short: "查看训练统计",
    Run:   runStats,
}

func init() {
    rootCmd.AddCommand(statsCmd)
}

func runStats(cmd *cobra.Command, args []string) {
    stats := game.GetStats()
    progress := game.GetProgress()

    // 样式
    headerStyle := lipgloss.NewStyle().
        Bold(true).
        Foreground(lipgloss.Color("212"))

    fmt.Println()
    fmt.Println(headerStyle.Render("📊 训练统计"))
    fmt.Println()

    // 进度概览
    totalLevels := game.GetTotalLevelCount()
    completedCount := progress.GetCompletedCount()
    percentage := float64(completedCount) / float64(totalLevels) * 100

    fmt.Printf("  📈 完成进度: %d/%d (%.1f%%)\n", completedCount, totalLevels, percentage)
    fmt.Printf("  🏆 总得分: %d\n", progress.GetTotalScore())
    fmt.Println()

    // 绘制进度条
    renderProgressBar(percentage)
    fmt.Println()

    // 详细统计
    if stats.TotalAttempts > 0 {
        fmt.Println("  📝 详细统计:")
        fmt.Printf("     总尝试次数: %d\n", stats.TotalAttempts)
        fmt.Printf("     首次通过率: %.1f%%\n", stats.FirstTrySuccessRate*100)
        fmt.Printf("     平均响应时间: %v\n", stats.AverageResponseTime)
        fmt.Println()

        // 需要复习的关卡
        if len(stats.WeakLevels) > 0 {
            fmt.Println("  ⚠️ 建议复习:")
            for _, level := range stats.WeakLevels {
                fmt.Printf("     - %s: %s (错误率: %.0f%%)\n", 
                    level.ID, level.Name, level.ErrorRate*100)
            }
        }
    }

    fmt.Println()
}

func renderProgressBar(percentage float64) {
    width := 30
    filled := int(percentage / 100 * float64(width))

    bar := "["
    for i := 0; i < width; i++ {
        if i < filled {
            bar += "█"
        } else {
            bar += "░"
        }
    }
    bar += "]"

    barStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("46"))
    fmt.Print("  ")
    fmt.Println(barStyle.Render(bar))
}
```

---

## 5. 关卡内容规划

### 5.1 初级关卡 (Beginner) - 共 30 关

| ID | 名称 | 快捷键 (macOS) | 分类 |
|----|------|---------------|------|
| 001 | 保存文件 | Cmd+S | 文件操作 |
| 002 | 全选 | Cmd+A | 编辑基础 |
| 003 | 复制 | Cmd+C | 编辑基础 |
| 004 | 粘贴 | Cmd+V | 编辑基础 |
| 005 | 剪切 | Cmd+X | 编辑基础 |
| 006 | 撤销 | Cmd+Z | 编辑基础 |
| 007 | 重做 | Cmd+Shift+Z | 编辑基础 |
| 008 | 查找 | Cmd+F | 搜索 |
| 009 | 替换 | Cmd+Option+F | 搜索 |
| 010 | 新建文件 | Cmd+N | 文件操作 |
| ... | ... | ... | ... |

### 5.2 中级关卡 (Intermediate) - 共 40 关

| ID | 名称 | 快捷键 (macOS) | 分类 |
|----|------|---------------|------|
| 101 | 快速打开文件 | Cmd+P | 导航 |
| 102 | 命令面板 | Cmd+Shift+P | 命令 |
| 103 | 跳转到行 | Ctrl+G | 导航 |
| 104 | 跳转到符号 | Cmd+Shift+O | 导航 |
| 105 | 多光标编辑 | Cmd+Option+↓ | 高级编辑 |
| 106 | 选中下一个匹配 | Cmd+D | 多选 |
| 107 | 选中所有匹配 | Cmd+Shift+L | 多选 |
| 108 | 复制当前行 | Shift+Option+↓ | 行操作 |
| 109 | 移动行 | Option+↑/↓ | 行操作 |
| 110 | 删除行 | Cmd+Shift+K | 行操作 |
| ... | ... | ... | ... |

### 5.3 高级关卡 (Advanced) - 共 30 关

| ID | 名称 | 快捷键 (macOS) | 分类 |
|----|------|---------------|------|
| 201 | 折叠代码块 | Cmd+Option+[ | 代码折叠 |
| 202 | 展开代码块 | Cmd+Option+] | 代码折叠 |
| 203 | 转到定义 | F12 | 代码导航 |
| 204 | 查看引用 | Shift+F12 | 代码导航 |
| 205 | 重命名符号 | F2 | 重构 |
| 206 | 格式化文档 | Shift+Option+F | 格式化 |
| 207 | 显示问题面板 | Cmd+Shift+M | 面板 |
| 208 | 切换终端 | Ctrl+` | 终端 |
| 209 | 分屏编辑 | Cmd+\ | 编辑器 |
| 210 | 关闭编辑器 | Cmd+W | 编辑器 |
| ... | ... | ... | ... |

### 5.4 Vim 模式关卡 (VSCode + Vim)

| ID | 名称 | 按键 | 分类 |
|----|------|------|------|
| V01 | 进入普通模式 | Esc | 模式切换 |
| V02 | 进入插入模式 | i | 模式切换 |
| V03 | 行尾插入 | A | 模式切换 |
| V04 | 向下移动 | j | 移动 |
| V05 | 向上移动 | k | 移动 |
| V06 | 向左移动 | h | 移动 |
| V07 | 向右移动 | l | 移动 |
| V08 | 单词跳转 | w | 移动 |
| V09 | 删除字符 | x | 编辑 |
| V10 | 删除行 | dd | 编辑 |
| V11 | 复制行 | yy | 编辑 |
| V12 | 粘贴 | p | 编辑 |
| ... | ... | ... | ... |

---

## 6. 用户体验流程

### 6.1 首次使用流程

```
┌────────────────────────────────────────────────────────────┐
│  $ keyforge                                                 │
│                                                             │
│  ╭──────────────────────────────────────────────────────╮  │
│  │  🔑 KeyForge v1.0.0                                   │  │
│  │  编辑器快捷键训练工具                                  │  │
│  ╰──────────────────────────────────────────────────────╯  │
│                                                             │
│  欢迎使用 KeyForge！这是一个帮助你掌握编辑器快捷键的工具。  │
│                                                             │
│  📋 可用命令:                                               │
│     keyforge play      开始/继续训练                        │
│     keyforge hint      获取提示                             │
│     keyforge levels    查看关卡列表                         │
│     keyforge stats     查看训练统计                         │
│     keyforge config    配置设置                             │
│                                                             │
│  📖 使用 --help 获取更多信息                                │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### 6.2 训练流程

```
┌────────────────────────────────────────────────────────────┐
│  $ keyforge play                                           │
│                                                             │
│  ╭──────────────────────────────────────────────────────╮  │
│  │  📚 关卡 001: 保存文件                                │  │
│  │     难度: 初级 | 分类: 文件操作                        │  │
│  ╰──────────────────────────────────────────────────────╯  │
│                                                             │
│  场景描述:                                                  │
│    你刚刚写完一段代码，现在需要保存文件。                   │
│    请输入正确的快捷键组合来保存当前文件。                   │
│                                                             │
│  🎯 请输入快捷键组合...                                     │
│  (按下你认为正确的快捷键)                                   │
│                                                             │
│  > [用户按下 Cmd+S]                                         │
│                                                             │
│  ✅ 正确！                                                  │
│     响应时间: 1.2s                                         │
│                                                             │
│  ⏭️  下一关: 002 - 全选                                     │
│     输入 'keyforge play' 继续                               │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### 6.3 错误与提示流程

```
┌────────────────────────────────────────────────────────────┐
│  $ keyforge play                                           │
│                                                             │
│  📚 关卡 106: 选中下一个匹配                                │
│                                                             │
│  场景描述:                                                  │
│    你选中了一个变量名，想要同时选中文件中所有相同的变量名   │
│    进行同时编辑。请使用快捷键选中下一个匹配项。             │
│                                                             │
│  > [用户按下 Cmd+F]                                         │
│                                                             │
│  ❌ 不正确                                                  │
│     你输入的: Cmd + F                                       │
│                                                             │
│  💡 使用 'keyforge hint' 获取提示                           │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  $ keyforge hint                                           │
│                                                             │
│  💡 提示:                                                   │
│     这个快捷键和一个英文字母有关，这个字母是 "D"，           │
│     代表 "Double" 或 "Duplicate selection"                  │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  $ keyforge play                                           │
│                                                             │
│  > [用户按下 Cmd+D]                                         │
│                                                             │
│  ✅ 正确！                                                  │
│                                                             │
│  💡 助记技巧：D = Double，双重选择！                        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 7. 数据存储设计

### 7.1 存储目录结构

```
~/.keyforge/
├── config.yaml          # 用户配置
├── data/
│   ├── progress.json    # 训练进度
│   └── stats.json       # 详细统计
└── levels/              # 关卡文件 (可覆盖内置关卡)
    └── custom/          # 用户自定义关卡
```

### 7.2 配置文件格式

```yaml
# ~/.keyforge/config.yaml
profile: vscode          # vscode | vim
platform: auto          # auto | macos | windows | linux
language: zh-CN         # zh-CN | en-US
theme: dark             # dark | light

notifications:
  sound: true           # 播放提示音
  
review:
  enabled: true         # 启用复习提醒
  interval: 24h         # 复习间隔
```

---

## 8. 未来扩展

### 8.1 计划功能 (v2.0)

- [ ] 在线排行榜
- [ ] 多人竞技模式
- [ ] IDE 插件集成
- [ ] 自定义主题
- [ ] 导出学习报告

### 8.2 支持更多编辑器

- [ ] JetBrains IDEs (IntelliJ, WebStorm 等)
- [ ] Sublime Text
- [ ] Neovim
- [ ] Emacs

---

## 9. 附录

### 9.1 参考资料

- [Githug - Git 学习工具](https://github.com/Gazler/githug)
- [VSCode 快捷键文档](https://code.visualstudio.com/docs/getstarted/keybindings)
- [VSCode Vim 扩展](https://github.com/VSCodeVim/Vim)
- [Cobra CLI 框架](https://github.com/spf13/cobra)
- [Bubble Tea TUI 框架](https://github.com/charmbracelet/bubbletea)

### 9.2 术语表

| 术语 | 说明 |
|------|------|
| 关卡 (Level) | 单个快捷键训练挑战 |
| 键位配置 (Profile) | 快捷键方案，如 VSCode、Vim |
| 修饰键 (Modifier) | Ctrl、Alt、Shift、Cmd 等 |
| 组合键 (Combination) | 多个按键同时按下的操作 |

---

*文档版本: v1.0*  
*最后更新: 2024-12*
