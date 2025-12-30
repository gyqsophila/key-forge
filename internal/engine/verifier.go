package engine

import (
	"bufio"
	"fmt"
	"os"
	"runtime"
	"sort"
	"strings"
	"time"
)

// KeyVerifier 按键验证器
type KeyVerifier struct {
	platform     string
	currentLevel *Level
	startTime    time.Time
}

// VerifyResult 验证结果
type VerifyResult struct {
	Correct      bool
	Expected     []string
	Actual       []string
	ResponseTime time.Duration
}

// NewKeyVerifier 创建按键验证器
func NewKeyVerifier() *KeyVerifier {
	return &KeyVerifier{
		platform: detectPlatform(),
	}
}

// detectPlatform 检测运行平台
func detectPlatform() string {
	switch runtime.GOOS {
	case "darwin":
		return "macos"
	case "windows":
		return "windows"
	default:
		return "linux"
	}
}

// GetPlatform 获取当前平台
func (v *KeyVerifier) GetPlatform() string {
	return v.platform
}

// SetLevel 设置当前关卡
func (v *KeyVerifier) SetLevel(level *Level) {
	v.currentLevel = level
}

// GetExpectedKeys 获取当前平台的期望按键
func (v *KeyVerifier) GetExpectedKeys() []string {
	if v.currentLevel == nil {
		return nil
	}

	switch v.platform {
	case "macos":
		return v.currentLevel.ExpectedKeys.MacOS
	case "windows":
		return v.currentLevel.ExpectedKeys.Windows
	default:
		return v.currentLevel.ExpectedKeys.Linux
	}
}

// GetExpectedKeysFormatted 获取格式化的期望按键字符串
func (v *KeyVerifier) GetExpectedKeysFormatted() string {
	return FormatKeyCombination(v.GetExpectedKeys())
}

// ReadAndVerify 读取用户文本输入并验证
func (v *KeyVerifier) ReadAndVerify() (VerifyResult, error) {
	v.startTime = time.Now()

	// 读取用户输入
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("> ")
	input, err := reader.ReadString('\n')
	if err != nil {
		return VerifyResult{}, fmt.Errorf("读取输入失败: %w", err)
	}

	// 清理输入
	input = strings.TrimSpace(input)

	// 解析用户输入的按键组合
	userKeys := ParseKeyInput(input)

	// 验证
	result := v.verify(userKeys)
	result.ResponseTime = time.Since(v.startTime)

	return result, nil
}

// VerifyText 验证文本答案（不从 stdin 读取）
func (v *KeyVerifier) VerifyText(answer string) VerifyResult {
	v.startTime = time.Now()

	// 解析用户输入的按键组合
	userKeys := ParseKeyInput(answer)

	// 验证
	result := v.verify(userKeys)
	result.ResponseTime = time.Since(v.startTime)

	return result
}

// ParseKeyInput 解析用户输入的按键组合文本
// 支持格式: "Cmd+S", "Ctrl+Shift+P", "Esc", ":wq" 等
func ParseKeyInput(input string) []string {
	input = strings.TrimSpace(input)
	if input == "" {
		return nil
	}

	// 处理常见分隔符
	var keys []string

	// 尝试用 + 分隔
	if strings.Contains(input, "+") {
		parts := strings.Split(input, "+")
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p != "" {
				keys = append(keys, normalizeKeyName(p))
			}
		}
	} else if strings.Contains(input, "-") {
		// 也支持 Cmd-S 这种格式
		parts := strings.Split(input, "-")
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p != "" {
				keys = append(keys, normalizeKeyName(p))
			}
		}
	} else if strings.Contains(input, " ") {
		// 空格分隔: "Cmd S"
		parts := strings.Fields(input)
		for _, p := range parts {
			keys = append(keys, normalizeKeyName(p))
		}
	} else {
		// 单个按键或 Vim 命令（如 :wq, dd, yy）
		// 对于 Vim 命令，逐字符分解
		if strings.HasPrefix(input, ":") || isVimCommand(input) {
			for _, ch := range input {
				keys = append(keys, strings.ToUpper(string(ch)))
			}
		} else {
			keys = append(keys, normalizeKeyName(input))
		}
	}

	return keys
}

// isVimCommand 检查是否是 Vim 命令
func isVimCommand(input string) bool {
	vimCommands := []string{"dd", "yy", "pp", "gg", "dw", "cw", "ci", "di"}
	lower := strings.ToLower(input)
	for _, cmd := range vimCommands {
		if lower == cmd {
			return true
		}
	}
	return false
}

// normalizeKeyName 标准化按键名称
func normalizeKeyName(key string) string {
	key = strings.TrimSpace(key)
	lower := strings.ToLower(key)

	// 修饰键标准化
	switch lower {
	case "cmd", "command", "⌘":
		return "Cmd"
	case "ctrl", "control", "^":
		return "Ctrl"
	case "alt", "option", "opt", "⌥":
		return "Alt"
	case "shift", "⇧":
		return "Shift"
	case "esc", "escape":
		return "Esc"
	case "enter", "return", "↵":
		return "Enter"
	case "space", "空格":
		return "Space"
	case "tab", "⇥":
		return "Tab"
	case "backspace", "delete", "⌫":
		return "Backspace"
	case "up", "↑":
		return "Up"
	case "down", "↓":
		return "Down"
	case "left":
		return "Left"
	case "right", "→":
		return "Right"
	}

	// 功能键
	if len(lower) >= 2 && lower[0] == 'f' {
		return strings.ToUpper(key)
	}

	// 普通字母转大写
	if len(key) == 1 {
		return strings.ToUpper(key)
	}

	// 其他情况保持首字母大写
	return strings.Title(lower)
}

// verify 验证按键组合
func (v *KeyVerifier) verify(userKeys []string) VerifyResult {
	expected := v.GetExpectedKeys()

	result := VerifyResult{
		Expected: expected,
		Actual:   userKeys,
	}

	// 标准化并比较
	result.Correct = keysEqual(
		normalizeKeys(expected),
		normalizeKeys(userKeys),
	)

	return result
}

// normalizeKeys 标准化按键列表用于比较
func normalizeKeys(keys []string) []string {
	if len(keys) == 0 {
		return keys
	}

	normalized := make([]string, len(keys))
	for i, k := range keys {
		normalized[i] = strings.ToLower(strings.TrimSpace(k))
	}

	// 对于组合键，修饰键排序，主键保持在最后
	if len(normalized) > 1 && !isVimSequence(keys) {
		modifiers := normalized[:len(normalized)-1]
		sort.Strings(modifiers)
		for i, m := range modifiers {
			normalized[i] = m
		}
	}

	return normalized
}

// isVimSequence 判断是否是 Vim 顺序键
func isVimSequence(keys []string) bool {
	if len(keys) == 0 {
		return false
	}

	// 如果第一个键是 : 或者是单个小写字母，可能是 Vim 序列
	first := keys[0]
	if first == ":" || (len(first) == 1 && first >= "a" && first <= "z") {
		return true
	}
	return false
}

// keysEqual 比较两个按键列表是否相等
func keysEqual(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

// FormatKeyCombination 格式化按键组合为可读字符串
func FormatKeyCombination(keys []string) string {
	if len(keys) == 0 {
		return ""
	}

	// Vim 命令直接连接
	if len(keys) > 0 && (keys[0] == ":" || isVimSequence(keys)) {
		return strings.Join(keys, "")
	}

	return strings.Join(keys, "+")
}
