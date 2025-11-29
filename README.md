# ashhasib WordPress Theme

A modern, responsive WordPress theme for digital marketing agencies based on ashhasib.com.

## Features

- Fully responsive design
- WordPress-ready structure
- Custom post types for Services and Testimonials
- Contact form with AJAX submission
- Newsletter subscription
- Social media integration
- Customizer options
- SEO-friendly markup
- Fast loading and optimized

## Installation

### For Static HTML Version:
1. Open `index.html` in your browser
2. All assets are organized in the `assets` folder

### For WordPress Theme:
1. Upload the theme folder to `/wp-content/themes/`
2. Activate the theme in WordPress Admin > Appearance > Themes
3. Configure theme settings in Appearance > Customize
4. Add your logo in Appearance > Customize > Site Identity
5. Set up menus in Appearance > Menus

## File Structure

```
ashhasib/
├── index.html              # Static HTML homepage
├── style.css               # WordPress theme stylesheet (required)
├── functions.php           # WordPress theme functions
├── template-parts/         # Reusable template parts
│   ├── header.php         # Header template
│   └── footer.php         # Footer template
├── assets/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── main.js        # JavaScript functionality
│   └── images/            # Image assets (add your images here)
│       ├── logo.png
│       ├── hero-person.jpg
│       ├── about-person.jpg
│       ├── website-mockup.png
│       ├── companies/     # Company logos
│       └── testimonials/  # Testimonial images
└── README.md              # This file
```

## Converting to WordPress

The theme is already structured for WordPress conversion:

1. The `index.html` contains PHP template tags for WordPress
2. `functions.php` includes all necessary WordPress functionality
3. `template-parts/` folder contains modular header and footer
4. Custom post types are registered for Services and Testimonials

## Customization

### Colors
Edit CSS variables in `assets/css/style.css`:
```css
:root {
    --primary-color: #FF8C42;
    --secondary-color: #4CAF50;
    --dark-bg: #2C2C2C;
}
```

### Content
- Update text content in `index.html`
- Add images to `assets/images/` folder
- Modify sections as needed

### WordPress Customizer
Access Appearance > Customize to modify:
- Site logo
- Social media links
- Colors and fonts
- Menus

## Required Images

Add these images to the `assets/images/` folder:
- `logo.png` - Site logo
- `hero-person.jpg` - Hero section image
- `about-person.jpg` - About section image
- `website-mockup.png` - Website showcase
- `trustpilot-logo.png` - Trustpilot badge
- Company logos in `companies/` folder
- Testimonial photos in `testimonials/` folder

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Credits

- Font Awesome for icons
- Design inspired by ashhasib.com

## License

This theme is licensed under the GNU General Public License v2 or later.
