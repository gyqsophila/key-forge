package engine

import (
	"errors"
	"fmt"

	"github.com/keyforge/keyforge/internal/storage"
)

// GameState 游戏状态
type GameState string

const (
	StateIdle      GameState = "idle"
	StatePlaying   GameState = "playing"
	StateCompleted GameState = "completed"
)

// Game 游戏引擎
type Game struct {
	loader       *LevelLoader
	verifier     *KeyVerifier
	progress     *storage.ProgressStore
	stats        *storage.StatsStore
	currentLevel *Level
	state        GameState
	profile      KeymapProfile
	hintLevel    int
}

// NewGame 创建游戏实例
func NewGame(levelsDir, dataDir string) (*Game, error) {
	loader := NewLevelLoader(levelsDir)
	if err := loader.LoadAll(); err != nil {
		return nil, fmt.Errorf("加载关卡失败: %w", err)
	}

	progress, err := storage.NewProgressStore(dataDir)
	if err != nil {
		return nil, fmt.Errorf("初始化进度存储失败: %w", err)
	}

	stats, err := storage.NewStatsStore(dataDir)
	if err != nil {
		return nil, fmt.Errorf("初始化统计存储失败: %w", err)
	}

	return &Game{
		loader:   loader,
		verifier: NewKeyVerifier(),
		progress: progress,
		stats:    stats,
		state:    StateIdle,
		profile:  ProfileVSCode,
	}, nil
}

// SetProfile 设置键位配置
func (g *Game) SetProfile(profile KeymapProfile) {
	g.profile = profile
}

// GetProfile 获取当前键位配置
func (g *Game) GetProfile() KeymapProfile {
	return g.profile
}

// PlayResult Play 命令的结果
type PlayResult struct {
	Level       *Level
	Description string
	IsNew       bool
}

// Play 开始或继续游戏
func (g *Game) Play() (*PlayResult, error) {
	currentID := g.progress.GetCurrentLevelID()
	var level *Level
	var ok bool

	if currentID != "" {
		level, ok = g.loader.GetLevel(currentID)
	}

	if !ok || level == nil {
		level = g.loader.GetFirstLevel()
		if level == nil {
			return nil, errors.New("没有可用的关卡")
		}
	}

	// 检查关卡是否适用于当前配置
	if !g.isLevelApplicable(level) {
		// 尝试找下一个适用的关卡
		level = g.findNextApplicableLevel("")
		if level == nil {
			return nil, fmt.Errorf("没有适用于当前键位配置 (%s) 的关卡", g.profile)
		}
	}

	g.currentLevel = level
	g.verifier.SetLevel(level)
	g.state = StatePlaying
	g.hintLevel = 0

	return &PlayResult{
		Level:       level,
		Description: level.Description,
		IsNew:       currentID != level.ID,
	}, nil
}

// isLevelApplicable 检查关卡是否适用于当前配置
func (g *Game) isLevelApplicable(level *Level) bool {
	if level.Profile == ProfileBoth {
		return true
	}
	return level.Profile == g.profile
}

// findNextApplicableLevel 找到下一个适用的关卡
func (g *Game) findNextApplicableLevel(currentID string) *Level {
	levels := g.loader.GetAllLevels()
	started := currentID == ""

	for _, level := range levels {
		if !started {
			if level.ID == currentID {
				started = true
			}
			continue
		}
		if g.isLevelApplicable(level) {
			return level
		}
	}
	return nil
}

// SubmitResult 提交答案的结果
type SubmitResult struct {
	Correct       bool
	Expected      []string
	Actual        []string
	ResponseTime  string
	HintsUsed     int
	Score         int
	NextLevel     *Level
	GameCompleted bool
}

// SubmitAnswer 提交答案（读取文本输入并验证）
func (g *Game) SubmitAnswer() (*SubmitResult, error) {
	if g.state != StatePlaying {
		return nil, errors.New("当前没有正在进行的关卡")
	}

	// 读取用户输入并验证
	verifyResult, err := g.verifier.ReadAndVerify()
	if err != nil {
		return nil, fmt.Errorf("读取输入失败: %w", err)
	}

	return g.processVerifyResult(verifyResult)
}

// SubmitAnswerText 提交文本答案进行验证
func (g *Game) SubmitAnswerText(answer string) (*SubmitResult, error) {
	if g.state != StatePlaying {
		return nil, errors.New("当前没有正在进行的关卡")
	}

	// 验证答案
	verifyResult := g.verifier.VerifyText(answer)

	return g.processVerifyResult(verifyResult)
}

// processVerifyResult 处理验证结果
func (g *Game) processVerifyResult(verifyResult VerifyResult) (*SubmitResult, error) {
	score := g.calculateScore(verifyResult.Correct)

	result := &SubmitResult{
		Correct:      verifyResult.Correct,
		Expected:     verifyResult.Expected,
		Actual:       verifyResult.Actual,
		ResponseTime: verifyResult.ResponseTime.String(),
		HintsUsed:    g.hintLevel,
		Score:        score,
	}

	// 记录统计
	g.stats.RecordAttempt(g.currentLevel.ID, storage.AttemptRecord{
		Correct:      verifyResult.Correct,
		ResponseTime: verifyResult.ResponseTime,
		HintsUsed:    g.hintLevel,
	})

	if verifyResult.Correct {
		// 标记关卡完成
		g.progress.MarkCompleted(g.currentLevel.ID, score)

		// 找下一个适用的关卡
		nextLevel := g.findNextApplicableLevel(g.currentLevel.ID)
		if nextLevel != nil {
			g.progress.SetCurrentLevel(nextLevel.ID)
			result.NextLevel = nextLevel
		} else {
			g.state = StateCompleted
			result.GameCompleted = true
		}
	}

	return result, nil
}

// GetHint 获取提示
func (g *Game) GetHint() (string, int, error) {
	if g.currentLevel == nil {
		return "", 0, errors.New("当前没有正在进行的关卡")
	}

	if g.hintLevel >= len(g.currentLevel.Hints) {
		return "没有更多提示了。输入 'keyforge answer' 查看答案。", g.hintLevel, nil
	}

	hint := g.currentLevel.Hints[g.hintLevel]
	g.hintLevel++

	return hint, g.hintLevel, nil
}

// GetAnswer 获取答案
func (g *Game) GetAnswer() (string, string, error) {
	if g.currentLevel == nil {
		return "", "", errors.New("当前没有正在进行的关卡")
	}

	g.hintLevel = len(g.currentLevel.Hints) + 1 // 标记已查看答案

	expected := g.verifier.GetExpectedKeys()
	return FormatKeyCombination(expected), g.currentLevel.Tips, nil
}

// GetCurrentLevel 获取当前关卡
func (g *Game) GetCurrentLevel() *Level {
	return g.currentLevel
}

// GetAllLevels 获取所有关卡
func (g *Game) GetAllLevels() []*Level {
	return g.loader.GetLevelsByProfile(g.profile)
}

// GetTotalLevelCount 获取关卡总数
func (g *Game) GetTotalLevelCount() int {
	return len(g.loader.GetLevelsByProfile(g.profile))
}

// GetProgress 获取进度存储
func (g *Game) GetProgress() *storage.ProgressStore {
	return g.progress
}

// GetStats 获取统计存储
func (g *Game) GetStats() *storage.StatsStore {
	return g.stats
}

// Reset 重置进度
func (g *Game) Reset() error {
	g.state = StateIdle
	g.currentLevel = nil
	g.hintLevel = 0
	return g.progress.Reset()
}

// GetPlatform 获取当前平台
func (g *Game) GetPlatform() string {
	return g.verifier.GetPlatform()
}

// calculateScore 计算得分
func (g *Game) calculateScore(correct bool) int {
	if !correct {
		return 0
	}

	baseScore := 100
	hintPenalty := g.hintLevel * 20
	score := baseScore - hintPenalty
	if score < 0 {
		score = 0
	}
	return score
}
