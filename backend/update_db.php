<?php
require_once 'config.php';

try {
    try {
        $conn->exec("ALTER TABLE members ADD COLUMN id_proof_url VARCHAR(255) DEFAULT NULL");
    } catch(PDOException $e) {}

    $conn->exec("
        CREATE TABLE IF NOT EXISTS inventory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            item_name VARCHAR(255) NOT NULL,
            quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
            unit VARCHAR(50) NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    $conn->exec("
        CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Insert default admin if not exists
    $stmt = $conn->query("SELECT COUNT(*) FROM admins WHERE username = 'Nextgen'");
    if ($stmt->fetchColumn() == 0) {
        $password = password_hash('purnachandra@2026', PASSWORD_DEFAULT);
        $insert = $conn->prepare("INSERT INTO admins (username, password) VALUES ('Nextgen', ?)");
        $insert->execute([$password]);
    }

    echo "Database successfully updated! Admins table created.";
} catch(PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
