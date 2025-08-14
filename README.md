# Portfolio & Blog Website with Notion Integration

A modern portfolio and blog website built with Astro, featuring pixel art aesthetics and dynamic content from Notion databases.

## Features

- **Dynamic Content**: All content sourced from Notion databases
- **Pixel Art Design**: Retro 8-bit aesthetics with modern functionality
- **Responsive Design**: Mobile-first approach with accessibility compliance
- **Contact Form**: Integrated email notifications using Nodemailer
- **Categorized Filtering**: Dynamic filtering for projects, certificates, and blogs
- **Performance Optimized**: Lazy loading and Astro islands architecture

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. **Notion Setup**
   - Create a Notion integration at https://developers.notion.com
   - Create databases for Projects, Blogs, and Certificates
   - Create an About page in Notion
   - Share your databases and page with your integration

4. **Email Setup**
   - Use Gmail with App Password for email functionality
   - Configure EMAIL_USER, EMAIL_PASS, and OWNER_EMAIL in .env

## Database Schema

### Projects Database
- Title (Title)
- Description (Rich Text)
- Category (Select)
- Technologies (Multi-select)
- URL (URL)
- GitHub (URL) 
- Demo (URL)
- Image (Files)
- Date (Date)
- Featured (Checkbox)

### Blog Database
- Title (Title)
- Excerpt (Rich Text)
- Category (Select)
- Tags (Multi-select)
- Image (Files)
- Date (Date)
- Featured (Checkbox)

### Certificates Database
- Title (Title)
- Description (Rich Text)
- Category (Select)
- Issuer (Rich Text)
- CredentialId (Rich Text)
- Level (Select)
- Image (Files)
- Date (Date)
- URL (URL)

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The site supports hybrid rendering and can be deployed to platforms like Vercel, Netlify, or any Node.js hosting provider.

For automatic updates from Notion:
- Set up webhooks or scheduled rebuilds
- Use GitHub Actions for automated deployments
- Configure your hosting platform to rebuild on content changes

## Accessibility

The site follows WCAG guidelines including:
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- High contrast ratios
- Alt text for images
- Screen reader compatibility

## Customization

- Update colors in `tailwind.config.mjs`
- Modify fonts and spacing using the pixel-based system
- Add new pages by creating `.astro` files in `src/pages`
- Extend Notion integration in `src/lib/notion.ts`