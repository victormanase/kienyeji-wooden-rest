<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $required_fields = ['name', 'email', 'rating', 'comment'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("$field is required");
        }
    }
    
    // Validate email
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Validate rating
    $rating = intval($input['rating']);
    if ($rating < 1 || $rating > 5) {
        throw new Exception('Rating must be between 1 and 5');
    }
    
    // Sanitize input data
    $review = [
        'id' => uniqid('review_', true),
        'name' => trim(strip_tags($input['name'])),
        'email' => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
        'rating' => $rating,
        'comment' => trim(strip_tags($input['comment'])),
        'date' => date('Y-m-d'),
        'timestamp' => date('Y-m-d H:i:s'),
        'verified' => false,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    // Save to reviews file
    $reviews_file = '../data/reviews.json';
    $reviews = [];
    
    // Load existing reviews
    if (file_exists($reviews_file)) {
        $reviews_content = file_get_contents($reviews_file);
        $reviews = json_decode($reviews_content, true) ?: [];
    }
    
    // Add new review to the beginning of the array
    array_unshift($reviews, $review);
    
    // Keep only the most recent 50 reviews
    $reviews = array_slice($reviews, 0, 50);
    
    // Save back to file
    if (!file_put_contents($reviews_file, json_encode($reviews, JSON_PRETTY_PRINT))) {
        throw new Exception('Failed to save review');
    }
    
    // Optional: Send notification email to admin
    // sendNotificationEmail($review);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Review submitted successfully! Thank you for sharing your experience.',
        'review_id' => $review['id']
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

// Optional: Function to send email notification
function sendNotificationEmail($review) {
    $to = 'info@kienyejiwoodenrest.co.tz';
    $subject = 'New Review Submitted - Kienyeji Wooden Rest';
    
    $message = "
    New review submitted on your website:
    
    Name: {$review['name']}
    Email: {$review['email']}
    Rating: {$review['rating']}/5 stars
    Comment: {$review['comment']}
    Date: {$review['timestamp']}
    
    Please log in to your admin panel to verify and publish this review.
    ";
    
    $headers = [
        'From: noreply@kienyejiwoodenrest.co.tz',
        'Reply-To: ' . $review['email'],
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    mail($to, $subject, $message, implode("\r\n", $headers));
}
?>
