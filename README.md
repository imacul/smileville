# SmileVille Portal

Interactive dental review UI built with React, TypeScript, and Three.js.  
It is designed for quick case review with a clinically visible 3D model, patient context, and approve/request-change actions.

## Highlights

- Real-time 3D dental model viewer using `@react-three/fiber` + `@react-three/drei`
- Clinical contrast lighting profile for better tooth separation and visibility
- Branded UI with custom logo + favicon
- Light/Dark UI theme toggle
- Mobile-friendly patient info panel (toggle on small screens)
- Approval action with gentle success animation and check icon

## Tech Stack

- `React 19`
- `TypeScript`
- `Vite 7`
- `Three.js`, `@react-three/fiber`, `@react-three/drei`
- `Tailwind CSS v4`
- `react-icons`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Type-check and build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```text
smileville/
  public/
    dental_mold_3d_scan.glb
    favicon.svg
    smileville-logo.svg
  src/
    components/
      DentalModel.tsx
    App.tsx
    index.css
    main.tsx
```

## Notes

- The 3D model file `public/dental_mold_3d_scan.glb` is large (~62 MB), which may affect clone/push performance.
- For production teams, consider Git LFS for large binary assets.
