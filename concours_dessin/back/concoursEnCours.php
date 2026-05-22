<?php
// back/concoursEnCours.php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Requête : concours en cours
    $sql = "SELECT 
                numConcours,
                theme,
                dateDebut,
                dateFin,
                etat
            FROM Concours
            WHERE etat = 'en_cours'
            ORDER BY dateDebut ASC";

    $stmt = $pdo->query($sql);
    $concours = $stmt->fetchAll();

    json_response([
        'success'  => true,
        'concours' => $concours
    ]);

} catch (PDOException $e) {
    json_response([
        'success' => false,
        'error'   => 'DB_ERROR'
    ], 500);
}
