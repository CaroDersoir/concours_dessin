
<?php

header('Content-Type: text/html; charset=utf-8');

// ======= Paramètres BDD (adapte si besoin) =======
$host   = "127.0.0.1"; 
$port   = 3306;
$dbname = "concours_dessin";
$user   = "db_etu";
$pass   = "N3twork!";

// ======= Connexion PDO =======
try {
    $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT            => 5,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_PERSISTENT         => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo "<pre>❌ Erreur de connexion PDO ({$e->getCode()}): " 
        . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . "</pre>";
    exit;
}

// ======= Requête =======
try {
    // IMPORTANT: backticks et casse du nom de table
    $sql  = "SELECT * FROM `Utilisateur` WHERE 1";
    $stmt = $pdo->query($sql);
    $rows = $stmt->fetchAll();
} catch (Throwable $e) {
    http_response_code(500);
    echo "<pre>❌ Erreur SQL: " . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . "</pre>";
    exit;
}

// ======= Rendu JSON =======
echo "<h2>Résultat JSON</h2>";
echo "<pre>" . htmlspecialchars(json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), ENT_QUOTES, 'UTF-8') . "</pre>";

// ======= Rendu Tableau HTML =======
echo "<h2>Résultat en tableau (table: Utilisateur)</h2>";
if (empty($rows)) {
    echo "<p><em>Aucun enregistrement retourné.</em></p>";
} else {
    $columns = array_keys($rows[0]);
    echo "<table border='1' cellpadding='6' cellspacing='0' style='border-collapse:collapse; font-family:Arial; font-size:14px;'>";
    echo "<thead><tr style='background:#f2f2f2;'>";
    foreach ($columns as $c) {
        echo "<th>" . htmlspecialchars($c, ENT_QUOTES, 'UTF-8') . "</th>";
    }
    echo "</tr></thead><tbody>";
    foreach ($rows as $r) {
        echo "<tr>";
        foreach ($columns as $c) {
            $val = isset($r[$c]) ? (string)$r[$c] : '';
            echo "<td>" . htmlspecialchars($val, ENT_QUOTES, 'UTF-8') . "</td>";
        }
        echo "</tr>";
    }
    echo "</tbody></table>";
    echo "<p style='margin-top:8px;color:#555'>Total lignes : " . count($rows) . "</p>";
}

// ======= Infos utiles =======
echo "<hr><details><summary>Infos</summary><pre>";
echo "Hôte : {$host}\nPort : {$port}\nBase : {$dbname}\nRequête : {$sql}\n";
echo "</pre></details>";
