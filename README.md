# Madryn Empleos - Documentación Interna

## 📋 Descripción del Proyecto

Madryn Empleos es una plataforma digital desarrollada para conectar a empleadores y buscadores de empleo en Puerto Madryn, Chubut. El objetivo principal es centralizar las ofertas laborales de la ciudad en un único portal, facilitando tanto la búsqueda de empleo como la publicación de nuevas oportunidades laborales.

## 🏗️ Estructura del Proyecto

### Directorios Principales

- `/app`: Contiene las páginas y rutas de la aplicación (Next.js App Router)
- `/components`: Componentes reutilizables organizados por funcionalidad
- `/lib`: Utilidades, hooks, tipos y funciones auxiliares
- `/public`: Archivos estáticos como imágenes y logos
- `/styles`: Estilos globales y configuraciones de Tailwind CSS

### Páginas Principales

- `/`: Página de inicio con secciones destacadas
- `/avisos`: Listado de ofertas laborales disponibles
- `/detalles-empleo/[slug]`: Detalles de una oferta específica
- `/categorias`: Exploración de empleos por categoría
- `/nuevo-aviso`: Formulario para publicar nuevos avisos
- `/mis-avisos`: Gestión de avisos publicados por el usuario
- `/admin`: Panel de administración (acceso restringido)

## 💻 Stack Tecnológico

- **Framework**: Next.js 15 con TypeScript y App Router
- **Autenticación**: NextAuth.js con integración de Google
- **UI/UX**: 
  - Tailwind CSS para estilos
  - Componentes de Radix UI (Dialog, Dropdown, etc.)
  - Lucide React y React Icons para iconografía
- **Estado y Datos**:
  - React Query para gestión de estado y peticiones
  - React Hook Form para formularios
  - Zod para validación de datos
- **Contenido**: 
  - Tiptap para edición de texto enriquecido
  - React Dropzone para carga de imágenes

## ⚙️ Configuración y Variables de Entorno

El proyecto requiere las siguientes variables de entorno en un archivo `.env`:

```
NEXT_PUBLIC_API_URL=<URL_del_backend>
NEXTAUTH_URL=<URL_de_la_aplicación>
NEXTAUTH_SECRET=<Secreto_para_NextAuth>
GOOGLE_CLIENT_ID=<ID_de_cliente_de_Google>
GOOGLE_CLIENT_SECRET=<Secreto_de_cliente_de_Google>
NEXT_PUBLIC_ADMIN_EMAILS=<emails_de_administradores>
```

## 🔄 Flujos Principales

### Publicación de Avisos

1. Usuario inicia sesión con Google
2. Accede a "Publicar aviso"
3. Completa formulario con detalles del empleo
4. El aviso queda pendiente de aprobación por administradores
5. Una vez aprobado, aparece en el listado público

### Administración

- Los usuarios con email en `NEXT_PUBLIC_ADMIN_EMAILS` tienen acceso al panel de administración
- Pueden aprobar/rechazar avisos, editar categorías y gestionar contenido

## 🚀 Comandos Útiles

```bash
# Desarrollo local
pnpm dev

# Construir para producción
pnpm build

# Iniciar versión de producción
pnpm start

# Verificar errores de linting
pnpm lint
```

## 📱 Diseño Responsivo

La aplicación está optimizada para:
- Dispositivos móviles (< 768px)
- Tablets (768px - 1024px)
- Escritorio (> 1024px)

Se utilizan clases de Tailwind como `md:` y `lg:` para adaptar la interfaz.

## 🔍 SEO y Metadatos

Los metadatos están configurados en `app/layout.tsx` con optimizaciones para:
- Títulos y descripciones relevantes
- Open Graph para compartir en redes sociales
- Palabras clave relacionadas con empleo en Puerto Madryn

## 📊 Analítica

Se utiliza Google Analytics (G-58EP2GP6X3) para seguimiento de usuarios y comportamiento.

## 🧠 Notas para Desarrollo Futuro

- Considerar implementar sistema de notificaciones por email
- Mejorar filtros de búsqueda avanzada
- Añadir funcionalidad de CV/perfil para postulantes
- Optimizar carga de imágenes y logos de empresas

---

**Desarrollado por:**
- Maximo Ozonas
- Juan Ignacio Rodriguez Mariani
