# Melting Bites — sitio web estático

Sitio web mobile-first, responsivo y listo para publicar. No requiere build ni dependencias de JavaScript.

## Estructura

```txt
melting-bites-web/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   ├── chocolate-candle.svg
│   ├── favicon.svg
│   ├── flavor-coffee.svg
│   ├── flavor-dark.svg
│   ├── flavor-milk.svg
│   ├── flavor-white.svg
│   ├── logo.svg
│   └── og-image.svg
└── README.md
```

## Publicación rápida

1. Sube todos los archivos de esta carpeta a Netlify, Vercel, GitHub Pages, Hostinger o cualquier hosting estático.
2. En `index.html`, cambia el canonical `https://meltingbites.mx/` por el dominio real.
3. En `js/app.js`, reemplaza `5210000000000` por el WhatsApp real en formato internacional.
4. En `index.html`, reemplaza el enlace de Instagram por el perfil real.
5. Opcional: cambia `assets/og-image.svg` por una foto real del producto cuando ya exista material fotográfico profesional.

## Notas de producción

- Incluye SEO base, Open Graph, Twitter Card y Schema.org.
- Las animaciones respetan `prefers-reduced-motion`.
- Todos los assets visuales son SVG locales para evitar enlaces rotos.
- El formulario genera un mensaje listo para WhatsApp; no necesita backend.
