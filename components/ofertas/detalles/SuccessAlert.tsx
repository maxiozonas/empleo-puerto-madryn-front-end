import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface SuccessAlertProps {
  show: boolean;
  onClose: () => void;
}

export default function SuccessAlert({ show, onClose }: SuccessAlertProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <Alert
        variant="default"
        className="bg-green-50 border-green-400 text-green-800 shadow-lg max-w-md w-full mx-4 p-6 text-center rounded-lg"
      >
        <CheckCircle2 className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">¡Postulación enviada!</AlertTitle>
        <AlertDescription className="mt-1">
          Tu CV se ha enviado con éxito. Revisa tu correo para una confirmación.
        </AlertDescription>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full text-"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </Alert>
    </div>
  );
}