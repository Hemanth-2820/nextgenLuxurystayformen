<?php
// backend/get_rooms.php
require 'db.php';

try {
    // Get all rooms and count how many active members are in each
    $stmt = $pdo->query("
        SELECT r.id, r.room_number, r.capacity, 
               (SELECT COUNT(*) FROM members m WHERE m.room_id = r.id AND m.status = 'Active') as current_occupancy 
        FROM rooms r
        ORDER BY r.room_number ASC
    ");
    $rooms = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $rooms]);
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
