import { Message } from "../types/iMessage";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function createMessage(
    data: {
        name: string;
        lastName: string;
        email: string;
        message: string;
    },
    token: string
): Promise<Message> {

    const response = await fetch(`${apiUrl}/api/contactar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    if (typeof responseData !== "object" || responseData === null) {
        throw new Error("La respuesta del servidor no es un objeto válido");
    }

    return responseData as Message;
}