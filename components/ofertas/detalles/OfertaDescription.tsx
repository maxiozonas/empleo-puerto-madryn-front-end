import { useEffect } from "react";
import { Oferta } from "@/lib/types/iOferta";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import style from "../../../components/contacto.module.css";

interface OfertaDescriptionProps {
  oferta: Oferta;
}

export default function OfertaDescription({ oferta }: OfertaDescriptionProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline.configure()],
    editorProps: { attributes: { class: style.editorContent } },
    content: "",
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && oferta) {
      editor.commands.setContent(oferta.descripcion);
    }
  }, [editor, oferta]);

  if (!editor) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">Descripción del empleo</h2>
      <div className="text-gray-700 whitespace-pre-line mb-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}