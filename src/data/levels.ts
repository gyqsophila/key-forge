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
    }
];
