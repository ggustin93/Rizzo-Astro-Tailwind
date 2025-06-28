# Christine Rizzo - Labor Law Attorney

## Project Overview

Professional website for Christine Rizzo, a labor law attorney specializing in labor law in Brussels. The site serves as an information platform, expertise showcase, and primary contact point for potential and existing clients. Built with modern web technologies for optimal performance, SEO visibility, and ease of maintenance.

## Technology Stack

- **[Astro](https://astro.build/)**: Fast, content-focused web framework with View Transitions
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Decap CMS](https://decapcms.org/)**: Headless CMS for content management
- **[Cal.com](https://cal.com/)**: Integrated appointment booking system
- **Content Schema**: Type-safe content using Astro Content Collections

## Key Features

- **Multilingual**: Complete support for French, English, and Italian with hreflang implementation
- **Responsive Design**: Optimized user experience across all devices
- **Content Management**: Admin interface for easy content updates via flat-file YAML
- **SEO Optimized**: Manual SEO tag management, sitemap generation, and IndexNow submission
- **Performance Focused**: Static site generation with minimal environmental impact
- **Appointment System**: Integrated Cal.com booking functionality

## Project Structure

```text
/
├── public/               # Static files and CMS configuration
│   ├── admin/            # Decap CMS admin interface
│   └── assets/           # Images and resources
├── src/
│   ├── components/       # Reusable UI components
│   ├── layouts/          # Base templates with SEO configuration
│   ├── pages/            # Site routes and pages
│   │   └── [...lang]/    # Multilingual route structure
│   ├── content/          # CMS-managed content (YAML)
│   │   ├── blog/         # Blog articles by language
│   │   ├── config/       # Site configuration
│   │   ├── contact/      # Contact information
│   │   ├── home/         # Homepage content
│   │   └── ui-translations/ # UI text translations
│   ├── utils/            # Helper functions
│   └── styles/           # Global styles
├── scripts/              # Maintenance and testing scripts
├── memory-bank/          # Project documentation
├── astro.config.mjs      # Astro configuration with sitemap
└── netlify.toml          # Netlify configuration with redirects
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run SEO tests
npm run test:seo
```

## Content Management

The admin interface is accessible at `/admin/` and allows management of:

- Page content across all languages
- Blog articles
- Contact information (centralized in site-config.yml)
- SEO metadata and indexing controls
- Media and images

All content is stored in YAML files within the `src/content/` directory, following schemas defined in `src/content/config.ts`.

## Deployment & Infrastructure

- **Hosting**: Netlify with continuous deployment from Git
- **Redirections**: Configured in `netlify.toml` for language handling (root → /fr/)
- **SEO**: Sitemap generation with filtering for specific sections

## Maintenance & Testing

The project includes several maintenance scripts:

- `scripts/run-seo-tests.sh`: Validates critical SEO elements
- `scripts/run-bot-tests.sh`: Tests site behavior with different search engine user-agents
- `scripts/submit_indexnow.sh`: Submits URLs to search engines via IndexNow API

## Troubleshooting

Common issues and solutions:

- **SEO Tag Issues**: Check manual implementation in `src/layouts/BaseLayout.astro`
- **Language Picker**: Ensure script initialization uses `astro:page-load` event
- **Build Errors**: Verify content matches schemas in `src/content/config.ts`

## Contact

For questions or support regarding this website:

**Guillaume Gustin**  
Email: hello@pwablo.be  
Design and development by [Pwablo](https://pwablo.be)