import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Oferta } from "@/lib/types/iOferta";

interface ApplyModalProps {
  show: boolean;
  onClose: () => void;
  oferta: Oferta;
  token: string;
  userEmail: string;
  onSuccess: () => void;
}

export default function ApplyModal({ show, onClose, oferta, token, userEmail, onSuccess }: ApplyModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "application/msword": [".doc"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
  });

  const handleSubmitApplication = async () => {
    if (!selectedFile || !userEmail || !oferta?.id) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("applicantEmail", userEmail);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/apply/${oferta.id}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Intenta de nuevo";
      alert("Error al enviar la postulación: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center pb-2">Subir currículum</CardTitle>
          <CardDescription className="text-center text-sm text-muted-foreground">
            <p className="mb-2">Arrastra y suelta tu CV.</p>
            <p className="mb-2">Formato .pdf o .docx</p>
            <p>Recibirás una confirmación por correo.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 cursor-pointer border-dashed p-6 rounded-lg text-center ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}`}
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <p>{selectedFile.name}</p>
            ) : isDragActive ? (
              <p>Suelta el archivo aquí...</p>
            ) : (
              <p>Arrastra tu CV aquí o haz clic para seleccionarlo</p>
            )}
            <Upload className="h-8 w-8 mx-auto mt-2 text-gray-500" />
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="destructive"
              onClick={() => {
                onClose();
                setSelectedFile(null);
              }}
              disabled={isSubmitting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Cancelar
            </Button>
            <Button
              className="bg-accent text-white hover:bg-primary/90"
              onClick={handleSubmitApplication}
              disabled={!selectedFile || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}