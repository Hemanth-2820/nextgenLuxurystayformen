<?php
// backend/add_member.php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->name) && 
    isset($data->phone) && 
    isset($data->room_id) && 
    isset($data->joining_date) && 
    isset($data->advance_paid) && 
    isset($data->monthly_rent)
) {
    try {
        // First check if room has capacity
        $checkStmt = $pdo->prepare("
            SELECT capacity, (SELECT COUNT(*) FROM members WHERE room_id = ? AND status = 'Active') as current_occupancy 
            FROM rooms WHERE id = ?
        ");
        $checkStmt->execute([$data->room_id, $data->room_id]);
        $roomInfo = $checkStmt->fetch();

        if ($roomInfo && $roomInfo['current_occupancy'] < $roomInfo['capacity']) {
            // Add the member
            $stmt = $pdo->prepare("
                INSERT INTO members (name, phone, room_id, joining_date, advance_paid, monthly_rent) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data->name, 
                $data->phone, 
                $data->room_id, 
                $data->joining_date, 
                $data->advance_paid, 
                $data->monthly_rent
            ]);
            echo json_encode(["status" => "success", "message" => "Member added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Room is fully occupied or does not exist"]);
        }
    } catch (\PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to add member: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input data"]);
}
?>
