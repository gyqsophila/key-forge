import { Level } from '../types';

export const levels: Level[] = [
    {
        id: "001-save-file",
        title: "保存文件",
        description: "编辑了文件后，你需要将更改保存到磁盘。",
        difficulty: "beginner",
        tags: ["basic", "file"],
        setup: {
            fileType: "javascript",
            initialContent: "// 这是一个未保存的文件\n// 请尝试按下快捷键保存它\n\nconsole.log('Hello KeyForge!');",
            initialSelection: { line: 3, character: 0 }
        },
        trigger: {
            type: "command",
            commandId: "workbench.action.files.save"
        },
        hints: [
            "macOS: Cmd+S",
            "Windows/Linux: Ctrl+S"
        ]
    },
    {
        id: "002-undo",
        title: "撤销操作",
        description: "不小心删除了重要代码？使用撤销命令恢复它。",
        difficulty: "beginner",
        tags: ["basic", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "这是一行重要的文字。\n快把它删掉，然后撤销回来！",
            initialSelection: { line: 1, character: 5 }
        },
        trigger: {
            type: "content",
            matchContent: "这是一行重要的文字。\n快把它删掉，然后撤销回来！"
        },
        hints: [
            "macOS: Cmd+Z",
            "Windows/Linux: Ctrl+Z"
        ]
    },
    {
        id: "003-redo",
        title: "重做操作",
        description: "撤销过头了？使用重做命令恢复被撤销的操作。",
        difficulty: "beginner",
        tags: ["basic", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "这是一行不需要的文字。",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "content",
            matchContent: ""
        },
        hints: [
            "1. 先删除文字",
            "2. 撤销 (Cmd+Z)",
            "3. 重做 (macOS: Cmd+Shift+Z, Win: Ctrl+Y)"
        ]
    },
    {
        id: "004-delete-line",
        title: "删除当前行",
        description: "快速删除光标所在的整行代码，无需选中。",
        difficulty: "beginner",
        tags: ["basic", "edit"],
        setup: {
            fileType: "javascript",
            initialContent: "function demo() {\n    const a = 1;\n    console.log('删除这行');\n    return a;\n}",
            initialSelection: { line: 2, character: 10 }
        },
        trigger: {
            type: "content",
            matchContent: "function demo() {\n    const a = 1;\n    return a;\n}"
        },
        hints: [
            "macOS: Cmd+Shift+K",
            "Windows: Ctrl+Shift+K",
            "Linux: Ctrl+Shift+K"
        ]
    },
    {
        id: "005-copy-paste",
        title: "复制粘贴",
        description: "复制第一行，并将其粘贴到第二行，使两行内容相同。",
        difficulty: "beginner",
        tags: ["basic", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "Hello KeyForge",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "content",
            matchContent: "Hello KeyForge\nHello KeyForge"
        },
        hints: [
            "1. 光标在第一行，按 Cmd+C 复制 (VSCode会自动复制整行)",
            "2. 这是一个空行，按 Cmd+V 粘贴"
        ]
    },
    // --- Phase 4: Vim Navigation ---
    {
        id: "v01-vim-right",
        title: "Vim: 向右移动 (l)",
        description: "在 Normal 模式下，使用 'l' 键向右移动光标。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "Move cursor to the > end",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 23 }
        },
        hints: ["按 'l' 向右移动"]
    },
    {
        id: "v02-vim-left",
        title: "Vim: 向左移动 (h)",
        description: "在 Normal 模式下，使用 'h' 键向左移动光标。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "start < Move cursor here",
            initialSelection: { line: 0, character: 23 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 0 }
        },
        hints: ["按 'h' 向左移动"]
    },
    {
        id: "v03-vim-down",
        title: "Vim: 向下移动 (j)",
        description: "使用 'j' 键向下移动光标到最后一行。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "Line 1\nLine 2\nLine 3\nTarget Line",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 3, character: 0 }
        },
        hints: ["按 'j' 向下移动"]
    },
    {
        id: "v04-vim-up",
        title: "Vim: 向上移动 (k)",
        description: "使用 'k' 键向上移动光标到第一行。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "Target Line\nLine 2\nLine 3\nStart Line",
            initialSelection: { line: 3, character: 0 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 0 }
        },
        hints: ["按 'k' 向上移动"]
    },
    {
        id: "v05-vim-w",
        title: "Vim: 下个单词 (w)",
        description: "使用 'w' 跳到下一个单词的开头。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "jump to the next word",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 5 }
        },
        hints: ["按 'w' 跳到 'to'"]
    },
    {
        id: "v06-vim-b",
        title: "Vim: 上个单词 (b)",
        description: "使用 'b' 跳回上一个单词的开头。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "back to start",
            initialSelection: { line: 0, character: 8 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 5 }
        },
        hints: ["按 'b' 跳回到 'to'"]
    },
    {
        id: "v07-vim-0",
        title: "Vim: 行首 (0)",
        description: "使用 '0' 快速跳转到行首。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "Go to the beginning of this line",
            initialSelection: { line: 0, character: 20 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 0 }
        },
        hints: ["按 '0' (数字0)"]
    },
    {
        id: "v08-vim-dollar",
        title: "Vim: 行尾 ($)",
        description: "使用 '$' 快速跳转到行尾。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "Go to the end of this line",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 25 }
        },
        hints: ["按 '$' (Shift+4)"]
    }
];
