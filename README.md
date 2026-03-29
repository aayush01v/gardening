# GreenScape Lawn & Garden - Landing Page

A complete, responsive single-page website for a fictional landscaping company.

## Features

- Fully responsive design (mobile, tablet, desktop)
- Modern, clean layout with professional color scheme
- Hero section with call-to-action
- About Us section with company information
- Services showcase with 4 service offerings
- Customer testimonials
- Working contact form with validation
- Smooth scrolling navigation
- Mobile-friendly hamburger menu

## Color Palette

- Forest Green: `#2D5016` (Primary)
- Fresh Green: `#6B9F3E` (Accent)
- Earth Brown: `#8B6F47` (Secondary)
- Cream White: `#F9F7F4` (Background)
- Charcoal: `#333333` (Text)

## Typography

- Headings: Montserrat (Google Fonts)
- Body: Open Sans (Google Fonts)

## Quick Start

1. Open `index.html` in your browser
2. No build process required - pure HTML/CSS/JS
3. All dependencies loaded via CDN (Google Fonts)

## Customization

### Update Contact Information
Edit the contact section in `index.html`:
- Phone number
- Email address
- Physical address
- Business hours

### Change Colors
Modify CSS variables in `styles.css`:
```css
:root {
    --forest-green: #2D5016;
    --fresh-green: #6B9F3E;
    /* ... */
}
```

### Form Backend
The form currently logs to console. To connect to a backend:
1. Uncomment the fetch code in `script.js`
2. Replace `/api/contact` with your endpoint
3. Configure your backend to handle form submissions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## License

Free to use for educational and commercial purposes.
