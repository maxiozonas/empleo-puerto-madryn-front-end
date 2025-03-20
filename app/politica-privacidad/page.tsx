"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PoliticaPrivacidadPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto min-h-screen py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          onClick={handleBack}
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Volver</span>
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-primary mb-6">Términos y Condiciones</h1>
      <section className="space-y-6 text-gray-700">
        <h2 className="text-2xl font-semibold">Política de Privacidad</h2>
        <p>El sitio web <strong>EmpleosPuertoMadryn</strong> es propiedad de EmpleosPuertoMadryn, que actúa como controlador de tus datos personales.</p>
        <p>Hemos adoptado esta Política de Privacidad, que establece cómo procesamos la información recopilada por EmpleosPuertoMadryn y explica las razones por las cuales necesitamos recopilar ciertos datos personales sobre ti. Por lo tanto, te recomendamos leer esta Política de Privacidad antes de utilizar el sitio web de EmpleosPuertoMadryn.</p>
        <p>Nos tomamos muy en serio la protección de tus datos personales y nos comprometemos a garantizar su confidencialidad y seguridad.</p>

        <h3 className="text-xl font-semibold">Información personal que recopilamos</h3>
        <p>Cuando visitas EmpleosPuertoMadryn, recopilamos automáticamente cierta información sobre tu dispositivo, como datos sobre tu navegador web, dirección IP, zona horaria y algunas de las cookies instaladas en tu equipo. Además, mientras navegas por el sitio, registramos información sobre las páginas individuales que visitas, las ofertas de empleo que consultas, los sitios web o términos de búsqueda que te dirigieron a nuestra plataforma, y cómo interactúas con ella. A esta información recopilada automáticamente la denominamos &quot;Información del dispositivo&quot;. Asimismo, podemos recopilar datos personales que nos proporciones voluntariamente (como nombre, apellido, correo electrónico, información de contacto, etc.) durante el registro, la publicación de una oferta de empleo o el uso de otras funcionalidades, con el fin de cumplir con nuestros servicios.</p>

        <h3 className="text-xl font-semibold">¿Por qué procesamos tus datos?</h3>
        <p>Nuestra principal prioridad es la seguridad de los datos de nuestros usuarios. Por ello, procesamos únicamente los datos mínimos necesarios para mantener y operar el sitio web de manera efectiva. La información recopilada automáticamente se utiliza para identificar posibles casos de abuso y para generar estadísticas sobre el uso de la plataforma. Estas estadísticas no se agrupan de forma que permitan identificar a un usuario específico.</p>
        <p>Puedes visitar nuestro sitio web sin revelar tu identidad ni proporcionar datos que permitan identificarte como individuo. Sin embargo, si deseas utilizar ciertas funcionalidades, como publicar una oferta de empleo, suscribirte a nuestro boletín o contactarnos, podrías proporcionarnos datos personales como tu correo electrónico, nombre, apellido, ciudad de residencia o información de tu empresa. Puedes elegir no compartir tus datos personales, pero esto podría limitar tu acceso a algunas funciones del sitio. Por ejemplo, no podrías publicar avisos ni recibir notificaciones personalizadas. Si tienes dudas sobre qué información es obligatoria, puedes contactarnos en <strong>empleospuertomadryn@gmail.com</strong>.</p>

        <h3 className="text-xl font-semibold">Tus derechos</h3>
        <p>Si resides en Europa, cuentas con los siguientes derechos relacionados con tus datos personales:</p>
        <ul className="list-disc pl-6">
          <li>El derecho a ser informado.</li>
          <li>El derecho de acceso.</li>
          <li>El derecho a la rectificación.</li>
          <li>El derecho a borrar.</li>
          <li>El derecho a restringir el procesamiento.</li>
          <li>El derecho a la portabilidad de datos.</li>
          <li>El derecho a oponerte.</li>
          <li>Derechos relacionados con la toma de decisiones automatizada y la elaboración de perfiles.</li>
        </ul>
        <p>Si deseas ejercer alguno de estos derechos, por favor contáctanos a través de los datos de contacto que se indican más adelante.</p>
        <p>Además, si eres residente europeo, ten en cuenta que procesamos tu información para cumplir con posibles acuerdos contigo (por ejemplo, al registrarte o publicar una oferta en el sitio) o para perseguir nuestros intereses comerciales legítimos, como mejorar la experiencia del usuario y garantizar el funcionamiento de la plataforma. También informamos que tus datos podrían transferirse fuera de Europa, incluyendo a países como Canadá y Estados Unidos, bajo medidas de seguridad adecuadas.</p>

        <h3 className="text-xl font-semibold">Enlaces a otros sitios web</h3>
        <p>Nuestro sitio web puede incluir enlaces a sitios externos que no son de nuestra propiedad ni están bajo nuestro control. No nos responsabilizamos por las prácticas de privacidad ni el contenido de dichos sitios. Te recomendamos que estés atento al salir de nuestra plataforma y que revises las políticas de privacidad de cualquier sitio web que pueda recopilar datos personales.</p>

        <h3 className="text-xl font-semibold">Seguridad de la información</h3>
        <p>Protegemos la información que nos proporcionas almacenándola en servidores seguros y controlados, diseñados para prevenir el acceso, uso o divulgación no autorizados. Implementamos medidas de seguridad administrativas, técnicas y físicas razonables para salvaguardar tus datos personales contra accesos indebidos, modificaciones o divulgaciones. Sin embargo, ninguna transmisión de datos por Internet o redes inalámbricas puede garantizarse como 100% segura.</p>

        <h3 className="text-xl font-semibold">Divulgación legal</h3>
        <p>Divulgaremos la información que recopilemos, usemos o recibamos únicamente si así lo exige o permite la ley, como en cumplimiento de una citación, un proceso legal similar, o cuando consideremos de buena fe que es necesario para proteger nuestros derechos, tu seguridad, la seguridad de otros, investigar fraudes o responder a solicitudes gubernamentales.</p>

        <h3 className="text-xl font-semibold">Información de contacto</h3>
        <p>Si deseas obtener más detalles sobre esta Política de Privacidad, ejercer tus derechos sobre tus datos personales o resolver cualquier duda relacionada, puedes contactarnos enviando un correo electrónico a <strong>empleospmadryn@gmail.com</strong>.</p>
      </section>
    </div>
  );
}