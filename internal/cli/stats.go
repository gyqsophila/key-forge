package cli

import (
	"github.com/spf13/cobra"
)

// statsCmd stats 命令
var statsCmd = &cobra.Command{
	Use:   "stats",
	Short: "查看训练统计",
	Long:  "显示训练进度和详细统计信息",
	RunE:  runStats,
}

func init() {
	rootCmd.AddCommand(statsCmd)
}

func runStats(cmd *cobra.Command, args []string) error {
	progress := game.GetProgress()
	statsStore := game.GetStats()
	globalStats := statsStore.GetGlobalStats()
	totalLevels := game.GetTotalLevelCount()

	renderer.RenderStats(progress, globalStats, totalLevels)

	return nil
}
