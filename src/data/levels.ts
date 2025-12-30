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
    }
];
