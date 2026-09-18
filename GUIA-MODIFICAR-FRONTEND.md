# 🛠️ Guía Rápida: Cómo Modificar el Frontend de ArmaPC

¡Bienvenido! Hemos organizado el código del frontend para que **no tengas que buscar entre miles de líneas de código** para hacer cambios comunes.

La mayoría de textos, menús, redes sociales, correos y anuncios ahora se editan desde archivos de configuración limpios en la carpeta **[`src/config/`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/config/)**.

---

## ⚡ Paso 1: Ver tus cambios en vivo en tu pantalla

1. Abre una terminal en la carpeta del proyecto y ejecuta:
   ```bash
   npm run dev
   ```
2. Abre tu navegador en:
   - 👉 Español: **`http://localhost:3000/es`**
   - 👉 Inglés: **`http://localhost:3000`**
3. **Cada vez que guardes un archivo (`Ctrl + S`), la página se actualizará sola al instante.**

---

## 🧭 Paso 2: ¿Qué quieres cambiar? (Mapa de Modificaciones)

### 1. Cambiar Correo, Redes Sociales, Anuncio Superior o Menú
📁 **Archivo:** [`src/config/siteConfig.ts`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/config/siteConfig.ts)

* **Activar o cambiar el Anuncio Superior (Top Banner):**
  Busca la sección `announcement`. Puedes cambiar el texto o desactivarlo poniendo `enabled: false`:
  ```ts
  announcement: {
    enabled: true, // Cambia a false para ocultarlo
    badge: { es: "ACTUALIZADO 2026", en: "UPDATED 2026" },
    text: {
      es: "Auditoría de precios en vivo para CPU, Placas, RAM y GPU",
      en: "Live market prices & compatibility audit for CPU, Motherboards, RAM and GPU",
    },
    linkRutaKey: "configurador",
    linkText: { es: "Abrir Configurador →", en: "Open Configurator →" },
  },
  ```

* **Cambiar el Correo de Soporte:**
  Busca la sección `contact` y cambia el email:
  ```ts
  contact: {
    email: "tu-nuevo-correo@dominio.com",
  },
  ```
  *(Al cambiarlo aquí, se actualiza automáticamente en el pie de página, en contacto, en privacidad y en términos).*

* **Activar tus Redes Sociales (Discord, YouTube, X, Instagram):**
  Busca la sección `socialLinks`. Pon tu enlace y cambia `enabled: true`:
  ```ts
  {
    id: "discord",
    name: "Discord",
    url: "https://discord.gg/tu-servidor",
    enabled: true, // ¡Ahora aparecerá en el pie de página!
  },
  ```

* **Modificar o Agregar Enlaces en el Menú Superior:**
  Busca la sección `navigation` y ajusta el orden o las etiquetas en español e inglés.

---

### 2. Modificar la Página "Sobre Nosotros"
📁 **Archivo:** [`src/config/aboutConfig.ts`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/config/aboutConfig.ts)

* **Cifras destacadas:** Puedes cambiar los números de las tarjetas superiores (ej. "329 Componentes", "44 Presupuestos", etc.).
* **Pilares y Misión:** Modifica los 4 pilares educativos y el manifiesto editorial sin tocar etiquetas HTML.

---

### 3. Modificar la Página de "Contacto"
📁 **Archivo:** [`src/config/contactConfig.ts`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/config/contactConfig.ts)

* **Motivos de consulta:** Puedes agregar, quitar o cambiar las opciones del selector desplegable del formulario en la lista `topics`.
* **Tiempos de atención:** Modifica el mensaje de horarios y tiempo de respuesta estimado.

---

### 4. Modificar Vistas Específicas del Sitio
Si deseas modificar el diseño visual o agregar nuevas secciones completas:

| Sección | Archivo a Editar |
|---|---|
| **Cabecera y Navegación** | [`src/components/SiteHeader.tsx`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/components/SiteHeader.tsx) |
| **Pie de Página (Footer)** | [`src/components/SiteFooter.tsx`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/components/SiteFooter.tsx) |
| **Portada (Guías)** | [`src/components/GuiasView.tsx`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/components/GuiasView.tsx) |
| **Mesa Interactiva 3D/Capas** | [`src/components/InteractiveDeskScene.tsx`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/components/InteractiveDeskScene.tsx) |
| **Configurador de PC** | [`src/components/vistas/ConfiguradorVista.tsx`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/components/vistas/ConfiguradorVista.tsx) |
| **Presupuestos Recomendados** | [`src/components/vistas/PresupuestosVista.tsx`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/components/vistas/PresupuestosVista.tsx) |
| **Setup Completo** | [`src/components/vistas/SetupVista.tsx`](file:///c:/Users/USUARIO/Desktop/Primera%20Pagina%20Web/src/components/vistas/SetupVista.tsx) |

---

## 🌐 Regla de Oro: Textos Bilingües (EN / ES)

Dado que ArmaPC atiende tanto al público hispanohablante como al anglosajón en EE.UU., siempre que escribas textos utiliza el formato bilingüe:
```ts
// En archivos de configuración:
{
  es: "Texto en español",
  en: "Text in English"
}

// En componentes .tsx:
tr("Texto en español", "Text in English")
```

---

## 🔒 Paso 3: Verificar antes de publicar

Antes de subir tus cambios a producción, abre la terminal y escribe:
```bash
npx tsc --noEmit
```
Si termina sin errores en pantalla, significa que todo está perfecto y puedes guardar en Git:
```bash
git add .
git commit -m "feat: actualizar textos y redes en el frontend"
git push origin main
```
