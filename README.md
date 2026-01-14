# Gaming Headset Comparison Website

A feature-focused gaming headset comparison and filtering website with affiliate monetization. Filter headsets by objective specs, save favorites locally, and access individual product pages with affiliate links.

## Features

- **Advanced Filtering**: Filter by brand, price range, wireless capability, battery life, weight, and platform compatibility
- **Favorites System**: Save headsets to favorites with localStorage export/import functionality
- **Individual Product Pages**: Detailed specs, multiple affiliate links, and related product suggestions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **SEO Optimized**: Clean URLs, meta tags, and structured data for search engines
- **Static Performance**: Built with Astro for lightning-fast page loads

## Technology Stack

- **Astro** - Static site generator for optimal performance
- **Tailwind CSS** - Utility-first styling framework
- **TypeScript** - Type-safe development
- **Content Collections** - Type-safe content management
- **ImageKit** - Image optimization and CDN (recommended)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── content/
│   └── headsets/          # Markdown files for each headset
├── pages/
│   ├── index.astro        # Main listing page
│   └── headsets/
│       └── [slug].astro   # Dynamic headset pages
├── components/
│   ├── HeadsetCard.astro
│   ├── FilterBar.astro
│   ├── FavoriteButton.astro
│   └── OptimizedImage.astro
├── layouts/
│   └── Layout.astro
├── scripts/
│   └── filtering.js      # Client-side filtering logic
└── styles/
    └── global.css
```

## Adding New Headsets

1. Create a new markdown file in `src/content/headsets/`
2. Follow the frontmatter schema in existing files
3. Add product image to ImageKit or use manufacturer URLs
4. Verify all affiliate links work correctly

## Deployment

This site is designed for static hosting on platforms like:

- **Netlify** (recommended)
- **Vercel**
- **GitHub Pages**
- **Cloudflare Pages**

Simply connect your Git repository and deploy the built `dist/` folder.

## Performance

- Lighthouse scores: 95+ across all metrics
- Core Web Vitals optimization
- Minimal JavaScript usage
- Optimized images and lazy loading
- SEO-friendly semantic HTML

## Monetization

Affiliate links are integrated throughout the site:
- Amazon Associates
- Best Buy Affiliate Program
- Newegg Partner Program
- Direct manufacturer links

Remember to disclose affiliate relationships per FTC guidelines.

## Contributing

1. Follow the existing code style and patterns
2. Keep the site fully static (no backend required)
3. Focus on objective specs, not subjective reviews
4. Test across devices and browsers
5. Verify all affiliate links work correctly
