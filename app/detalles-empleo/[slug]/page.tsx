import { Metadata } from "next";
import { fetchOfertaBySlug } from "@/lib/api/ofertas";
import { fetchRandomCategoriaImage } from "@/lib/api/categorias";
import { Oferta } from "@/lib/types/iOferta";
import OfertaDetalle from "./DetallesEmpleo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const oferta: Oferta = await fetchOfertaBySlug(resolvedParams.slug);
    
    let ogImage = "/lib/logo.jpeg";
    if (oferta.categoria?.id) {
        try {
            const randomImage = await fetchRandomCategoriaImage(oferta.categoria.id);
            if (randomImage && randomImage !== "/lib/logo.jpeg") {
                ogImage = randomImage;
            }
        } catch (error) {
            console.error("Error fetching random category image:", error);
        }
    }
    
    const title = `${oferta.titulo} - ${oferta.empresaConsultora} | Madryn Empleos`;
    const description = `Oferta laboral para ${oferta.titulo} en ${oferta.empresaConsultora}, Puerto Madryn, Chubut, Argentina. Postúlate ahora en Madryn Empleos.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://www.madrynempleos.com/detalles-empleo/${resolvedParams.slug}`,
            siteName: "Madryn Empleos",
            images: [
                {
                    url: ogImage.startsWith("http") 
                        ? ogImage 
                        : ogImage === "/lib/logo.jpeg"
                            ? ogImage
                            : `${process.env.NEXT_PUBLIC_API_URL}${ogImage}`,
                    width: 1200,
                    height: 630,
                    alt: `${oferta.titulo} - ${oferta.empresaConsultora}`,
                },
            ],
            locale: "es_AR",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage.startsWith("http") 
                ? ogImage 
                : ogImage === "/lib/logo.jpeg"
                    ? ogImage
                    : `${process.env.NEXT_PUBLIC_API_URL}${ogImage}`,
        },
    };
}

export default async function Page() {
    return <OfertaDetalle />;
}