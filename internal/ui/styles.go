package ui

import (
	"github.com/charmbracelet/lipgloss"
)

// 颜色定义
var (
	ColorPrimary   = lipgloss.Color("212") // 紫色
	ColorSuccess   = lipgloss.Color("46")  // 绿色
	ColorError     = lipgloss.Color("196") // 红色
	ColorWarning   = lipgloss.Color("226") // 黄色
	ColorMuted     = lipgloss.Color("241") // 灰色
	ColorHighlight = lipgloss.Color("39")  // 青色
	ColorText      = lipgloss.Color("252") // 浅灰
)

// 样式定义
var (
	// 标题样式
	TitleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorPrimary).
			MarginBottom(1)

	// 副标题样式
	SubtitleStyle = lipgloss.NewStyle().
			Foreground(ColorMuted).
			Italic(true)

	// 描述样式
	DescriptionStyle = lipgloss.NewStyle().
				Foreground(ColorText).
				PaddingLeft(2).
				MarginTop(1).
				MarginBottom(1)

	// 成功样式
	SuccessStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorSuccess)

	// 错误样式
	ErrorStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorError)

	// 提示样式
	HintStyle = lipgloss.NewStyle().
			Foreground(ColorWarning).
			PaddingLeft(2)

	// 信息样式
	InfoStyle = lipgloss.NewStyle().
			Foreground(ColorHighlight)

	// 输入提示样式
	PromptStyle = lipgloss.NewStyle().
			Foreground(ColorPrimary).
			Bold(true)

	// 按键组合样式
	KeyStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorHighlight).
			Background(lipgloss.Color("236")).
			Padding(0, 1)

	// 进度条样式
	ProgressBarStyle = lipgloss.NewStyle().
				Foreground(ColorSuccess)

	// 已完成关卡样式
	CompletedStyle = lipgloss.NewStyle().
			Foreground(ColorSuccess)

	// 当前关卡样式
	CurrentStyle = lipgloss.NewStyle().
			Foreground(ColorWarning).
			Bold(true)

	// 锁定关卡样式
	LockedStyle = lipgloss.NewStyle().
			Foreground(ColorMuted)

	// 标签样式
	LabelStyle = lipgloss.NewStyle().
			Foreground(ColorMuted)

	// 数值样式
	ValueStyle = lipgloss.NewStyle().
			Foreground(ColorText).
			Bold(true)

	// Box 样式
	BoxStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(ColorPrimary).
			Padding(1, 2)

	// Header 样式
	HeaderStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorPrimary).
			MarginBottom(1)
)

// DifficultyLabel 返回难度标签
func DifficultyLabel(difficulty string) string {
	switch difficulty {
	case "beginner":
		return "🌱 初级"
	case "intermediate":
		return "🌿 中级"
	case "advanced":
		return "🌳 高级"
	default:
		return difficulty
	}
}

// RenderProgressBar 渲染进度条
func RenderProgressBar(percentage float64, width int) string {
	filled := int(percentage / 100 * float64(width))

	bar := "["
	for i := 0; i < width; i++ {
		if i < filled {
			bar += "█"
		} else {
			bar += "░"
		}
	}
	bar += "]"

	return ProgressBarStyle.Render(bar)
}
