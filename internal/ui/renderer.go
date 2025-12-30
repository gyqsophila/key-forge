package ui

import (
	"fmt"

	"github.com/keyforge/keyforge/internal/engine"
	"github.com/keyforge/keyforge/internal/storage"
)

// Renderer 终端渲染器
type Renderer struct{}

// NewRenderer 创建渲染器
func NewRenderer() *Renderer {
	return &Renderer{}
}

// RenderWelcome 渲染欢迎信息
func (r *Renderer) RenderWelcome() {
	fmt.Println()
	fmt.Println(TitleStyle.Render("🔑 KeyForge v1.0.0"))
	fmt.Println(SubtitleStyle.Render("编辑器快捷键训练工具"))
	fmt.Println()
}

// RenderLevel 渲染关卡信息
func (r *Renderer) RenderLevel(level *engine.Level) {
	fmt.Println()
	title := fmt.Sprintf("📚 关卡 %s: %s", level.ID, level.Name)
	fmt.Println(TitleStyle.Render(title))

	info := fmt.Sprintf("   难度: %s | 分类: %s",
		DifficultyLabel(string(level.Difficulty)),
		level.Category)
	fmt.Println(SubtitleStyle.Render(info))

	fmt.Println()
	fmt.Println(DescriptionStyle.Render(level.Description))
	fmt.Println()
}

// RenderPlayHelp 渲染 play 后的帮助信息
func (r *Renderer) RenderPlayHelp(platform string) {
	fmt.Println(PromptStyle.Render("🎯 请提交你的答案:"))
	fmt.Println()

	var example string
	if platform == "macos" {
		example = "keyforge submit Cmd+S"
	} else {
		example = "keyforge submit Ctrl+S"
	}

	fmt.Println(SubtitleStyle.Render(fmt.Sprintf("  示例: %s", example)))
	fmt.Println(SubtitleStyle.Render("  提示: keyforge hint"))
	fmt.Println(SubtitleStyle.Render("  答案: keyforge answer"))
	fmt.Println()
}

// RenderPrompt 渲染输入提示
func (r *Renderer) RenderPrompt(platform string) {
	fmt.Println(PromptStyle.Render("🎯 请输入快捷键组合:"))

	var hint string
	if platform == "macos" {
		hint = "(格式示例: Cmd+S, Ctrl+Shift+P, Esc)"
	} else {
		hint = "(格式示例: Ctrl+S, Ctrl+Shift+P, Esc)"
	}
	fmt.Println(SubtitleStyle.Render(hint))
	fmt.Println()
}

// RenderResult 渲染验证结果
func (r *Renderer) RenderResult(result *engine.SubmitResult) {
	fmt.Println()

	if result.Correct {
		fmt.Println(SuccessStyle.Render("✅ 正确！"))
		fmt.Printf("   响应时间: %s\n", result.ResponseTime)
		fmt.Printf("   得分: %d\n", result.Score)

		if result.HintsUsed > 0 {
			fmt.Println(SubtitleStyle.Render(fmt.Sprintf("   (使用了 %d 个提示)", result.HintsUsed)))
		}

		if result.GameCompleted {
			fmt.Println()
			fmt.Println(SuccessStyle.Render("🎉 恭喜！你已完成所有关卡！"))
		} else if result.NextLevel != nil {
			fmt.Println()
			fmt.Printf("⏭️  下一关: %s - %s\n",
				InfoStyle.Render(result.NextLevel.ID),
				result.NextLevel.Name)
			fmt.Println(SubtitleStyle.Render("   输入 'keyforge play' 继续"))
		}
	} else {
		fmt.Println(ErrorStyle.Render("❌ 不正确"))
		fmt.Printf("   你输入的: %s\n", engine.FormatKeyCombination(result.Actual))
		fmt.Println()
		fmt.Println(HintStyle.Render("💡 使用 'keyforge hint' 获取提示"))
		fmt.Println(HintStyle.Render("   使用 'keyforge play' 重新尝试"))
	}

	fmt.Println()
}

// RenderHint 渲染提示
func (r *Renderer) RenderHint(hint string, hintLevel int, totalHints int) {
	fmt.Println()
	fmt.Printf("💡 提示 (%d/%d):\n", hintLevel, totalHints)
	fmt.Println(HintStyle.Render(hint))
	fmt.Println()
}

// RenderAnswer 渲染答案
func (r *Renderer) RenderAnswer(answer string, tips string) {
	fmt.Println()
	fmt.Printf("📝 答案: %s\n", KeyStyle.Render(answer))

	if tips != "" {
		fmt.Println()
		fmt.Println(HintStyle.Render(tips))
	}
	fmt.Println()
}

// RenderLevelList 渲染关卡列表
func (r *Renderer) RenderLevelList(levels []*engine.Level, progress *storage.ProgressStore) {
	fmt.Println()
	fmt.Println(HeaderStyle.Render("📋 关卡列表"))
	fmt.Println()

	currentID := progress.GetCurrentLevelID()
	currentDifficulty := ""

	for _, level := range levels {
		// 打印难度分类标题
		if string(level.Difficulty) != currentDifficulty {
			currentDifficulty = string(level.Difficulty)
			fmt.Printf("\n  == %s ==\n\n", DifficultyLabel(currentDifficulty))
		}

		// 确定状态和样式
		var status string
		var line string

		if progress.IsCompleted(level.ID) {
			status = "✅"
			line = CompletedStyle.Render(fmt.Sprintf("  %s %s: %s", status, level.ID, level.Name))
		} else if level.ID == currentID || (currentID == "" && level.ID == levels[0].ID) {
			status = "▶️"
			line = CurrentStyle.Render(fmt.Sprintf("  %s %s: %s", status, level.ID, level.Name))
		} else {
			status = "🔓"
			line = fmt.Sprintf("  %s %s: %s", status, level.ID, level.Name)
		}

		fmt.Println(line)
	}

	fmt.Println()
}

// RenderStats 渲染统计信息
func (r *Renderer) RenderStats(progress *storage.ProgressStore, stats storage.GlobalStats, totalLevels int) {
	fmt.Println()
	fmt.Println(HeaderStyle.Render("📊 训练统计"))
	fmt.Println()

	// 进度概览
	completedCount := progress.GetCompletedCount()
	percentage := float64(0)
	if totalLevels > 0 {
		percentage = float64(completedCount) / float64(totalLevels) * 100
	}

	fmt.Printf("  📈 完成进度: %d/%d (%.1f%%)\n", completedCount, totalLevels, percentage)
	fmt.Printf("  🏆 总得分: %d\n", progress.GetTotalScore())
	fmt.Println()

	// 进度条
	fmt.Print("  ")
	fmt.Println(RenderProgressBar(percentage, 30))
	fmt.Println()

	// 详细统计
	if stats.TotalAttempts > 0 {
		fmt.Println("  📝 详细统计:")
		fmt.Printf("     总尝试次数: %d\n", stats.TotalAttempts)
		fmt.Printf("     正确率: %.1f%%\n", stats.FirstTrySuccessRate*100)
		fmt.Printf("     平均响应时间: %v\n", stats.AverageResponseTime)
		fmt.Printf("     使用提示数: %d\n", stats.TotalHintsUsed)
	}

	fmt.Println()
}

// RenderReset 渲染重置信息
func (r *Renderer) RenderReset() {
	fmt.Println()
	fmt.Println(SuccessStyle.Render("✅ 进度已重置"))
	fmt.Println(SubtitleStyle.Render("   输入 'keyforge play' 重新开始"))
	fmt.Println()
}

// RenderError 渲染错误
func (r *Renderer) RenderError(msg string) {
	fmt.Println()
	fmt.Println(ErrorStyle.Render(fmt.Sprintf("❌ 错误: %s", msg)))
	fmt.Println()
}

// RenderInfo 渲染信息
func (r *Renderer) RenderInfo(msg string) {
	fmt.Println()
	fmt.Println(InfoStyle.Render(fmt.Sprintf("ℹ️  %s", msg)))
	fmt.Println()
}
