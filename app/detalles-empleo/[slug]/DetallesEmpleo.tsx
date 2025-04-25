"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOfertaBySlug } from "@/lib/hooks/useOfertas";
import OfertaHeader from "@/components/ofertas/detalles/OfertaHeader";
import OfertaActions from "@/components/ofertas/detalles/OfertaActions";
import OfertaDescription from "@/components/ofertas/detalles/OfertaDescription";
import OfertaDetails from "@/components/ofertas/detalles/OfertaDetails";
import ApplyModal from "@/components/ofertas/detalles/ApplyModal";
import SuccessAlert from "@/components/ofertas/detalles/SuccessAlert";
import VolverButton from "@/components/ui/volver";
import Loader from "@/components/ui/loader";

export default function OfertaDetalle() {
  const router = useRouter();
  const { slug } = useParams();
  const { data: session, status } = useSession();
  const token = session?.backendToken || "";
  const userEmail = session?.user?.email || "";
  const { data: oferta, isLoading, error } = useOfertaBySlug(slug as string);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const isOwnPost = oferta?.usuarioPublicador?.email === userEmail;

  const handleApply = () => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (oferta?.formaPostulacion === "MAIL") {
      setShowApplyModal(true);
    } else if (oferta?.formaPostulacion === "LINK" && oferta?.contactoPostulacion) {
      window.open(oferta.contactoPostulacion, "_blank");
    }
  };

  if (isLoading) { return <Loader />; }

  if (error || !oferta) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive">
        <p>{error?.message || "No se pudo cargar la oferta"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <VolverButton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OfertaHeader oferta={oferta} />
          <div className="top-20 lg:hidden">
            <OfertaActions
              oferta={oferta}
              isOwnPost={isOwnPost}
              token={token}
              status={status}
              onApply={handleApply}
            />
        </div>
          <OfertaDescription oferta={oferta} />
          <OfertaDetails oferta={oferta} />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <OfertaActions
              oferta={oferta}
              isOwnPost={isOwnPost}
              token={token}
              status={status}
              onApply={handleApply}
            />
          </div>
        </div>

      </div>

      <ApplyModal
        show={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        oferta={oferta}
        token={token}
        userEmail={userEmail}
        onSuccess={() => {
          setShowApplyModal(false);
          setShowSuccessAlert(true);
          setTimeout(() => setShowSuccessAlert(false), 5000);
        }}
      />

      <SuccessAlert show={showSuccessAlert} onClose={() => setShowSuccessAlert(false)} />
    </div>
  );
}