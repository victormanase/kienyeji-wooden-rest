<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS (if needed) and JSON response
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Email configuration - UPDATE THESE SETTINGS
$to_email = 'info@kienyejiwoodenrest.com'; // Your hotel email
$from_email = 'noreply@kienyejiwoodenrest.com'; // Your domain email
$smtp_host = 'localhost'; // Your SMTP host (update as needed)
$smtp_port = 587; // SMTP port
$smtp_username = ''; // SMTP username (if required)
$smtp_password = ''; // SMTP password (if required)

// Security: Simple rate limiting (basic protection)
session_start();
$max_submissions = 5; // Max submissions per hour
$time_window = 3600; // 1 hour in seconds

if (!isset($_SESSION['submissions'])) {
    $_SESSION['submissions'] = [];
}

// Clean old submissions
$current_time = time();
$_SESSION['submissions'] = array_filter($_SESSION['submissions'], function($timestamp) use ($current_time, $time_window) {
    return ($current_time - $timestamp) < $time_window;
});

// Check rate limit
if (count($_SESSION['submissions']) >= $max_submissions) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many submissions. Please try again later.']);
    exit();
}

// Get and validate form data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$country = trim($_POST['country'] ?? '');
$checkin = trim($_POST['checkin'] ?? '');
$checkout = trim($_POST['checkout'] ?? '');
$room_type = trim($_POST['room-type'] ?? '');
$guests = trim($_POST['guests'] ?? '');
$special_requests = trim($_POST['special-requests'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validate required fields
if (empty($name) || empty($email) || empty($phone) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$country = htmlspecialchars($country, ENT_QUOTES, 'UTF-8');
$room_type = htmlspecialchars($room_type, ENT_QUOTES, 'UTF-8');
$guests = htmlspecialchars($guests, ENT_QUOTES, 'UTF-8');
$special_requests = htmlspecialchars($special_requests, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Format room type for display
$room_types = [
    'deluxe' => 'Deluxe Room',
    'standard' => 'Standard Room',
    'twin' => 'Twin Bed Room',
    'full-villa' => 'Full Villa Rental'
];
$room_display = $room_types[$room_type] ?? $room_type;

// Create email subject and body
$subject = "New Booking Inquiry - Kienyeji Wooden Rest";

$email_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .booking-details { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #8B4513; margin: 15px 0; }
        .label { font-weight: bold; color: #8B4513; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>🏡 New Booking Inquiry</h2>
        <p>Kienyeji Wooden Rest</p>
    </div>
    
    <div class='content'>
        <h3>Guest Information:</h3>
        <div class='booking-details'>
            <p><span class='label'>Name:</span> {$name}</p>
            <p><span class='label'>Email:</span> {$email}</p>
            <p><span class='label'>Phone:</span> {$phone}</p>
            " . (!empty($country) ? "<p><span class='label'>Country:</span> {$country}</p>" : "") . "
        </div>
        
        <h3>Booking Details:</h3>
        <div class='booking-details'>
            " . (!empty($checkin) ? "<p><span class='label'>Check-in:</span> {$checkin}</p>" : "") . "
            " . (!empty($checkout) ? "<p><span class='label'>Check-out:</span> {$checkout}</p>" : "") . "
            " . (!empty($room_type) ? "<p><span class='label'>Room Type:</span> {$room_display}</p>" : "") . "
            " . (!empty($guests) ? "<p><span class='label'>Guests:</span> {$guests}</p>" : "") . "
        </div>
        
        <h3>Message:</h3>
        <div class='booking-details'>
            <p>{$message}</p>
        </div>
        
        " . (!empty($special_requests) ? "
        <h3>Special Requests:</h3>
        <div class='booking-details'>
            <p>{$special_requests}</p>
        </div>
        " : "") . "
        
        <h3>Quick Actions:</h3>
        <p>
            📞 Call: <a href='tel:{$phone}'>{$phone}</a><br>
            📧 Reply: <a href='mailto:{$email}'>{$email}</a><br>
            💬 WhatsApp: <a href='https://wa.me/{$phone}'>Message on WhatsApp</a>
        </p>
    </div>
    
    <div class='footer'>
        <p>This inquiry was submitted through the Kienyeji Wooden Rest website on " . date('Y-m-d H:i:s') . "</p>
        <p>Please respond within 24 hours as promised to guests.</p>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Kienyeji Wooden Rest <{$from_email}>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Auto-reply email to guest
$auto_reply_subject = "Thank you for your inquiry - Kienyeji Wooden Rest";
$auto_reply_body = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #8B4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .highlight { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #8B4513; margin: 15px 0; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>🏡 Thank You for Your Inquiry!</h2>
        <p>Kienyeji Wooden Rest - Your Wooden Escape in Arusha</p>
    </div>
    
    <div class='content'>
        <h3>Dear {$name},</h3>
        
        <p>Thank you for your interest in staying at Kienyeji Wooden Rest! We have received your booking inquiry and will respond within 24 hours.</p>
        
        <div class='highlight'>
            <h4>Your Inquiry Summary:</h4>
            " . (!empty($checkin) ? "<p><strong>Check-in:</strong> {$checkin}</p>" : "") . "
            " . (!empty($checkout) ? "<p><strong>Check-out:</strong> {$checkout}</p>" : "") . "
            " . (!empty($room_type) ? "<p><strong>Room Type:</strong> {$room_display}</p>" : "") . "
            " . (!empty($guests) ? "<p><strong>Guests:</strong> {$guests}</p>" : "") . "
        </div>
        
        <p>In the meantime, feel free to reach out to us directly:</p>
        <ul>
            <li>📞 Phone: +255 757 618 619</li>
            <li>💬 WhatsApp: <a href='https://wa.me/255757618619'>+255 757 618 619</a></li>
            <li>📧 Email: info@kienyejiwoodenrest.com</li>
        </ul>
        
        <p>We look forward to hosting you at our beautiful wooden villa in Arusha!</p>
        
        <p>Best regards,<br>
        The Kienyeji Wooden Rest Team</p>
    </div>
    
    <div class='footer'>
        <p>Kienyeji Wooden Rest | Arusha, Tanzania | +255 757 618 619</p>
        <p>Your gateway to Serengeti, Ngorongoro Crater, and Mount Kilimanjaro</p>
    </div>
</body>
</html>
";

$auto_reply_headers = "MIME-Version: 1.0" . "\r\n";
$auto_reply_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$auto_reply_headers .= "From: Kienyeji Wooden Rest <{$from_email}>" . "\r\n";

// Send emails
$email_sent = false;
$auto_reply_sent = false;

try {
    // Send main email to hotel
    $email_sent = mail($to_email, $subject, $email_body, $headers);
    
    // Send auto-reply to guest
    $auto_reply_sent = mail($email, $auto_reply_subject, $auto_reply_body, $auto_reply_headers);
    
    if ($email_sent) {
        // Record successful submission for rate limiting
        $_SESSION['submissions'][] = $current_time;
        
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your inquiry! We will contact you within 24 hours.',
            'auto_reply' => $auto_reply_sent
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    error_log("Email sending failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your message. Please try contacting us directly via phone or WhatsApp.',
        'error' => $e->getMessage() // Remove this line in production
    ]);
}
?>
