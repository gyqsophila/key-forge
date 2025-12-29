package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// AttemptRecord 单次尝试记录
type AttemptRecord struct {
	Correct      bool
	ResponseTime time.Duration
	HintsUsed    int
}

// LevelStats 单个关卡的统计
type LevelStats struct {
	TotalAttempts     int           `json:"total_attempts"`
	CorrectAttempts   int           `json:"correct_attempts"`
	TotalHintsUsed    int           `json:"total_hints_used"`
	TotalResponseTime time.Duration `json:"total_response_time"`
	BestResponseTime  time.Duration `json:"best_response_time"`
	LastAttemptAt     time.Time     `json:"last_attempt_at"`
}

// Stats 统计数据
type Stats struct {
	LevelStats map[string]*LevelStats `json:"level_stats"`
	CreatedAt  time.Time              `json:"created_at"`
	UpdatedAt  time.Time              `json:"updated_at"`
}

// StatsStore 统计存储
type StatsStore struct {
	filePath string
	stats    *Stats
	mu       sync.RWMutex
}

// NewStatsStore 创建统计存储
func NewStatsStore(dataDir string) (*StatsStore, error) {
	// 确保目录存在
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, err
	}

	filePath := filepath.Join(dataDir, "stats.json")

	store := &StatsStore{
		filePath: filePath,
	}

	if err := store.load(); err != nil {
		// 文件不存在时创建新统计
		store.stats = &Stats{
			LevelStats: make(map[string]*LevelStats),
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		}
	}

	return store, nil
}

// load 从文件加载统计
func (s *StatsStore) load() error {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return err
	}

	var stats Stats
	if err := json.Unmarshal(data, &stats); err != nil {
		return err
	}

	if stats.LevelStats == nil {
		stats.LevelStats = make(map[string]*LevelStats)
	}

	s.stats = &stats
	return nil
}

// save 保存统计到文件
func (s *StatsStore) save() error {
	s.stats.UpdatedAt = time.Now()

	data, err := json.MarshalIndent(s.stats, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.filePath, data, 0644)
}

// RecordAttempt 记录一次尝试
func (s *StatsStore) RecordAttempt(levelID string, record AttemptRecord) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	levelStats, ok := s.stats.LevelStats[levelID]
	if !ok {
		levelStats = &LevelStats{}
		s.stats.LevelStats[levelID] = levelStats
	}

	levelStats.TotalAttempts++
	levelStats.TotalHintsUsed += record.HintsUsed
	levelStats.TotalResponseTime += record.ResponseTime
	levelStats.LastAttemptAt = time.Now()

	if record.Correct {
		levelStats.CorrectAttempts++
		if levelStats.BestResponseTime == 0 || record.ResponseTime < levelStats.BestResponseTime {
			levelStats.BestResponseTime = record.ResponseTime
		}
	}

	return s.save()
}

// GlobalStats 全局统计摘要
type GlobalStats struct {
	TotalAttempts        int
	TotalCorrect         int
	TotalLevelsAttempted int
	TotalHintsUsed       int
	AverageResponseTime  time.Duration
	FirstTrySuccessRate  float64
}

// GetGlobalStats 获取全局统计
func (s *StatsStore) GetGlobalStats() GlobalStats {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var stats GlobalStats
	var totalTime time.Duration

	for _, ls := range s.stats.LevelStats {
		stats.TotalAttempts += ls.TotalAttempts
		stats.TotalCorrect += ls.CorrectAttempts
		stats.TotalHintsUsed += ls.TotalHintsUsed
		totalTime += ls.TotalResponseTime
	}

	stats.TotalLevelsAttempted = len(s.stats.LevelStats)

	if stats.TotalAttempts > 0 {
		stats.AverageResponseTime = totalTime / time.Duration(stats.TotalAttempts)
	}

	if stats.TotalLevelsAttempted > 0 {
		// 计算首次通过率 (简化：正确次数/总关卡数)
		stats.FirstTrySuccessRate = float64(stats.TotalCorrect) / float64(stats.TotalAttempts)
	}

	return stats
}

// GetLevelStats 获取指定关卡的统计
func (s *StatsStore) GetLevelStats(levelID string) *LevelStats {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if ls, ok := s.stats.LevelStats[levelID]; ok {
		copied := *ls
		return &copied
	}
	return nil
}

// GetWeakLevels 获取薄弱关卡（错误率高的）
func (s *StatsStore) GetWeakLevels(threshold float64) []string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var weakLevels []string
	for id, ls := range s.stats.LevelStats {
		if ls.TotalAttempts > 0 {
			errorRate := 1.0 - float64(ls.CorrectAttempts)/float64(ls.TotalAttempts)
			if errorRate >= threshold {
				weakLevels = append(weakLevels, id)
			}
		}
	}
	return weakLevels
}

// Reset 重置统计
func (s *StatsStore) Reset() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.stats = &Stats{
		LevelStats: make(map[string]*LevelStats),
		CreatedAt:  s.stats.CreatedAt,
		UpdatedAt:  time.Now(),
	}

	return s.save()
}
