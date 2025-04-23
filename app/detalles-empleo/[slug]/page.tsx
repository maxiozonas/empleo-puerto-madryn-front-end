import { Metadata } from "next";
import { fetchOfertaBySlug } from "@/lib/api/ofertas";
import { Oferta } from "@/lib/types/iOferta";
import OfertaDetalle from "./DetallesEmpleo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const oferta: Oferta = await fetchOfertaBySlug(resolvedParams.slug);
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
                    url: oferta.logoUrl
                        ? `${process.env.NEXT_PUBLIC_API_URL}${oferta.logoUrl}`
                        : "/lib/logo.jpeg",
                    width: 1200,
                    height: 630,
                    alt: `Logo de ${oferta.empresaConsultora}`,
                },
            ],
            locale: "es_AR",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: oferta.logoUrl
                ? `${process.env.NEXT_PUBLIC_API_URL}${oferta.logoUrl}`
                : "/lib/logo.jpeg",
        },
    };
}

export default async function Page() {
    return <OfertaDetalle />;
}