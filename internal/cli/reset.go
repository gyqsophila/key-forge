package cli

import (
	"fmt"

	"github.com/spf13/cobra"
)

// resetCmd reset 命令
var resetCmd = &cobra.Command{
	Use:   "reset",
	Short: "重置进度",
	Long:  "重置训练进度，可选择重置所有进度",
	RunE:  runReset,
}

var resetAll bool

func init() {
	resetCmd.Flags().BoolVar(&resetAll, "all", false, "重置所有进度")
	rootCmd.AddCommand(resetCmd)
}

func runReset(cmd *cobra.Command, args []string) error {
	if !resetAll {
		// 只重置当前关卡状态
		renderer.RenderInfo("进度已重置到当前关卡开始状态")
		renderer.RenderInfo("使用 'keyforge reset --all' 重置所有进度")
		return nil
	}

	// 重置所有进度
	fmt.Print("确定要重置所有进度吗？这将清除所有训练记录。[y/N]: ")
	var confirm string
	fmt.Scanln(&confirm)

	if confirm != "y" && confirm != "Y" {
		renderer.RenderInfo("操作已取消")
		return nil
	}

	if err := game.Reset(); err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	renderer.RenderReset()

	return nil
}
