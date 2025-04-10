# Christine Rizzo - Labor Law Attorney

## Project Overview

Professional website for Christine Rizzo, a labor law attorney based in Brussels. Built with modern web technologies for optimal performance and ease of maintenance.

## Technology Stack

- **[Astro](https://astro.build/)**: Fast, content-focused web framework
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Decap CMS](https://decapcms.org/)**: Headless CMS for content management
- **[Cal.com](https://cal.com/)**: Integrated appointment booking system

## Key Features

- **Multilingual**: Complete support for French, English, and Italian
- **Responsive Design**: Optimal user experience on all devices
- **Content Management**: Admin interface for easy content updates
- **SEO Optimized**: Structured for search engine visibility
- **Eco-designed**: Focused on minimal environmental impact
- **Appointment System**: Integrated Cal.com booking functionality

## Project Structure

```text
/
├── public/               # Static files and CMS configuration
│   ├── admin/            # Decap CMS admin interface
│   └── assets/           # Images and resources
├── src/
│   ├── components/       # Reusable components
│   ├── layouts/          # Base templates
│   ├── pages/            # Site routes and pages
│   │   └── [lang]/       # Multilingual structure
│   ├── content/          # CMS-managed content
│   │   ├── blog/         # Blog articles by language
│   │   ├── config/       # Site configuration
│   │   └── home/         # Homepage content
│   └── styles/           # Global styles
├── astro.config.mjs      # Astro configuration
└── tailwind.config.js    # Tailwind CSS configuration
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
```

## Content Management

The admin interface is accessible at `/admin/` and allows management of:

- Blog articles
- Page content
- Multilingual settings
- SEO metadata
- Media and images

## Deployment

The site is automatically deployed on Netlify when changes are pushed to the main repository branch.

## Security

CMS access is secured by Netlify Identity, providing authentication and user management for the admin interface.

## Contact

For questions or support regarding this website:

**Guillaume Gustin**  
Email: hello@pwablo.be
Design and development by [Pwablo](https://pwablo.be)