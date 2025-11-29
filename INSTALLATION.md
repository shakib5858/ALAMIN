# Installation Guide

## Quick Start

### Option 1: Static HTML (Immediate Preview)

1. Open `index.html` in your web browser
2. All images and styles are already linked
3. No server required for basic preview

### Option 2: Local Development Server

Using Python (if installed):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then visit: `http://localhost:8000`

Using PHP (if installed):
```bash
php -S localhost:8000
```

Using Node.js (if installed):
```bash
npx http-server
```

### Option 3: WordPress Theme Installation

#### Prerequisites
- WordPress 5.0 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher

#### Installation Steps

1. **Prepare the Theme Folder**
   - Ensure all files are in a folder named `ashhasib`
   - The folder structure should be:
     ```
     ashhasib/
     ├── style.css
     ├── functions.php
     ├── index.html (will become index.php)
     ├── template-parts/
     └── assets/
     ```

2. **Upload to WordPress**
   - Compress the `ashhasib` folder to `ashhasib.zip`
   - Go to WordPress Admin → Appearance → Themes
   - Click "Add New" → "Upload Theme"
   - Choose `ashhasib.zip` and click "Install Now"
   - Click "Activate"

   **OR** via FTP/File Manager:
   - Upload the `ashhasib` folder to `/wp-content/themes/`
   - Go to Appearance → Themes
   - Find "ashhasib" and click "Activate"

3. **Configure the Theme**
   - Go to Appearance → Customize
   - Set your site logo
   - Configure social media links
   - Set up navigation menus
   - Customize colors if needed

4. **Create a Homepage**
   - Go to Pages → Add New
   - Title: "Home"
   - Use the content from `index.html` or use a page builder
   - Publish the page
   - Go to Settings → Reading
   - Set "A static page" and choose "Home"

5. **Set Up Menus**
   - Go to Appearance → Menus
   - Create a new menu called "Primary Menu"
   - Add pages/links
   - Assign to "Primary Menu" location

6. **Add Content**
   - Services: Posts → Add New (or use Custom Post Type "Services")
   - Testimonials: Use Custom Post Type "Testimonials"
   - Replace placeholder images with your actual images

## Converting index.html to WordPress

The theme is already WordPress-ready, but if you need to make changes:

### Convert HTML to PHP Template

1. Rename `index.html` to `index.php` (optional, current setup works)
2. The file already contains WordPress template tags like:
   - `<?php echo home_url(); ?>`
   - `<?php get_template_part('template-parts/header'); ?>`
   - `<?php echo get_template_directory_uri(); ?>`

### Create Additional Templates

For a complete WordPress theme, you may want to add:

- `header.php` - Main header file
- `footer.php` - Main footer file
- `single.php` - Single post template
- `page.php` - Page template
- `archive.php` - Archive template
- `404.php` - 404 error page

## Customization

### Change Colors

Edit `assets/css/style.css`:
```css
:root {
    --primary-color: #FF8C42;    /* Orange */
    --secondary-color: #4CAF50;  /* Green */
    --dark-bg: #2C2C2C;          /* Dark gray */
}
```

### Modify Content

- **Static HTML**: Edit `index.html`
- **WordPress**: Edit through WordPress admin or template files

### Add New Sections

1. Add HTML in `index.html` or create new template parts
2. Add corresponding CSS in `assets/css/style.css`
3. Add JavaScript if needed in `assets/js/main.js`

## Troubleshooting

### Images Not Showing
- Check file paths are correct
- Ensure images exist in `assets/images/`
- Check file permissions (WordPress)

### Styles Not Loading
- Clear browser cache
- Check `assets/css/style.css` exists
- Verify path in HTML/PHP files

### WordPress Theme Not Activating
- Ensure `style.css` has proper theme header
- Check `functions.php` for syntax errors
- Enable WordPress debug mode to see errors

### Contact Form Not Working
- For static HTML: Implement backend (PHP, Node.js, etc.)
- For WordPress: Form already has AJAX handler in `functions.php`
- Configure email settings in WordPress

## Browser Testing

Test in:
- ✓ Chrome (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Edge (latest)
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

1. **Minify CSS/JS** for production
2. **Optimize images** (compress, use WebP)
3. **Enable caching** (WordPress plugins or server config)
4. **Use a CDN** for static assets
5. **Lazy load images** below the fold

## Support

For issues or questions:
1. Check the README.md file
2. Review IMAGES-GUIDE.md for image setup
3. Check WordPress Codex for theme development
4. Review browser console for JavaScript errors

## Next Steps

1. ✓ Install the theme
2. ✓ Replace placeholder images with your actual images
3. ✓ Update text content with your information
4. ✓ Configure contact form email
5. ✓ Set up social media links
6. ✓ Test on mobile devices
7. ✓ Optimize for SEO
8. ✓ Launch!

## File Structure Reference

```
ashhasib/
├── index.html              # Main homepage (static)
├── style.css               # WordPress theme header
├── functions.php           # WordPress functions
├── README.md               # Theme documentation
├── IMAGES-GUIDE.md         # Image documentation
├── INSTALLATION.md         # This file
├── template-parts/
│   ├── header.php         # Header template
│   └── footer.php         # Footer template
├── assets/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── main.js        # JavaScript
│   └── images/            # All images
│       ├── logo.svg
│       ├── hero-person.jpg
│       ├── about-person.jpg
│       ├── website-mockup.png
│       ├── trustpilot-logo.svg
│       ├── companies/     # 6 company logos
│       └── testimonials/  # 3 author photos
└── create-placeholders.html  # Image reference
```

Enjoy your new theme! 🚀
