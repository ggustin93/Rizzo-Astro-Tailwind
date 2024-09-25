
# Christine Rizzo Website - Astro Project

## 🚀 Project Overview

This project is a custom-built website for Christine Rizzo, utilizing modern web technologies for optimal performance and ease of maintenance.

## 🛠 Tech Stack

- **Astro**: Fast, content-focused web framework
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Decap CMS**: Headless CMS for easy content management


## 🔧 Development Commands

- `npm install`: Install dependencies
- `npm run dev`: Start local development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

## 📝 Content Management

Content can be managed via Decap CMS at `yoursite.com/admin`.

## 🚀 Deployment

The site is automatically deployed on Netlify upon pushes to the main GitHub repository branch.

## 💬 Support and Maintenance

For any questions, support needs, or maintenance requests, please contact:

Guillaume Gustin
Email: guillaume.gustin.9@gmail.com
## 🛠️ Project Structure

```text
/
├── public/
│   ├── admin/
│   │   └── config.yml
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── PostCard.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [lang]/
│   │   │   ├── index.astro
│   │   │   └── blog/
│   │   │       └── [slug].astro
│   │   └── blog/
│   │       └── [slug].astro
│   ├── styles/
│   │   └── global.css
│   └── content/
│       └── posts/
│           ├── en/
│           │   ├── post1.md
│           │   └── post2.md
│           └── fr/
│               ├── post1.md
│               └── post2.md
├── tailwind.config.js
├── astro.config.mjs
├── package.json
└── netlify.toml
```

This structure reflects:
- Multilanguage setup with `[lang]` dynamic routes
- Content organization for different languages
- Decap CMS configuration in `public/admin/`
- Blog post handling with dynamic `[slug]` routes
- Tailwind CSS and Astro configurations

The project uses Astro's file-based routing and content collections for efficient multilingual content management and blog post handling. Decap CMS is integrated for easy content updates, while Tailwind CSS is used for styling.

For any questions or support needs regarding this structure or the project in general, please contact:

Guillaume Gustin
Email: guillaume.gustin.9@gmail.com