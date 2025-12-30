package cli

import (
	"github.com/spf13/cobra"
)

// answerCmd answer 命令
var answerCmd = &cobra.Command{
	Use:   "answer",
	Short: "查看当前关卡的答案",
	Long:  "查看当前关卡的正确答案（会影响得分）",
	RunE:  runAnswer,
}

func init() {
	rootCmd.AddCommand(answerCmd)
}

func runAnswer(cmd *cobra.Command, args []string) error {
	// 加载当前关卡
	_, err := game.Play()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	answer, tips, err := game.GetAnswer()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	renderer.RenderAnswer(answer, tips)

	return nil
}
