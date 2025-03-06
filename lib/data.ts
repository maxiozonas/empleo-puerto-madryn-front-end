export async function fetchAllJobs(session: { backendToken: never; }) {
    const response = await fetch("http://localhost:8080/api/ofertas", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.backendToken}`,
        },
    });

    if (!response.ok) {

        throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    return await response.json();
}

export async function fetchJobById(session: { backendToken: never; }, id: never) {
    const response = await fetch(`http://localhost:8080/api/ofertas/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.backendToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    return await response.json();
}

export async function fetchCategories(session: { backendToken: never; }) {
    const response = await fetch("http://localhost:8080/api/categorias", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.backendToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    return await response.json();
}

export async function fetchCategoriById(session: { backendToken: never; }, id: never) {
    const response = await fetch(`http://localhost:8080/api/categorias/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.backendToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${await response.text()}`);
    }

    return await response.json();
}