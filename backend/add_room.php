<?php
// backend/add_room.php
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->room_number) && isset($data->capacity)) {
    try {
        $stmt = $pdo->prepare("INSERT INTO rooms (room_number, capacity) VALUES (?, ?)");
        $stmt->execute([$data->room_number, $data->capacity]);
        echo json_encode(["status" => "success", "message" => "Room added successfully"]);
    } catch (\PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to add room: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input data"]);
}
?>
