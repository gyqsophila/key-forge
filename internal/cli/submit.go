package cli

import (
	"strings"

	"github.com/spf13/cobra"
)

// submitCmd submit 命令
var submitCmd = &cobra.Command{
	Use:   "submit <快捷键>",
	Short: "提交答案",
	Long: `提交当前关卡的答案进行验证。

示例:
  keyforge submit Cmd+S
  keyforge submit Ctrl+Shift+P
  keyforge submit Esc
  keyforge submit :wq`,
	Args: cobra.MinimumNArgs(1),
	RunE: runSubmit,
}

func init() {
	rootCmd.AddCommand(submitCmd)
}

func runSubmit(cmd *cobra.Command, args []string) error {
	// 确保游戏处于可提交状态
	_, err := game.Play()
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	// 将所有参数合并为一个答案字符串
	answer := strings.Join(args, "+")

	// 提交答案
	result, err := game.SubmitAnswerText(answer)
	if err != nil {
		renderer.RenderError(err.Error())
		return nil
	}

	// 渲染结果
	renderer.RenderResult(result)

	// 如果正确且有下一关，显示提示
	if result.Correct && result.NextLevel != nil {
		renderer.RenderInfo("使用 'keyforge play' 查看下一关")
	}

	return nil
}

// 添加到 game.go 的新方法
func init() {
	// 这个方法需要添加到 engine 包
}
