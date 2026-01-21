<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'])) {
        json_response(['success' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    }

    $stmt = $pdo->query("
        SELECT
            numConcours,
            numPresident,
            theme,
            dateDebut,
            dateFin,
            etat
        FROM Concours
        ORDER BY dateDebut DESC
    ");

    $concours = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response([
        'success' => true,
        'concours' => $concours
    ]);

} catch (PDOException $e) {
    json_response([
        'success' => false,
        'error' => 'DB_ERROR',
        'message' => $e->getMessage()
    ], 500);
}
