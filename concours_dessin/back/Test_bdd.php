<?php
header('Content-Type: text/plain');

// Mets l'hôte en LOCAL
$host = "127.0.0.1";
$port = 3306;
$dbname = "concours_dessin";
$user = "db_etu";
$pass = "N3twork!";

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT            => 5,
        PDO::ATTR_PERSISTENT         => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "✅ Connexion à la base de données OK\n";
} catch (PDOException $e) {
    echo "❌ Erreur de connexion BDD\n";
    echo "Code SQLSTATE: " . $e->getCode() . "\n";
    echo "Message: " . $e->getMessage() . "\n";
}
