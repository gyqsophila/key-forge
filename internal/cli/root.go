package cli

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"

	"github.com/keyforge/keyforge/internal/engine"
	"github.com/keyforge/keyforge/internal/ui"
)

var (
	// 全局变量
	game     *engine.Game
	renderer *ui.Renderer

	// 配置
	profile    string
	levelsDir  string
	dataDir    string
)

// rootCmd 根命令
var rootCmd = &cobra.Command{
	Use:   "keyforge",
	Short: "KeyForge - 编辑器快捷键训练工具",
	Long: `KeyForge 是一个交互式的编辑器快捷键训练工具。
通过闯关的方式，帮助你快速掌握 VSCode 和 Vim 的快捷键组合。

类似于 Githug 工具，通过实践来学习和记忆快捷键。

可用命令:
  keyforge play      开始/继续训练
  keyforge hint      获取当前关卡提示
  keyforge answer    查看答案（会影响得分）
  keyforge levels    查看关卡列表
  keyforge stats     查看训练统计
  keyforge reset     重置进度`,
	PersistentPreRunE: initGame,
}

// Execute 执行 CLI
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func init() {
	// 全局 flags
	rootCmd.PersistentFlags().StringVar(&profile, "profile", "vscode",
		"键位配置: vscode, vim")

	// 获取默认目录
	homeDir, _ := os.UserHomeDir()
	defaultLevelsDir := filepath.Join(homeDir, ".keyforge", "levels")
	defaultDataDir := filepath.Join(homeDir, ".keyforge", "data")

	// 检查是否有本地 levels 目录（开发模式）
	if _, err := os.Stat("levels"); err == nil {
		defaultLevelsDir = "levels"
	}

	rootCmd.PersistentFlags().StringVar(&levelsDir, "levels-dir", defaultLevelsDir,
		"关卡文件目录")
	rootCmd.PersistentFlags().StringVar(&dataDir, "data-dir", defaultDataDir,
		"用户数据目录")
}

// initGame 初始化游戏引擎
func initGame(cmd *cobra.Command, args []string) error {
	// 跳过 help 命令
	if cmd.Name() == "help" {
		return nil
	}

	var err error
	game, err = engine.NewGame(levelsDir, dataDir)
	if err != nil {
		return fmt.Errorf("初始化游戏失败: %w", err)
	}

	// 设置键位配置
	switch profile {
	case "vim":
		game.SetProfile(engine.ProfileVim)
	default:
		game.SetProfile(engine.ProfileVSCode)
	}

	// 创建渲染器
	renderer = ui.NewRenderer()

	return nil
}
