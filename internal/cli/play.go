package cli

import (
	"github.com/spf13/cobra"
)

// playCmd play 命令
var playCmd = &cobra.Command{
	Use:   "play",
	Short: "开始或继续训练",
	Long:  "开始新的训练或继续上次的进度",
	RunE:  runPlay,
}

func init() {
	rootCmd.AddCommand(playCmd)
}

func runPlay(cmd *cobra.Command, args []string) error {
	// 开始游戏
	result, err := game.Play()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	// 渲染关卡信息
	renderer.RenderLevel(result.Level)

	// 渲染输入提示
	renderer.RenderPrompt(game.GetPlatform())

	// 等待用户输入并验证
	submitResult, err := game.SubmitAnswer()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	// 渲染结果
	renderer.RenderResult(submitResult)

	return nil
}
