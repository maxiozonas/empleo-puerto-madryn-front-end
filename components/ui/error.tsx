interface ErrorProps {
    error: Error | null | undefined;
    message?: string;
}

export default function Error({ error, message }: ErrorProps) {
    const errorMessage = error?.message || message || "Ha ocurrido un error";
    
    return (
        <div className="container min-h-screen flex flex-col items-center justify-center py-6 px-4 text-center text-destructive">
            <p>{errorMessage}</p>
        </div>
    );
}
