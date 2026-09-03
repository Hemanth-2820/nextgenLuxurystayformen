<?php
require_once 'config.php';

try {
    // We can also ensure id_proof_url is there from earlier, just in case they didn't run it.
    try {
        $conn->exec("ALTER TABLE members ADD COLUMN id_proof_url VARCHAR(255) DEFAULT NULL");
    } catch(PDOException $e) {}

    // Create Inventory table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS inventory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            item_name VARCHAR(255) NOT NULL,
            quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
            unit VARCHAR(50) NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    echo "Database successfully updated! Inventory table created.";
} catch(PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
