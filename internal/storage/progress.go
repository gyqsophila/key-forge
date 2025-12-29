package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// Progress 用户进度数据
type Progress struct {
	CurrentLevelID  string                    `json:"current_level_id"`
	CompletedLevels map[string]CompletedLevel `json:"completed_levels"`
	Profile         string                    `json:"profile"`
	CreatedAt       time.Time                 `json:"created_at"`
	UpdatedAt       time.Time                 `json:"updated_at"`
}

// CompletedLevel 已完成关卡的记录
type CompletedLevel struct {
	CompletedAt time.Time `json:"completed_at"`
	Score       int       `json:"score"`
	Attempts    int       `json:"attempts"`
	BestTime    int64     `json:"best_time_ms"`
}

// ProgressStore 进度存储
type ProgressStore struct {
	filePath string
	progress *Progress
	mu       sync.RWMutex
}

// NewProgressStore 创建进度存储
func NewProgressStore(dataDir string) (*ProgressStore, error) {
	// 确保目录存在
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		return nil, err
	}

	filePath := filepath.Join(dataDir, "progress.json")

	store := &ProgressStore{
		filePath: filePath,
	}

	if err := store.load(); err != nil {
		// 文件不存在时创建新进度
		store.progress = &Progress{
			CompletedLevels: make(map[string]CompletedLevel),
			CreatedAt:       time.Now(),
			UpdatedAt:       time.Now(),
		}
	}

	return store, nil
}

// load 从文件加载进度
func (s *ProgressStore) load() error {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return err
	}

	var progress Progress
	if err := json.Unmarshal(data, &progress); err != nil {
		return err
	}

	// 确保 map 已初始化
	if progress.CompletedLevels == nil {
		progress.CompletedLevels = make(map[string]CompletedLevel)
	}

	s.progress = &progress
	return nil
}

// save 保存进度到文件
func (s *ProgressStore) save() error {
	s.progress.UpdatedAt = time.Now()

	data, err := json.MarshalIndent(s.progress, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(s.filePath, data, 0644)
}

// GetCurrentLevelID 获取当前关卡 ID
func (s *ProgressStore) GetCurrentLevelID() string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.progress.CurrentLevelID
}

// SetCurrentLevel 设置当前关卡
func (s *ProgressStore) SetCurrentLevel(levelID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.progress.CurrentLevelID = levelID
	return s.save()
}

// MarkCompleted 标记关卡完成
func (s *ProgressStore) MarkCompleted(levelID string, score int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	existing, exists := s.progress.CompletedLevels[levelID]

	completed := CompletedLevel{
		CompletedAt: time.Now(),
		Score:       score,
		Attempts:    1,
	}

	if exists {
		completed.Attempts = existing.Attempts + 1
		// 保留最高分
		if existing.Score > score {
			completed.Score = existing.Score
		}
	}

	s.progress.CompletedLevels[levelID] = completed
	return s.save()
}

// IsCompleted 检查关卡是否已完成
func (s *ProgressStore) IsCompleted(levelID string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	_, ok := s.progress.CompletedLevels[levelID]
	return ok
}

// IsCurrent 检查是否为当前关卡
func (s *ProgressStore) IsCurrent(levelID string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.progress.CurrentLevelID == levelID
}

// GetCompletedCount 获取已完成关卡数
func (s *ProgressStore) GetCompletedCount() int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.progress.CompletedLevels)
}

// GetTotalScore 获取总分
func (s *ProgressStore) GetTotalScore() int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	total := 0
	for _, level := range s.progress.CompletedLevels {
		total += level.Score
	}
	return total
}

// Reset 重置所有进度
func (s *ProgressStore) Reset() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.progress = &Progress{
		CompletedLevels: make(map[string]CompletedLevel),
		CreatedAt:       s.progress.CreatedAt,
		UpdatedAt:       time.Now(),
	}

	return s.save()
}

// GetProgress 获取进度数据副本
func (s *ProgressStore) GetProgress() Progress {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// 返回副本
	copied := *s.progress
	copied.CompletedLevels = make(map[string]CompletedLevel)
	for k, v := range s.progress.CompletedLevels {
		copied.CompletedLevels[k] = v
	}
	return copied
}
