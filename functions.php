<?php
/**
 * Theme Functions
 */

// Theme Setup
function ashhasib_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    
    // Register Navigation Menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'ashhasib'),
        'footer' => __('Footer Menu', 'ashhasib'),
    ));
}
add_action('after_setup_theme', 'ashhasib_theme_setup');

// Enqueue Styles and Scripts
function ashhasib_enqueue_assets() {
    // Styles
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
    wp_enqueue_style('ashhasib-style', get_template_directory_uri() . '/assets/css/style.css', array(), '1.0');
    
    // Scripts
    wp_enqueue_script('ashhasib-main', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'ashhasib_enqueue_assets');

// Register Widget Areas
function ashhasib_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget 1', 'ashhasib'),
        'id'            => 'footer-1',
        'description'   => __('Add widgets here to appear in your footer.', 'ashhasib'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Widget 2', 'ashhasib'),
        'id'            => 'footer-2',
        'description'   => __('Add widgets here to appear in your footer.', 'ashhasib'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'ashhasib_widgets_init');

// Custom Post Types (if needed)
function ashhasib_custom_post_types() {
    // Services Post Type
    register_post_type('services', array(
        'labels' => array(
            'name' => __('Services', 'ashhasib'),
            'singular_name' => __('Service', 'ashhasib'),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-admin-tools',
    ));
    
    // Testimonials Post Type
    register_post_type('testimonials', array(
        'labels' => array(
            'name' => __('Testimonials', 'ashhasib'),
            'singular_name' => __('Testimonial', 'ashhasib'),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-format-quote',
    ));
}
add_action('init', 'ashhasib_custom_post_types');

// AJAX Contact Form Handler
function ashhasib_contact_form_handler() {
    check_ajax_referer('contact_form_nonce', 'nonce');
    
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $phone = sanitize_text_field($_POST['phone']);
    $message = sanitize_textarea_field($_POST['message']);
    
    // Send email
    $to = get_option('admin_email');
    $subject = 'New Contact Form Submission';
    $body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage: $message";
    $headers = array('Content-Type: text/plain; charset=UTF-8');
    
    if (wp_mail($to, $subject, $body, $headers)) {
        wp_send_json_success('Message sent successfully!');
    } else {
        wp_send_json_error('Failed to send message.');
    }
}
add_action('wp_ajax_contact_form', 'ashhasib_contact_form_handler');
add_action('wp_ajax_nopriv_contact_form', 'ashhasib_contact_form_handler');

// Customizer Settings
function ashhasib_customize_register($wp_customize) {
    // Add Social Media Section
    $wp_customize->add_section('ashhasib_social', array(
        'title' => __('Social Media Links', 'ashhasib'),
        'priority' => 30,
    ));
    
    // Facebook
    $wp_customize->add_setting('facebook_url');
    $wp_customize->add_control('facebook_url', array(
        'label' => __('Facebook URL', 'ashhasib'),
        'section' => 'ashhasib_social',
        'type' => 'url',
    ));
    
    // Twitter
    $wp_customize->add_setting('twitter_url');
    $wp_customize->add_control('twitter_url', array(
        'label' => __('Twitter URL', 'ashhasib'),
        'section' => 'ashhasib_social',
        'type' => 'url',
    ));
    
    // LinkedIn
    $wp_customize->add_setting('linkedin_url');
    $wp_customize->add_control('linkedin_url', array(
        'label' => __('LinkedIn URL', 'ashhasib'),
        'section' => 'ashhasib_social',
        'type' => 'url',
    ));
}
add_action('customize_register', 'ashhasib_customize_register');
