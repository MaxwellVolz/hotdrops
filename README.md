# hotdrops

3D product showcase with dynamic day/night cycles and post-processing effects.

## Tech Stack

- **Next.js 15** (Turbopack) - React framework
- **React Three Fiber** - Three.js renderer for React
- **Three.js** - 3D graphics
- **React Three Drei** - 3D helpers (OrbitControls, Environment)
- **React Three Postprocessing** - Visual effects (DoF, Bloom, Vignette)
- **Tailwind CSS 4** - Styling
- **Stripe** - Payment processing
- **TypeScript** - Type safety

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # React components
│   ├── Scene3D.tsx       # Main 3D scene with lighting
│   ├── NorthBeachModel.tsx
│   ├── CTABox.tsx
│   └── LoadingSpinner.tsx
├── lib/              # Stripe integration
└── types/            # TypeScript definitions

public/
└── 3d/               # GLB models
```

## Scripts

- `npm run dev` - Dev server with Turbopack
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Stripe Integration

### Test locally with **Stripe CLI**

1. 