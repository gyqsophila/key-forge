package engine

import (
	"fmt"
	"runtime"
	"sort"
	"strings"
	"time"

	"github.com/eiannone/keyboard"
)

// KeyVerifier 按键验证器
type KeyVerifier struct {
	platform      string
	currentLevel  *Level
	capturedKeys  []string
	modifiersHeld map[string]bool
	startTime     time.Time
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
		platform:      detectPlatform(),
		modifiersHeld: make(map[string]bool),
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
	v.capturedKeys = nil
	v.modifiersHeld = make(map[string]bool)
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

// CaptureAndVerify 捕获用户按键并验证
func (v *KeyVerifier) CaptureAndVerify() (VerifyResult, error) {
	if err := keyboard.Open(); err != nil {
		return VerifyResult{}, fmt.Errorf("无法打开键盘监听: %w", err)
	}
	defer keyboard.Close()

	v.startTime = time.Now()
	v.capturedKeys = nil
	v.modifiersHeld = make(map[string]bool)

	// 等待用户输入完整的快捷键组合
	for {
		char, key, err := keyboard.GetKey()
		if err != nil {
			return VerifyResult{}, fmt.Errorf("读取按键失败: %w", err)
		}

		// 处理按键
		keyStr := v.parseKey(char, key)
		if keyStr == "" {
			continue
		}

		// 检查是否是修饰键
		if isModifier(keyStr) {
			v.modifiersHeld[keyStr] = true
			continue
		}

		// 非修饰键，构建完整的组合
		v.capturedKeys = v.buildKeyCombination(keyStr)
		break
	}

	// 验证按键组合
	result := v.verify()
	result.ResponseTime = time.Since(v.startTime)

	return result, nil
}

// parseKey 解析按键
func (v *KeyVerifier) parseKey(char rune, key keyboard.Key) string {
	// 处理特殊键
	switch key {
	case keyboard.KeySpace:
		return "Space"
	case keyboard.KeyEnter:
		return "Enter"
	case keyboard.KeyEsc:
		return "Esc"
	case keyboard.KeyArrowUp:
		return "Up"
	case keyboard.KeyArrowDown:
		return "Down"
	case keyboard.KeyArrowLeft:
		return "Left"
	case keyboard.KeyArrowRight:
		return "Right"
	case keyboard.KeyTab:
		return "Tab"
	case keyboard.KeyBackspace, keyboard.KeyBackspace2:
		return "Backspace"
	case keyboard.KeyDelete:
		return "Delete"
	case keyboard.KeyHome:
		return "Home"
	case keyboard.KeyEnd:
		return "End"
	case keyboard.KeyPgup:
		return "PageUp"
	case keyboard.KeyPgdn:
		return "PageDown"
	case keyboard.KeyF1:
		return "F1"
	case keyboard.KeyF2:
		return "F2"
	case keyboard.KeyF3:
		return "F3"
	case keyboard.KeyF4:
		return "F4"
	case keyboard.KeyF5:
		return "F5"
	case keyboard.KeyF6:
		return "F6"
	case keyboard.KeyF7:
		return "F7"
	case keyboard.KeyF8:
		return "F8"
	case keyboard.KeyF9:
		return "F9"
	case keyboard.KeyF10:
		return "F10"
	case keyboard.KeyF11:
		return "F11"
	case keyboard.KeyF12:
		return "F12"
	case keyboard.KeyCtrlA:
		v.modifiersHeld["Ctrl"] = true
		return "A"
	case keyboard.KeyCtrlB:
		v.modifiersHeld["Ctrl"] = true
		return "B"
	case keyboard.KeyCtrlC:
		v.modifiersHeld["Ctrl"] = true
		return "C"
	case keyboard.KeyCtrlD:
		v.modifiersHeld["Ctrl"] = true
		return "D"
	case keyboard.KeyCtrlE:
		v.modifiersHeld["Ctrl"] = true
		return "E"
	case keyboard.KeyCtrlF:
		v.modifiersHeld["Ctrl"] = true
		return "F"
	case keyboard.KeyCtrlG:
		v.modifiersHeld["Ctrl"] = true
		return "G"
	// Note: KeyCtrlH (8) = KeyBackspace, KeyCtrlI (9) = KeyTab - handled above
	case keyboard.KeyCtrlJ:
		v.modifiersHeld["Ctrl"] = true
		return "J"
	case keyboard.KeyCtrlK:
		v.modifiersHeld["Ctrl"] = true
		return "K"
	case keyboard.KeyCtrlL:
		v.modifiersHeld["Ctrl"] = true
		return "L"
	case keyboard.KeyCtrlN:
		v.modifiersHeld["Ctrl"] = true
		return "N"
	case keyboard.KeyCtrlO:
		v.modifiersHeld["Ctrl"] = true
		return "O"
	case keyboard.KeyCtrlP:
		v.modifiersHeld["Ctrl"] = true
		return "P"
	case keyboard.KeyCtrlQ:
		v.modifiersHeld["Ctrl"] = true
		return "Q"
	case keyboard.KeyCtrlR:
		v.modifiersHeld["Ctrl"] = true
		return "R"
	case keyboard.KeyCtrlS:
		v.modifiersHeld["Ctrl"] = true
		return "S"
	case keyboard.KeyCtrlT:
		v.modifiersHeld["Ctrl"] = true
		return "T"
	case keyboard.KeyCtrlU:
		v.modifiersHeld["Ctrl"] = true
		return "U"
	case keyboard.KeyCtrlV:
		v.modifiersHeld["Ctrl"] = true
		return "V"
	case keyboard.KeyCtrlW:
		v.modifiersHeld["Ctrl"] = true
		return "W"
	case keyboard.KeyCtrlX:
		v.modifiersHeld["Ctrl"] = true
		return "X"
	case keyboard.KeyCtrlY:
		v.modifiersHeld["Ctrl"] = true
		return "Y"
	case keyboard.KeyCtrlZ:
		v.modifiersHeld["Ctrl"] = true
		return "Z"
	}

	// 处理普通字符
	if char != 0 {
		return strings.ToUpper(string(char))
	}

	return ""
}

// isModifier 判断是否为修饰键
func isModifier(key string) bool {
	modifiers := []string{"Ctrl", "Alt", "Shift", "Cmd", "Meta", "Option"}
	for _, m := range modifiers {
		if strings.EqualFold(key, m) {
			return true
		}
	}
	return false
}

// buildKeyCombination 构建按键组合
func (v *KeyVerifier) buildKeyCombination(mainKey string) []string {
	var combo []string

	// 按固定顺序添加修饰键
	modifierOrder := []string{"Ctrl", "Cmd", "Alt", "Shift"}
	for _, mod := range modifierOrder {
		if v.modifiersHeld[mod] {
			combo = append(combo, mod)
		}
	}

	combo = append(combo, mainKey)
	return combo
}

// verify 验证按键组合
func (v *KeyVerifier) verify() VerifyResult {
	expected := v.GetExpectedKeys()
	actual := v.capturedKeys

	result := VerifyResult{
		Expected: expected,
		Actual:   actual,
	}

	// 标准化并比较
	result.Correct = keysEqual(
		normalizeKeys(expected),
		normalizeKeys(actual),
	)

	return result
}

// normalizeKeys 标准化按键列表
func normalizeKeys(keys []string) []string {
	if len(keys) == 0 {
		return keys
	}

	normalized := make([]string, len(keys))
	for i, k := range keys {
		normalized[i] = strings.ToLower(strings.TrimSpace(k))
	}

	// 只对修饰键排序，主键保持在最后
	if len(normalized) > 1 {
		modifiers := normalized[:len(normalized)-1]
		sort.Strings(modifiers)
		for i, m := range modifiers {
			normalized[i] = m
		}
	}

	return normalized
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
	return strings.Join(keys, " + ")
}
