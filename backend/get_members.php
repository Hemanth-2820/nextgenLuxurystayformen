<?php
// backend/get_members.php
require 'db.php';

try {
    $stmt = $pdo->query("
        SELECT m.id, m.name, m.phone, m.joining_date, m.advance_paid, m.monthly_rent, m.status, r.room_number 
        FROM members m
        JOIN rooms r ON m.room_id = r.id
        ORDER BY m.joining_date DESC
    ");
    $members = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $members]);
} catch (\PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
