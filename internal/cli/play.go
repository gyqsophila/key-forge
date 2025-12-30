package cli

import (
	"github.com/spf13/cobra"
)

// playCmd play 命令
var playCmd = &cobra.Command{
	Use:   "play",
	Short: "查看当前关卡",
	Long:  "显示当前关卡信息，然后退出。使用 'keyforge submit <答案>' 提交你的答案。",
	RunE:  runPlay,
}

func init() {
	rootCmd.AddCommand(playCmd)
}

func runPlay(cmd *cobra.Command, args []string) error {
	// 获取当前关卡
	result, err := game.Play()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	// 渲染关卡信息
	renderer.RenderLevel(result.Level)

	// 显示提示
	renderer.RenderPlayHelp(game.GetPlatform())

	return nil
}
