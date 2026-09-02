<?php
// backend/seed.php
require 'db.php';

try {
    // Clear existing data (optional, but good for starting fresh)
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $pdo->exec("TRUNCATE TABLE members;");
    $pdo->exec("TRUNCATE TABLE rooms;");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // Insert Dummy Rooms
    $rooms = [
        ['101', 2],
        ['102', 3],
        ['103', 2],
        ['104', 1],
        ['201', 4]
    ];

    $roomStmt = $pdo->prepare("INSERT INTO rooms (room_number, capacity) VALUES (?, ?)");
    foreach ($rooms as $room) {
        $roomStmt->execute($room);
    }

    echo "Rooms seeded successfully.<br>";

    // Fetch the inserted rooms to get their IDs
    $roomsQuery = $pdo->query("SELECT id, room_number FROM rooms");
    $insertedRooms = $roomsQuery->fetchAll(PDO::FETCH_KEY_PAIR); // e.g. [1 => '101']
    
    // Reverse the array to look up ID by room number easily
    $roomIds = array_flip($insertedRooms);

    // Insert Dummy Members
    $members = [
        ['John Doe', '9876543210', $roomIds['101'], '2023-09-01', 5000, 8000, 'Active'],
        ['Alex Smith', '9876543211', $roomIds['101'], '2023-09-02', 5000, 8000, 'Active'],
        ['Michael Johnson', '9876543212', $roomIds['102'], '2023-09-10', 4000, 7500, 'Active'],
        ['David Brown', '9876543213', $roomIds['102'], '2023-09-15', 4000, 7500, 'Active'],
        ['Chris Evans', '9876543214', $roomIds['104'], '2023-10-01', 8000, 12000, 'Active']
    ];

    $memberStmt = $pdo->prepare("INSERT INTO members (name, phone, room_id, joining_date, advance_paid, monthly_rent, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($members as $member) {
        $memberStmt->execute($member);
    }

    echo "Members seeded successfully.<br>";
    echo "<h2>Dummy data added! You can now check your React frontend.</h2>";

} catch (\PDOException $e) {
    echo "Error seeding data: " . $e->getMessage();
}
?>
