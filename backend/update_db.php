<?php
require_once 'config.php';

try {
    $conn->exec("ALTER TABLE members ADD COLUMN id_proof_url VARCHAR(255) DEFAULT NULL");
    echo "Database successfully updated! You can now upload ID proofs.";
} catch(PDOException $e) {
    // If it already exists, it will throw an error, which is fine.
    echo "Database already updated or error: " . $e->getMessage();
}
?>
