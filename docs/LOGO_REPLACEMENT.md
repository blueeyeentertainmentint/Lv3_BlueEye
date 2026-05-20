# Logo & Icon Replacement Guide

This guide details all files, formats, and resolutions required to completely update the branding (logos, favicons, and social sharing icons) for the **Rentertinment** project, along with instructions on how to use standard emojis as icons.

---

## 1. Asset Inventory & Specifications

| Asset Type | File Path | Format | Recommended Resolution | Description / Usage |
| :--- | :--- | :---: | :---: | :--- |
| **Main Logo (Navbar)** | `public/icon.png`<br>`app/icon.png` | `PNG` | `512x512` px or `1024x1024` px | Main brand logo icon displayed in the navigation header (`components/layout/Navbar.tsx`) and used as the default Next.js metadata icon. |
| **Browser Favicon** | `public/favicon.ico`<br>`app/favicon.ico` | `ICO` | `16x16`, `32x32`, `48x48` px | Multi-resolution legacy favicon package. |
| **Browser Favicon (PNG)** | `public/favicon-16x16.png`<br>`public/favicon-32x32.png` | `PNG` | `16x16` px<br>`32x32` px | Modern browser tab favicons referenced by the web manifest. |
| **Apple Touch Icon** | `public/apple-touch-icon.png`<br>`app/apple-icon.png` | `PNG` | `180x180` px | Home screen icon used when iOS users bookmark the web application. |
| **Android Chrome Icon** | `public/android-chrome-192x192.png`<br>`public/android-chrome-512x512.png` | `PNG` | `192x192` px<br>`512x512` px | Standard Android PWA splash/icon set defined in `public/site.webmanifest`. |
| **Social Sharing (OG)** | `public/og.jpg` | `JPEG`/`PNG` | `1200x630` px | OpenGraph image displayed when sharing the site on platforms like X, WhatsApp, or Facebook. |

---

## 2. Option A: Custom Graphic Logo Replacement
To replace the default branding with your own custom logo assets:
1. Generate your new logo in a high-resolution transparent format (PNG or SVG).
2. Export it to the exact resolutions and names listed above using an image editor or a generator (such as [RealFaviconGenerator](https://realfavicongenerator.net/)).
3. Overwrite the files in their respective folders (`/public` and `/app`).

---

## 3. Option B: Emoji Logo Replacement

If you prefer to use an emoji (e.g., 🧿, 👁️, 🎙️, 🎭) as the website logo and tab bar icon, choose one of these two approaches:

### Method 1: Generate PNGs from Emoji (Recommended)
1. Go to [favicon.io/emoji-favicon-converter](https://favicon.io/emoji-favicon-converter).
2. Choose your preferred emoji and select your background styling (transparent, square, or circle).
3. Download the generated `.zip` package.
4. Extract the files and replace the matches in `/public` and `/app` directories.

### Method 2: Configure Code Directly (No files to prepare)

#### **1. Update the Browser Tab Icon**
Open `app/layout.tsx` and change the metadata icons property to use an inline SVG containing your emoji:
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  // ... rest of metadata
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>",
    apple: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎙️</text></svg>",
  },
};
```

#### **2. Update the Header Logo**
Open `components/layout/Navbar.tsx` and replace the logo image element with a styled emoji container:
```tsx
// components/layout/Navbar.tsx (around lines 64-67)
<Link href="/" className="logo" onClick={closeNav}>
  <div className="logo-icon" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    🎙️
  </div>
  <div className="logo-text">
    {siteConfig.name}
    <span>Premium Artist Booking</span>
  </div>
</Link>
```
