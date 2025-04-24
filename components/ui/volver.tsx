import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

const handleBack = () => {
    window.history.back();
};

export default function VolverButton() {
    return (
        <div className="flex items-center mb-6">
            <Button
                onClick={handleBack}
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Volver</span>
            </Button>
        </div>
    );
}
