package engine

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"gopkg.in/yaml.v3"
)

// Difficulty 关卡难度
type Difficulty string

const (
	DifficultyBeginner     Difficulty = "beginner"
	DifficultyIntermediate Difficulty = "intermediate"
	DifficultyAdvanced     Difficulty = "advanced"
)

// KeymapProfile 键位配置
type KeymapProfile string

const (
	ProfileVSCode KeymapProfile = "vscode"
	ProfileVim    KeymapProfile = "vim"
	ProfileBoth   KeymapProfile = "both"
)

// PlatformKeys 不同平台的快捷键定义
type PlatformKeys struct {
	MacOS   []string `yaml:"macos"`
	Windows []string `yaml:"windows"`
	Linux   []string `yaml:"linux"`
}

// Level 关卡定义
type Level struct {
	ID            string            `yaml:"id"`
	Name          string            `yaml:"name"`
	Category      string            `yaml:"category"`
	Difficulty    Difficulty        `yaml:"difficulty"`
	Profile       KeymapProfile     `yaml:"profile"`
	Description   string            `yaml:"description"`
	Scenario      string            `yaml:"scenario"`
	ExpectedKeys  PlatformKeys      `yaml:"expected_keys"`
	Hints         []string          `yaml:"hints"`
	Tips          string            `yaml:"tips"`
	Prerequisites []string          `yaml:"prerequisites"`
	Tags          []string          `yaml:"tags"`
}

// LevelLoader 关卡加载器
type LevelLoader struct {
	levelsDir string
	levels    map[string]*Level
	order     []string
}

// NewLevelLoader 创建关卡加载器
func NewLevelLoader(levelsDir string) *LevelLoader {
	return &LevelLoader{
		levelsDir: levelsDir,
		levels:    make(map[string]*Level),
		order:     make([]string, 0),
	}
}

// LoadAll 加载所有关卡
func (l *LevelLoader) LoadAll() error {
	// 定义加载顺序
	directories := []string{"beginner", "intermediate", "advanced", "vim"}

	for _, dir := range directories {
		dirPath := filepath.Join(l.levelsDir, dir)
		
		// 检查目录是否存在
		if _, err := os.Stat(dirPath); os.IsNotExist(err) {
			continue
		}

		entries, err := os.ReadDir(dirPath)
		if err != nil {
			return fmt.Errorf("读取目录失败 %s: %w", dirPath, err)
		}

		// 按文件名排序确保顺序一致
		var yamlFiles []string
		for _, entry := range entries {
			if !entry.IsDir() && (filepath.Ext(entry.Name()) == ".yaml" || filepath.Ext(entry.Name()) == ".yml") {
				yamlFiles = append(yamlFiles, entry.Name())
			}
		}
		sort.Strings(yamlFiles)

		for _, fileName := range yamlFiles {
			filePath := filepath.Join(dirPath, fileName)
			level, err := l.loadLevel(filePath)
			if err != nil {
				return fmt.Errorf("加载关卡失败 %s: %w", fileName, err)
			}

			l.levels[level.ID] = level
			l.order = append(l.order, level.ID)
		}
	}

	if len(l.levels) == 0 {
		return fmt.Errorf("没有找到任何关卡文件")
	}

	return nil
}

// loadLevel 从文件加载单个关卡
func (l *LevelLoader) loadLevel(path string) (*Level, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var level Level
	if err := yaml.Unmarshal(data, &level); err != nil {
		return nil, err
	}

	return &level, nil
}

// GetLevel 获取指定ID的关卡
func (l *LevelLoader) GetLevel(id string) (*Level, bool) {
	level, ok := l.levels[id]
	return level, ok
}

// GetFirstLevel 获取第一个关卡
func (l *LevelLoader) GetFirstLevel() *Level {
	if len(l.order) == 0 {
		return nil
	}
	return l.levels[l.order[0]]
}

// GetNextLevel 获取下一个关卡
func (l *LevelLoader) GetNextLevel(currentID string) (*Level, bool) {
	for i, id := range l.order {
		if id == currentID && i+1 < len(l.order) {
			return l.levels[l.order[i+1]], true
		}
	}
	return nil, false
}

// GetAllLevels 获取所有关卡（按顺序）
func (l *LevelLoader) GetAllLevels() []*Level {
	result := make([]*Level, 0, len(l.order))
	for _, id := range l.order {
		result = append(result, l.levels[id])
	}
	return result
}

// GetLevelCount 获取关卡总数
func (l *LevelLoader) GetLevelCount() int {
	return len(l.levels)
}

// GetLevelsByProfile 获取指定配置的关卡
func (l *LevelLoader) GetLevelsByProfile(profile KeymapProfile) []*Level {
	result := make([]*Level, 0)
	for _, id := range l.order {
		level := l.levels[id]
		if level.Profile == profile || level.Profile == ProfileBoth {
			result = append(result, level)
		}
	}
	return result
}
