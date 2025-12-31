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
    },
    {
        id: "v09-vim-gg",
        title: "Vim: 文档开头 (gg)",
        description: "使用 'gg' 快速跳转到文件的第一行。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "Line 1\nLine 2\nLine 3\nStart here",
            initialSelection: { line: 3, character: 0 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 0, character: 0 }
        },
        hints: ["按两次 'g'"]
    },
    {
        id: "v10-vim-G",
        title: "Vim: 文档结尾 (G)",
        description: "使用 'G' 快速跳转到文件的最后一行。",
        difficulty: "beginner",
        tags: ["vim", "nav"],
        setup: {
            fileType: "plaintext",
            initialContent: "Start here\nLine 2\nLine 3\nLast Line",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "selection",
            matchSelection: { line: 3, character: 0 }
        },
        hints: ["按 'G' (Shift+g)"]
    },
    {
        id: "v11-vim-dw",
        title: "Vim: 删除单词 (dw)",
        description: "当前光标位于 'this' 上。使用 'dw' 删除该单词 (include trailing space)。",
        difficulty: "intermediate",
        tags: ["vim", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "Delete this word",
            initialSelection: { line: 0, character: 7 }
        },
        trigger: {
            type: "content",
            matchContent: "Delete word"
        },
        hints: ["d (delete) + w (word)"]
    },
    {
        id: "v12-vim-dd",
        title: "Vim: 删除行 (dd)",
        description: "使用 'dd' 删除当前行。",
        difficulty: "intermediate",
        tags: ["vim", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "Line 1\nDelete me\nLine 3",
            initialSelection: { line: 1, character: 0 }
        },
        trigger: {
            type: "content",
            matchContent: "Line 1\nLine 3"
        },
        hints: ["按两次 'd'"]
    },
    {
        id: "v13-vim-x",
        title: "Vim: 删除字符 (x)",
        description: "使用 'x' 删除光标所在的字符。",
        difficulty: "intermediate",
        tags: ["vim", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "Hello World",
            initialSelection: { line: 0, character: 4 }
        },
        trigger: {
            type: "content",
            matchContent: "Hell World"
        },
        hints: ["按 'x'"]
    },
    {
        id: "v14-vim-r",
        title: "Vim: 替换字符 (r)",
        description: "使用 'r' 将光标下的字符替换为 'o'。",
        difficulty: "intermediate",
        tags: ["vim", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "Hellx World",
            initialSelection: { line: 0, character: 4 }
        },
        trigger: {
            type: "content",
            matchContent: "Hello World"
        },
        hints: ["按 'r' 然后按 'o'"]
    },
    {
        id: "v15-vim-o",
        title: "Vim: 插入行 (o)",
        description: "使用 'o' 在 'Line 1' 下方插入新行。",
        difficulty: "intermediate",
        tags: ["vim", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "Line 1\nEnd",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "content",
            matchContent: "Line 1\n\nEnd"
        },
        hints: ["按 'o'"]
    },
    {
        id: "v16-vim-O",
        title: "Vim: 插入行 (O)",
        description: "使用 'O' (按Shift+o) 在 'Line 2' 上方插入新行。",
        difficulty: "intermediate",
        tags: ["vim", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "Start\nLine 2",
            initialSelection: { line: 1, character: 0 }
        },
        trigger: {
            type: "content",
            matchContent: "Start\n\nLine 2"
        },
        hints: ["按 'O' (Shift+o)"]
    },
    {
        id: "v17-vim-cw",
        title: "Vim: 修改单词 (cw)",
        description: "光标在 'change' 单词开头，使用 'cw' 删除它并输入 'new'。",
        difficulty: "intermediate",
        tags: ["vim", "edit"],
        setup: {
            fileType: "plaintext",
            initialContent: "change word",
            initialSelection: { line: 0, character: 0 }
        },
        trigger: {
            type: "content",
            matchContent: "new word"
        },
        hints: ["按 'c' 然后 'w'，输入 'new'，按 Esc"]
    }
];
