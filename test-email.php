<?php
/**
 * Simple Email Test Script for Kienyeji Wooden Rest
 * 
 * INSTRUCTIONS:
 * 1. Upload this file to your web server
 * 2. Visit: https://yourwebsite.com/test-email.php
 * 3. Check your email to see if the test message was delivered
 * 4. Delete this file after testing for security
 */

// Email settings - UPDATE WITH YOUR DETAILS
$to_email = 'info@kienyejiwoodenrest.com'; // Your hotel email
$from_email = 'noreply@kienyejiwoodenrest.com'; // Your domain email

// Test email content
$subject = "Email Test - Kienyeji Wooden Rest Website";
$message = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .success { background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>🏡 Email Test Successful!</h2>
        <p>Kienyeji Wooden Rest</p>
    </div>
    
    <div class='content'>
        <div class='success'>
            <h3>✅ Great news!</h3>
            <p>If you're reading this email, your website's email system is working correctly!</p>
        </div>
        
        <p><strong>Test Details:</strong></p>
        <ul>
            <li>Sent from: {$from_email}</li>
            <li>Sent to: {$to_email}</li>
            <li>Date/Time: " . date('Y-m-d H:i:s') . "</li>
            <li>Server: " . $_SERVER['HTTP_HOST'] . "</li>
        </ul>
        
        <p>Your contact form is ready to receive booking inquiries!</p>
        
        <p><strong>Next steps:</strong></p>
        <ol>
            <li>Delete the test-email.php file from your server for security</li>
            <li>Test your contact form on the live website</li>
            <li>Start receiving bookings!</li>
        </ol>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Kienyeji Wooden Rest <{$from_email}>" . "\r\n";

?><!DOCTYPE html>
<html>
<head>
    <title>Email Test - Kienyeji Wooden Rest</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .status { padding: 15px; border-radius: 5px; margin: 20px 0; }
        .success { background-color: #d4edda; color: #155724; }
        .error { background-color: #f8d7da; color: #721c24; }
        .warning { background-color: #fff3cd; color: #856404; }
    </style>
</head>
<body>
    <h1>🏡 Kienyeji Wooden Rest - Email Test</h1>
    
    <?php
    // Attempt to send test email
    $email_sent = mail($to_email, $subject, $message, $headers);
    
    if ($email_sent) {
        echo '<div class="status success">';
        echo '<h3>✅ Email sent successfully!</h3>';
        echo '<p>A test email has been sent to: <strong>' . htmlspecialchars($to_email) . '</strong></p>';
        echo '<p>Please check your email inbox (and spam folder) for the test message.</p>';
        echo '</div>';
        
        echo '<div class="status warning">';
        echo '<h3>🔒 Security Reminder</h3>';
        echo '<p><strong>Important:</strong> Delete this test file (test-email.php) from your server after testing for security reasons.</p>';
        echo '</div>';
    } else {
        echo '<div class="status error">';
        echo '<h3>❌ Email failed to send</h3>';
        echo '<p>The test email could not be sent. This might mean:</p>';
        echo '<ul>';
        echo '<li>Email/SMTP is not configured on your server</li>';
        echo '<li>The email addresses are incorrect</li>';
        echo '<li>Your hosting provider has email restrictions</li>';
        echo '</ul>';
        echo '<p><strong>Next steps:</strong></p>';
        echo '<ul>';
        echo '<li>Contact your hosting provider about email configuration</li>';
        echo '<li>Check the EMAIL_SETUP_GUIDE.md for alternative options</li>';
        echo '<li>Consider using EmailJS for easier setup</li>';
        echo '</ul>';
        echo '</div>';
    }
    ?>
    
    <hr>
    <h3>Server Information:</h3>
    <p><strong>PHP Version:</strong> <?php echo phpversion(); ?></p>
    <p><strong>Server:</strong> <?php echo $_SERVER['HTTP_HOST']; ?></p>
    <p><strong>Email Function Available:</strong> <?php echo function_exists('mail') ? 'Yes ✅' : 'No ❌'; ?></p>
    
    <hr>
    <p><strong>Configuration being tested:</strong></p>
    <ul>
        <li>To: <?php echo htmlspecialchars($to_email); ?></li>
        <li>From: <?php echo htmlspecialchars($from_email); ?></li>
    </ul>
    
    <p><a href="contact.html">← Back to Contact Form</a> | <a href="index.html">← Back to Homepage</a></p>
</body>
</html>
