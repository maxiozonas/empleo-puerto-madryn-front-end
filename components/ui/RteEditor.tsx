"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import style from '../contacto.module.css';
import Underline from "@tiptap/extension-underline";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaListUl,
    FaListOl,
    FaSmile,    
} from "react-icons/fa";
import { useState } from "react";

interface TipTapProps {
    content: string;
    onChange: (value: string) => void;
}

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, action: () => void) => {
    e.preventDefault();
    e.stopPropagation(); 
    action();
};

const TipTap = ({ content, onChange }: TipTapProps) => {
    const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
    
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline.configure(),            
        ],
        content: content || "<p>Escribe tu mensaje aquí...</p>",
        editorProps: {
            attributes: {
                class: style.editorContent,
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());        
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }
    const insertEmoji = (emoji: string) => {
        editor.chain().focus().insertContent(emoji).run();
        setIsEmojiPanelOpen(false);
    };

    const emojis = [
        '😀', '😊', '😂', '😎', '😍', '🥳', '😢', '😡', '😱',
        '👍', '👎', '👏', '🙌', '🙏', '✋', '👊', '✌️', '👌', '🤝',
        '❤️', '💔', '💖', '💙', '💚', '💜', '🖤', '💛', '💯', '✨',
        '⭐', '🌟', '☀️', '🌙', '🌈', '☁️', '⚡', '❄️', '🔥', '💧',
        '🍎', '🍌', '🍕', '🍔', '🍟', '🍦', '🍰', '☕', '🍺', '🍷',
        '🚀', '✈️', '🚗', '🚲', '⛵', '🏠', '🏡', '🏖️', '🌋', '⚽', 
        '🏀', '🏈', '🎾', '🏐', '🎯', '🎸', '🎹', '🎤', '🎬', '💻',
        '✅', '❌', '⭕', '☑️', '🔘', '⚠️', '⌛', '🔍', '💡',
    ];
   
    return (
        <div className="flex flex-col">
            <div className="h-full w-full p-2">
                <div className="flex space-x-2 mb-2">                    
                    <button
                        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
                        className={`p-2 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
                    >
                        <FaBold />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
                        className={`p-2 ${editor.isActive("italic") ? "bg-gray-300" : ""}`}
                    >
                        <FaItalic />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleMark('underline').run())}
                        className={`p-2 ${editor.isActive("underline") ? "bg-gray-300" : ""}`}
                    >
                        <FaUnderline />
                    </button>                    
                    <button
                        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
                        className={`p-2 ${editor.isActive("bulletList") ? "bg-gray-300" : ""}`}
                    >
                        <FaListUl />
                    </button>
                    <button
                        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
                        className={`p-2 ${editor.isActive("orderedList") ? "bg-gray-300" : ""}`}
                    >
                        <FaListOl />
                    </button>
                    <div className="relative">
                        <button
                            onClick={(e) => handleButtonClick(e, () => setIsEmojiPanelOpen(!isEmojiPanelOpen))}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                        >
                            <FaSmile />
                        </button>
                        {isEmojiPanelOpen && (
                            <div className="absolute w-56 z-10 mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto grid grid-cols-6 gap-2">
                                {emojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={(e) => handleButtonClick(e, () => insertEmoji(emoji))}
                                        className="p-1 hover:bg-gray-100 rounded text-xl"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>                 
                </div>
                <EditorContent editor={editor} className="rounded-lg p-2 border focus-visible:ring-primary" />
            </div>
        </div>
    );
};

export default TipTap;