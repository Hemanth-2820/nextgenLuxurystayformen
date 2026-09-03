<?php
require_once 'config.php';

$action = $_GET['action'] ?? '';

// Read JSON input for POST requests
$input = json_decode(file_get_contents('php://input'), true);

try {
    if ($action === 'get_rooms') {
        $stmt = $conn->query("SELECT * FROM rooms ORDER BY room_number");
        $rooms = $stmt->fetchAll();

        foreach ($rooms as &$room) {
            $bedStmt = $conn->prepare("SELECT id, bed_name as name, is_occupied as occupied FROM beds WHERE room_id = ?");
            $bedStmt->execute([$room['id']]);
            $beds = $bedStmt->fetchAll();
            
            foreach ($beds as &$bed) {
                $bed['occupied'] = (bool)$bed['occupied'];
            }
            $room['beds'] = $beds;
            $room['capacity'] = (int)$room['capacity'];
            $room['current_occupancy'] = (int)$room['current_occupancy'];
        }
        echo json_encode($rooms);

    } elseif ($action === 'add_room') {
        $room_number = $input['room_number'];
        $capacity = (int)$input['capacity'];
        
        $stmt = $conn->prepare("INSERT INTO rooms (room_number, capacity, current_occupancy) VALUES (?, ?, 0)");
        $stmt->execute([$room_number, $capacity]);
        $room_id = $conn->lastInsertId();

        $bed_names = ['Bed A', 'Bed B', 'Bed C', 'Bed D', 'Bed E', 'Bed F'];
        for ($i = 0; $i < $capacity; $i++) {
            $bName = $bed_names[$i] ?? 'Bed ' . ($i + 1);
            $bedStmt = $conn->prepare("INSERT INTO beds (room_id, bed_name, is_occupied) VALUES (?, ?, FALSE)");
            $bedStmt->execute([$room_id, $bName]);
        }
        echo json_encode(["success" => true, "room_id" => $room_id]);

    } elseif ($action === 'get_members') {
        $stmt = $conn->query("
            SELECT m.*, r.room_number, b.bed_name 
            FROM members m 
            LEFT JOIN rooms r ON m.room_id = r.id 
            LEFT JOIN beds b ON m.bed_id = b.id
            ORDER BY m.created_at DESC
        ");
        echo json_encode($stmt->fetchAll());

    } elseif ($action === 'add_member') {
        $id_proof_url = null;
        if (!empty($input['id_proof_base64'])) {
            $uploads_dir = __DIR__ . '/uploads';
            if (!is_dir($uploads_dir)) {
                mkdir($uploads_dir, 0755, true);
            }
            // Parse base64
            $image_parts = explode(";base64,", $input['id_proof_base64']);
            if (count($image_parts) === 2) {
                $image_type_aux = explode("image/", $image_parts[0]);
                $image_type = $image_type_aux[1] ?? 'jpg';
                $image_base64 = base64_decode($image_parts[1]);
                $file_name = 'aadhar_' . time() . '_' . uniqid() . '.' . $image_type;
                $file_path = $uploads_dir . '/' . $file_name;
                file_put_contents($file_path, $image_base64);
                $id_proof_url = 'https://nextgen.nexlifly.in/backend/uploads/' . $file_name;
            }
        }

        $stmt = $conn->prepare("
            INSERT INTO members (name, email, phone, room_id, bed_id, joining_date, monthly_rent, advance_paid, id_proof_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['name'], $input['email'], $input['phone'], 
            $input['room_id'], $input['bed_id'], $input['joining_date'], 
            $input['monthly_rent'], $input['advance_paid'], $id_proof_url
        ]);
        
        // Update occupancy
        $conn->prepare("UPDATE beds SET is_occupied = TRUE WHERE id = ?")->execute([$input['bed_id']]);
        $conn->prepare("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE id = ?")->execute([$input['room_id']]);
        
        // Send Welcome Email
        $to = $input['email'];
        if (!empty($to)) {
            $subject = "Welcome to NextGen Luxury Stay!";
            $boundary = md5(time());
            
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "From: NextGen Luxury Stay <info@nextgen.nexlifly.in>\r\n";
            $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
            
            $body = "--$boundary\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
            
            $body .= "
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #111827; color: #f3f4f6; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #1f2937; padding: 30px; border-radius: 12px; border: 1px solid #374151; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { max-height: 80px; display: block; margin: 0 auto; }
                    .title { color: #d4af37; font-size: 24px; font-weight: bold; margin-top: 20px; }
                    .content { font-size: 16px; line-height: 1.6; color: #d1d5db; }
                    .highlight { color: #d4af37; font-weight: bold; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #374151; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='https://nextgen.nexlifly.in/logo.png' alt='NextGen Luxury Stay' class='logo' />
                        <div class='title'>Welcome to NextGen, " . htmlspecialchars($input['name']) . "!</div>
                    </div>
                    <div class='content'>
                        <p>Dear <span class='highlight'>" . htmlspecialchars($input['name']) . "</span>,</p>
                        <p>We are absolutely thrilled to welcome you to <strong>NextGen Luxury Stay For Men</strong>!</p>
                        <p>Your accommodation has been successfully confirmed. Please find your official <strong>Admission Receipt</strong> attached as a PDF to this email.</p>
                        <p>If you have any questions, require maintenance, or just need assistance, our management team is always here to help you.</p>
                        <br/>
                        <p>Warm regards,</p>
                        <p><strong style='color:#d4af37;'>The NextGen Management Team</strong></p>
                    </div>
                    <div class='footer'>
                        &copy; " . date('Y') . " NextGen Luxury Stay For Men. All rights reserved.<br/>
                        Please do not reply to this automated email.
                    </div>
                </div>
            </body>
            </html>
            \r\n\r\n";
            
            // Attach PDF if provided
            if (!empty($input['pdf_base64'])) {
                $base64_data = preg_replace('/^data:application\/pdf;base64,/', '', $input['pdf_base64']);
                $chunked_base64 = chunk_split($base64_data);
                
                $body .= "--$boundary\r\n";
                $body .= "Content-Type: application/pdf; name=\"Welcome_Receipt.pdf\"\r\n";
                $body .= "Content-Disposition: attachment; filename=\"Welcome_Receipt.pdf\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
                $body .= $chunked_base64 . "\r\n\r\n";
            }
            
            $body .= "--$boundary--";
            
            mail($to, $subject, $body, $headers);
        }

        echo json_encode(["success" => true]);

    } elseif ($action === 'get_payments') {
        $stmt = $conn->query("
            SELECT p.*, m.name, r.room_number 
            FROM payments p 
            JOIN members m ON p.member_id = m.id 
            LEFT JOIN rooms r ON m.room_id = r.id
            ORDER BY p.payment_date DESC
        ");
        echo json_encode($stmt->fetchAll());
        
    } elseif ($action === 'collect_rent') {
        $stmt = $conn->prepare("UPDATE payments SET status = 'Paid' WHERE id = ?");
        $stmt->execute([$input['payment_id']]);
        
        // Fetch payment and member details to send email
        $stmt = $conn->prepare("
            SELECT p.amount, m.name, m.email 
            FROM payments p 
            JOIN members m ON p.member_id = m.id 
            WHERE p.id = ?
        ");
        $stmt->execute([$input['payment_id']]);
        $payment = $stmt->fetch();
        
        if ($payment && !empty($payment['email'])) {
            $to = $payment['email'];
            $subject = "Payment Received - NextGen Luxury Stay";
            
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
                    .title { color: #10b981; font-size: 24px; font-weight: bold; margin-top: 20px; }
                    .content { font-size: 16px; line-height: 1.6; color: #d1d5db; }
                    .highlight { color: #10b981; font-weight: bold; font-size: 18px; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #374151; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='https://nextgen.nexlifly.in/logo.png' alt='NextGen Luxury Stay' class='logo' />
                        <div class='title'>Payment Successful</div>
                    </div>
                    <div class='content'>
                        <p>Dear <strong>" . htmlspecialchars($payment['name']) . "</strong>,</p>
                        <p>Thank you! We have successfully received your rent payment.</p>
                        <p>Amount Paid: <span class='highlight'>Rs. " . htmlspecialchars($payment['amount']) . "</span></p>
                        <p>Your account is now fully up to date. Thank you for your prompt payment and for choosing NextGen Luxury Stay!</p>
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

        echo json_encode(["success" => true]);
        
    } elseif ($action === 'vacate_member') {
        $member_id = $input['member_id'];
        
        // Find member's room and bed before deleting/updating
        $stmt = $conn->prepare("SELECT room_id, bed_id FROM members WHERE id = ?");
        $stmt->execute([$member_id]);
        $member = $stmt->fetch();
        
        if ($member) {
            $conn->prepare("UPDATE beds SET is_occupied = FALSE WHERE id = ?")->execute([$member['bed_id']]);
            $conn->prepare("UPDATE rooms SET current_occupancy = current_occupancy - 1 WHERE id = ?")->execute([$member['room_id']]);
            $conn->prepare("UPDATE members SET status = 'Vacated', room_id = NULL, bed_id = NULL WHERE id = ?")->execute([$member_id]);
        }
        echo json_encode(["success" => true]);

    } elseif ($action === 'get_expenses') {
        $stmt = $conn->query("SELECT * FROM expenses ORDER BY expense_date DESC");
        echo json_encode($stmt->fetchAll());
        
    } elseif ($action === 'add_expense') {
        $stmt = $conn->prepare("INSERT INTO expenses (title, amount, expense_date, category) VALUES (?, ?, ?, ?)");
        $stmt->execute([$input['title'], $input['amount'], $input['expense_date'], $input['category']]);
        echo json_encode(["success" => true]);

    } elseif ($action === 'get_complaints') {
        $stmt = $conn->query("
            SELECT c.*, m.name as member_name, r.room_number 
            FROM complaints c 
            JOIN members m ON c.member_id = m.id 
            LEFT JOIN rooms r ON m.room_id = r.id
            ORDER BY c.created_date DESC
        ");
        echo json_encode($stmt->fetchAll());
        
    } elseif ($action === 'add_complaint') {
        $stmt = $conn->prepare("INSERT INTO complaints (member_id, complaint_text, created_date) VALUES (?, ?, ?)");
        $stmt->execute([$input['member_id'], $input['complaint_text'], $input['created_date']]);
        echo json_encode(["success" => true]);

    } elseif ($action === 'resolve_complaint') {
        $stmt = $conn->prepare("UPDATE complaints SET status = 'Resolved' WHERE id = ?");
        $stmt->execute([$input['complaint_id']]);
        echo json_encode(["success" => true]);

    } elseif ($action === 'get_enquiries') {
        $stmt = $conn->query("SELECT * FROM enquiries ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        
    } elseif ($action === 'add_enquiry') {
        $stmt = $conn->prepare("INSERT INTO enquiries (name, phone, follow_up_date) VALUES (?, ?, ?)");
        $stmt->execute([$input['name'], $input['phone'], $input['follow_up_date']]);
        echo json_encode(["success" => true]);
        
    } elseif ($action === 'update_enquiry_status') {
        $stmt = $conn->prepare("UPDATE enquiries SET status = ? WHERE id = ?");
        $stmt->execute([$input['status'], $input['enquiry_id']]);
        echo json_encode(["success" => true]);

    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid action"]);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
