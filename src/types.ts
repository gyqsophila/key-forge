
export interface Level {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];

    // 环境初始化配置
    setup?: {
        fileType?: string;      // default: plaintext
        initialContent?: string;
        initialSelection?: {    // 光标位置
            line: number;
            character: number;
        };
    };

    // 获胜条件
    trigger: {
        type: 'command' | 'content' | 'selection' | 'state';

        // type: command
        commandId?: string;

        // type: content (regex match)
        matchContent?: string;

        // type: selection
        matchSelection?: {
            line: number;
            character: number;
        };

        // type: state
        stateKey?: string;
        stateValue?: any;

        // requirement: minimum document version (to ensure interaction)
        minEvents?: number;
    };

    hints: string[];
}

export interface UserProgress {
    currentLevelId: string;
    completedLevelIds: string[];
    scores: Record<string, number>;
}
