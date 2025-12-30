package cli

import (
	"github.com/spf13/cobra"
)

// hintCmd hint 命令
var hintCmd = &cobra.Command{
	Use:   "hint",
	Short: "获取当前关卡的提示",
	Long:  "获取当前关卡的分级提示，每次调用显示下一级提示",
	RunE:  runHint,
}

func init() {
	rootCmd.AddCommand(hintCmd)
}

func runHint(cmd *cobra.Command, args []string) error {
	// 加载当前关卡
	result, err := game.Play()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	hint, hintLevel, err := game.GetHint()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	totalHints := len(result.Level.Hints)
	renderer.RenderHint(hint, hintLevel, totalHints)

	return nil
}
