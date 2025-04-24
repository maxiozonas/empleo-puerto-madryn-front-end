import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="container min-h-screen flex flex-col items-center justify-center py-6 px-4">
      <Loader2 className="h-8 w-8 animate-spin mx-auto justify-center items-center text-primary" />
      <p className="mt-2 text-muted-foreground">Cargando</p>
    </div>
  );
}