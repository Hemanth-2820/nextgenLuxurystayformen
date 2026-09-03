<?php
// cron_rent_reminders.php
// This script is meant to be executed by a server cron job (not opened in a browser)

require_once __DIR__ . '/config.php';

try {
    // Find everyone who currently owes rent
    $stmt = $conn->query("
        SELECT p.amount, m.name, m.email 
        FROM payments p 
        JOIN members m ON p.member_id = m.id 
        WHERE p.status = 'Pending'
    ");
    $pending_payments = $stmt->fetchAll();

    foreach ($pending_payments as $payment) {
        $to = $payment['email'];
        
        if (!empty($to)) {
            $subject = "Urgent: Rent Due Reminder - NextGen Luxury Stay";
            
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8\r\n";
            $headers .= "From: NextGen Luxury Stay <info@nextgen.nexlifly.in>\r\n";
            
            $message = "
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #111827; color: #f3f4f6; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #1f2937; padding: 30px; border-radius: 12px; border: 1px solid #374151; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { max-height: 80px; display: block; margin: 0 auto; }
                    .title { color: #ef4444; font-size: 24px; font-weight: bold; margin-top: 20px; }
                    .content { font-size: 16px; line-height: 1.6; color: #d1d5db; }
                    .highlight { color: #ef4444; font-weight: bold; font-size: 18px; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #374151; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='https://nextgen.nexlifly.in/logo.png' alt='NextGen Luxury Stay' class='logo' />
                        <div class='title'>Rent Due Reminder</div>
                    </div>
                    <div class='content'>
                        <p>Dear <strong>" . htmlspecialchars($payment['name']) . "</strong>,</p>
                        <p>This is an automated reminder that your rent payment is currently due.</p>
                        <p>Amount Due: <span class='highlight'>Rs. " . htmlspecialchars($payment['amount']) . "</span></p>
                        <p>Please clear your dues as soon as possible to avoid any late fees. If you have already made the payment, please ignore this email or contact the management to update your record.</p>
                        <br/>
                        <p>Warm regards,</p>
                        <p><strong style='color:#d4af37;'>The NextGen Management Team</strong></p>
                    </div>
                    <div class='footer'>
                        &copy; " . date('Y') . " NextGen Luxury Stay For Men. All rights reserved.
                    </div>
                </div>
            </body>
            </html>
            ";
            
            mail($to, $subject, $message, $headers);
        }
    }
    
    echo "Successfully processed " . count($pending_payments) . " reminders.\n";
} catch(PDOException $e) {
    echo "Error processing reminders: " . $e->getMessage() . "\n";
}
?>
