"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { useEffect } from "react"

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading,
  Code,
  Link2,
} from "lucide-react"

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Placeholder.configure({
        placeholder: "Write something...",
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose border-none outline-none focus:outline-none dark:prose-invert min-h-[150px]",
      },
    },
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
  })

  useEffect(() => {
    return () => editor?.destroy()
  }, [editor])

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter the URL", previousUrl)
    if (url === null) return
    if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run()
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  if (!editor) return null

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 p-2 rounded-md">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "font-bold text-[#990e15]" : ""}><Bold className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "italic text-[#990e15]" : ""}><Italic className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive("underline") ? "underline text-[#990e15]" : ""}><UnderlineIcon className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "text-[#990e15]" : ""}><Heading className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "text-[#990e15]" : ""}><List className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "text-[#990e15]" : ""}><ListOrdered className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "text-[#990e15]" : ""}><Quote className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive("codeBlock") ? "text-[#990e15]" : ""}><Code className="w-4 h-4" /></button>
        <button onClick={addLink}><Link2 className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().undo().run()}><Undo className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().redo().run()}><Redo className="w-4 h-4" /></button>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 min-h-[150px] bg-white dark:bg-zinc-900 focus-within:ring-2 focus-within:ring-[#990e15]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
