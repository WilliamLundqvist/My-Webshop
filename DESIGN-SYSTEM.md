# E-commerce Design System with Tailwind CSS

This document outlines the design system used in our e-commerce application. The design is intentionally created in black and white to allow for easy customization with your own design language later.

## Design Principles

1. **Minimalist**: Clean, uncluttered interfaces that focus on content and functionality
2. **Responsive**: Adapts seamlessly to different screen sizes and devices
3. **Accessible**: High contrast, clear typography, and intuitive navigation
4. **Consistent**: Uniform patterns and components throughout the application
5. **Scalable**: Easy to extend and customize with your own design language

## Color Palette

The current design uses a grayscale palette that can be easily replaced with your brand colors. These colors are defined in the Tailwind configuration:

```javascript
// tailwind.config.js
colors: {
  primary: '#212121',
  secondary: '#757575',
  accent: '#424242',
  background: '#ffffff',
  surface: '#f5f5f5',
  border: '#e0e0e0',
  'text-primary': '#212121',
  'text-secondary': '#757575',
  'text-tertiary': '#9e9e9e',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#f9a825',
  info: '#1976d2',
}
```

## Typography

The application uses a system font stack for optimal performance and native feel, applied through Tailwind's font-sans utility.

Font sizes follow a consistent scale using Tailwind's text utilities:
- Extra Small: text-xs (0.75rem / 12px)
- Small: text-sm (0.875rem / 14px)
- Base: text-base (1rem / 16px)
- Medium: text-lg (1.125rem / 18px)
- Large: text-xl and text-2xl (1.25rem-1.5rem / 20px-24px)
- Extra Large: text-3xl and text-4xl (1.875rem-2.25rem / 30px-36px)

## Spacing

Consistent spacing values are used throughout the application, defined in the Tailwind configuration:

```javascript
// tailwind.config.js
spacing: {
  'xs': '0.25rem',
  'sm': '0.5rem',
  'md': '1rem',
  'lg': '1.5rem',
  'xl': '2rem',
  'xxl': '3rem',
}
```

These can be used with various utilities like padding (p-*), margin (m-*), gap (gap-*), etc.

## Components

### Layout Components

1. **Container**: Centered content with responsive padding
   ```html
   <div className="container mx-auto px-md">
   ```

2. **Header**: Site branding and navigation
   ```html
   <header className="py-md border-b border-border bg-background">
   ```

3. **Footer**: Site information, links, and copyright
   ```html
   <footer className="py-xl border-t border-border bg-surface mt-xxl">
   ```

### Product Components

1. **ProductCard**: Displays product information in a grid
   - Image container with consistent aspect ratio
   - Product name, price, and brief description
   - Hover effects for better interaction

2. **ProductGrid**: Responsive grid layout for product cards
   ```html
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg w-full">
   ```

3. **ProductDetail**: Comprehensive product information
   - Large product image
   - Product name, price, SKU, and stock status
   - Detailed description
   - Add to cart button and back to products link

### UI Components

1. **Buttons**:
   - Primary: 
     ```html
     <button className="py-md px-lg bg-primary text-white border-none rounded text-base font-medium cursor-pointer transition-colors hover:bg-accent">
     ```
   - Secondary: 
     ```html
     <Link className="py-md px-lg bg-transparent text-primary border border-border rounded text-base font-medium no-underline inline-flex items-center transition-colors hover:bg-surface">
     ```

2. **Breadcrumbs**: Navigation aid showing the current page location
   ```html
   <div className="flex items-center my-md text-sm text-secondary">
   ```

3. **Alerts**: Feedback messages in different states
   - Success: `bg-success/10 text-success border border-success/30`
   - Error: `bg-error/10 text-error border border-error/30`
   - Warning: `bg-warning/10 text-warning border border-warning/30`
   - Info: `bg-info/10 text-info border border-info/30`

## Responsive Breakpoints

The design adapts to different screen sizes using Tailwind's responsive prefixes:
- Small: sm: (640px and up)
- Medium: md: (768px and up)
- Large: lg: (1024px and up)
- Extra Large: xl: (1280px and up)

## Customization

To apply your own design language:

1. Modify the color values in the Tailwind configuration
2. Update the spacing values if needed
3. Adjust the border-radius for more rounded or squared components
4. Modify the shadows for more or less depth
5. Add any additional brand-specific elements

## Accessibility

The design follows accessibility best practices:
- High contrast between text and background
- Sufficient text size for readability
- Clear focus states for keyboard navigation
- Semantic HTML structure
- Alternative text for images

## Future Enhancements

Potential areas for enhancement when applying your design language:
- Custom illustrations or icons
- Animation and transitions
- Advanced interaction patterns
- Brand-specific components
- Dark mode support (easily implemented with Tailwind's dark mode feature) 