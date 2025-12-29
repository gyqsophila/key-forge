package cli

import (
	"github.com/spf13/cobra"
)

// levelsCmd levels 命令
var levelsCmd = &cobra.Command{
	Use:   "levels",
	Short: "查看所有关卡",
	Long:  "显示所有可用关卡及其完成状态",
	RunE:  runLevels,
}

func init() {
	rootCmd.AddCommand(levelsCmd)
}

func runLevels(cmd *cobra.Command, args []string) error {
	levels := game.GetAllLevels()
	progress := game.GetProgress()

	renderer.RenderLevelList(levels, progress)

	return nil
}
