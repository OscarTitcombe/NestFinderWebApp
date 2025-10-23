# NestFinder Web App

A reverse property marketplace landing page built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Postcode Validation**: UK postcode normalization and validation
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Modern UI**: Clean, professional design with custom color scheme
- **TypeScript**: Full type safety throughout the application

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx      # Marketing layout with Navbar/Footer
│   │   └── page.tsx        # Landing page
│   ├── market/
│   │   └── page.tsx        # Market overview page
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/
│   ├── Navbar.tsx          # Navigation component
│   ├── Footer.tsx          # Footer component
│   ├── Hero.tsx            # Hero section
│   ├── PostcodeSearch.tsx  # Postcode search form
│   ├── TrustStrip.tsx      # Trust indicators
│   ├── FeatureGrid.tsx     # Feature cards
│   ├── HowItWorks.tsx      # How it works section
│   └── CTASection.tsx      # Call-to-action section
└── lib/
    └── postcode.ts         # Postcode validation utility
```

## Features

### Postcode Validation
- Accepts UK postcodes in various formats (SW1A, E3, BS8, etc.)
- Normalizes input to district codes
- Client-side validation with error handling
- Routes to `/market?postcode=<district>` on successful validation

### Components
- **Hero**: Main landing section with postcode search
- **TrustStrip**: Trust indicators with icons
- **FeatureGrid**: Four feature cards explaining the platform
- **HowItWorks**: Three-step process explanation
- **CTASection**: Final call-to-action with postcode search

### Accessibility
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Error state handling

## Styling

The app uses a custom color scheme:
- Primary: #1A6AFF (blue)
- Accent: #00B894 (green)
- Dark: #101314 (text)
- Light: #F7F9FC (background)

All components use Tailwind CSS utility classes with custom component classes defined in `globals.css`.

## Development

The project uses:
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons
- Client-side routing for navigation

## Build

```bash
npm run build
```

## License

This project is for demonstration purposes.

