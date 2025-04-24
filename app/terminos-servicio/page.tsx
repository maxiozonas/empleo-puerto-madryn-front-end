"use client";

import VolverButton from "@/components/ui/volver";

export default function TerminosServicioPage() {
  return (
    <div className="container mx-auto min-h-screen py-6 px-4">
      <VolverButton />

      <h1 className="text-2xl font-bold text-primary mb-6 text-center uppercase">Términos de Servicio</h1>
      <section className="space-y-6 text-gray-700 text-justify">
        <h2 className="text-2xl font-semibold">Bienvenido a Madryn Empleos</h2>
        <p>
          Bienvenido(a) a <strong>Madryn Empleos</strong>, una plataforma dedicada a conectar buscadores de empleo con empleadores en Puerto Madryn y sus alrededores. Al acceder o usar nuestro sitio web, aceptas cumplir con estos Términos de Servicio. Si no estás de acuerdo con ellos, te pedimos que no utilices nuestra plataforma. Estos términos pueden actualizarse, y te notificaremos de cambios significativos a través del sitio o por correo a <strong>empleospuertomadryn@gmail.com</strong>.
        </p>

        <h3 className="text-xl font-semibold">Uso de la plataforma</h3>
        <p>
          Madryn Empleos está destinada a usuarios mayores de 18 años que buscan empleo o desean publicar ofertas laborales en Puerto Madryn, Chubut, Argentina. Te comprometes a:
        </p>
        <ul className="list-disc pl-6">
          <li>Proporcionar información precisa y actualizada al registrarte o publicar avisos.</li>
          <li>No publicar contenido ilegal, ofensivo, fraudulento o que infrinja derechos de terceros.</li>
          <li>No usar la plataforma para fines distintos a los previstos (como spam o phishing).</li>
        </ul>

        <h3 className="text-xl font-semibold">Registro y cuentas</h3>
        <p>
          Para acceder a ciertas funciones, como publicar avisos, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tus credenciales y de todas las actividades que ocurran bajo tu cuenta. Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos.
        </p>

        <h3 className="text-xl font-semibold">Publicación de ofertas laborales</h3>
        <p>
          Los empleadores pueden publicar ofertas de empleo sujetas a las siguientes condiciones:
        </p>
        <ul className="list-disc pl-6">
          <li>Las ofertas deben ser legítimas, claras y no engañosas.</li>
          <li>No se permiten publicaciones que promuevan actividades ilegales o discriminatorias.</li>
          <li>Nos reservamos el derecho de moderar, editar o eliminar avisos que no cumplan con nuestras políticas.</li>
        </ul>

        <h3 className="text-xl font-semibold">Propiedad intelectual</h3>
        <p>
          Todo el contenido creado por Madryn Empleos (como el diseño, logotipos y textos) es propiedad nuestra o de nuestros licenciantes y está protegido por leyes de derechos de autor. Puedes usar el sitio para fines personales, pero no copiar, distribuir o modificar nuestro contenido sin permiso.
        </p>
        <p>
          Al publicar avisos o contenido, nos otorgas una licencia no exclusiva, mundial y gratuita para usar, reproducir y mostrar dicho contenido en nuestra plataforma con el propósito de prestar el servicio.
        </p>

        <h3 className="text-xl font-semibold">Limitación de responsabilidad</h3>
        <p>
          Madryn Empleos es una plataforma de intermediación y no garantiza la veracidad, calidad o resultado de las ofertas publicadas por los usuarios. No nos hacemos responsables por:
        </p>
        <ul className="list-disc pl-6">
          <li>Decisiones laborales o contratos entre empleadores y candidatos.</li>
          <li>Daños indirectos, incidentales o consecuentes derivados del uso del sitio.</li>
          <li>Interrupciones del servicio debido a mantenimiento o fallos técnicos.</li>
        </ul>

        <h3 className="text-xl font-semibold">Terminación del servicio</h3>
        <p>
          Podemos suspender o cancelar tu acceso a la plataforma en cualquier momento, sin previo aviso, si violas estos términos o si lo consideramos necesario para proteger la integridad del sitio o de otros usuarios.
        </p>

        <h3 className="text-xl font-semibold">Ley aplicable</h3>
        <p>
          Estos Términos de Servicio se rigen por las leyes de la República Argentina. Cualquier disputa será sometida a los tribunales competentes de la ciudad de Puerto Madryn, Chubut.
        </p>

        <h3 className="text-xl font-semibold">Contacto</h3>
        <p>
          Si tienes preguntas sobre estos Términos de Servicio, contáctanos en <strong>empleospuertomadryn@gmail.com</strong>.
        </p>
      </section>
    </div>
  );
}