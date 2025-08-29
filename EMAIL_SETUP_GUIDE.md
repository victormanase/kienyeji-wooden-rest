# Email Configuration Guide
## Kienyeji Wooden Rest Website Contact Form

This guide will help you set up email functionality for your website's contact form so that booking inquiries are sent directly to your inbox.

## 🚀 Current Status

✅ **Completed:**
- Contact form with validation
- PHP email handler created
- JavaScript integration with server
- Security measures (rate limiting, input sanitization)
- Auto-reply functionality for guests

❌ **Needs Configuration:**
- Email server settings
- Domain email setup
- Testing and deployment

---

## 📧 Email Configuration Options

### Option 1: Using Your Domain Email (Recommended)

If you have hosting with email support (most hosting providers include this):

1. **Update `send-email.php` lines 26-31:**
```php
$to_email = 'info@kienyejiwoodenrest.com'; // Your actual hotel email
$from_email = 'noreply@kienyejiwoodenrest.com'; // Your domain email
$smtp_host = 'localhost'; // Usually works with most hosting providers
```

2. **Contact your hosting provider to confirm:**
   - Email is enabled for your domain
   - SMTP settings (if different from localhost)
   - Any specific configuration needed

### Option 2: Using Gmail SMTP

If you want to use Gmail to send emails:

1. **Enable 2-Factor Authentication on your Gmail account**
2. **Generate an App Password:**
   - Go to Google Account Settings
   - Security > App passwords
   - Generate password for "Mail"
   - Save this password securely

3. **Update `send-email.php`:**
```php
$to_email = 'your-gmail@gmail.com';
$from_email = 'your-gmail@gmail.com';
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587;
$smtp_username = 'your-gmail@gmail.com';
$smtp_password = 'your-app-password'; // The 16-character app password
```

4. **You'll need to use a PHP mailer library like PHPMailer** (more setup required)

### Option 3: Using Email Services (EmailJS, Formspree, etc.)

For easier setup without server configuration:

1. **EmailJS (Free tier available):**
   - Sign up at emailjs.com
   - Configure email template
   - Update JavaScript to use EmailJS instead of PHP

2. **Formspree (Free tier available):**
   - Sign up at formspree.io
   - Update form action to Formspree endpoint
   - Simpler but less customizable

---

## 🛠 Setup Steps

### Step 1: Choose Your Option
Decide which email configuration works best for your hosting situation.

### Step 2: Update Configuration
Edit the `send-email.php` file with your actual email settings.

### Step 3: Test on Web Server
**Important:** The contact form will only work when hosted on a web server with PHP support. It won't work when testing locally with `python3 -m http.server`.

### Step 4: Upload to Your Web Host
Upload all files to your web hosting service:
- All HTML, CSS, JS files
- The `send-email.php` file
- Images folder

### Step 5: Test Live
Once uploaded, test the contact form on your live website.

---

## 🔧 Required Hosting Features

Your web hosting provider must support:
- ✅ PHP (version 7.4 or higher)
- ✅ Email/SMTP functionality
- ✅ File uploads via FTP/cPanel

Most hosting providers include these features. Popular options:
- **SiteGround** (recommended for small businesses)
- **Bluehost** (popular and affordable)
- **HostGator** (good support)
- **A2 Hosting** (fast performance)

---

## 📋 Testing Checklist

When your website is live, test:

- [ ] Submit form with all required fields
- [ ] Submit form with missing fields (should show error)
- [ ] Submit form with invalid email (should show error)
- [ ] Check if you receive the booking email
- [ ] Check if customer receives auto-reply email
- [ ] Try submitting multiple times (rate limiting should work)

---

## 🚨 Important Security Notes

1. **Remove debug code** from `send-email.php` before going live:
   ```php
   // Remove these lines in production:
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Keep email credentials secure** - never commit them to public repositories

3. **Monitor for spam** - the rate limiting helps but keep an eye on submission volume

---

## 🎨 What Customers Will Experience

1. **Customer fills out booking form**
2. **Form validates all inputs**
3. **Shows "Sending..." loading state**
4. **Success message appears**
5. **Customer receives immediate auto-reply email**
6. **You receive detailed booking inquiry email**

---

## 📧 Email Templates Included

### Hotel Notification Email Features:
- 🎨 Professional HTML styling
- 📋 Complete guest information
- 📅 Booking dates and room preferences
- 📞 Quick action links (call, email, WhatsApp)
- ⏰ Timestamp of submission

### Guest Auto-Reply Email Features:
- 🏡 Branded with your hotel information
- ✅ Confirmation of inquiry receipt
- 📞 All contact methods listed
- ⏱️ 24-hour response promise
- 🌟 Professional and welcoming tone

---

## 🆘 Need Help?

If you encounter issues:

1. **Check PHP error logs** on your hosting control panel
2. **Contact your hosting provider** for SMTP configuration
3. **Test with a simple PHP mail script** first
4. **Consider using EmailJS** for easier setup

---

## 🔄 Alternative: Quick Setup with EmailJS

If the PHP setup seems complex, here's a simpler JavaScript-only option:

1. **Sign up at emailjs.com**
2. **Create email template**
3. **Replace the fetch() call in `script.js`** with EmailJS code

This option requires no server-side PHP but has usage limits on free tier.

---

**Remember:** The contact form is already beautifully designed and fully functional - you just need to configure the email backend to start receiving bookings! 🎉
