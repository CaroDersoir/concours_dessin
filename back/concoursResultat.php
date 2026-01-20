<?php
// back/resultatConcours.php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    }

    $numConcours = $_POST['numConcours'] ?? '';
    $token = $_POST['utilisateur'] ?? '';

    if ($numConcours === '' || $token === '') {
        json_response(['success' => false, 'error' => 'MISSING_DATA'], 400);
    }

    // 🔹 Récupérer numUtilisateur depuis token
    $login = explode('_', $token)[0];
    $stmt = $pdo->prepare("SELECT numUtilisateur FROM Utilisateur WHERE login = :login");
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        json_response(['success' => false, 'error' => 'USER_NOT_FOUND'], 404);
    }
    $numCompetiteur = $user['numUtilisateur'];

    // 🔹 Infos concours
    $stmt = $pdo->prepare("
        SELECT theme, dateDebut, dateFin
        FROM Concours
        WHERE numConcours = :numConcours
    ");
    $stmt->execute(['numConcours' => $numConcours]);
    $concours = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$concours) {
        json_response(['success' => false, 'error' => 'CONCOURS_NOT_FOUND'], 404);
    }

    // 🔹 Dessins du compétiteur uniquement + moyenne des notes
    $stmt = $pdo->prepare("
        SELECT 
            d.numDessin,
            d.leDessin,
            ROUND(AVG(e.note), 2) AS moyenne
        FROM Dessin d
        LEFT JOIN Evaluation e ON e.numDessin = d.numDessin
        WHERE d.numConcours = :numConcours
          AND d.numCompetiteur = :numCompetiteur
        GROUP BY d.numDessin
        ORDER BY d.numDessin
    ");
    $stmt->execute([
        'numConcours' => $numConcours,
        'numCompetiteur' => $numCompetiteur
    ]);
    $dessins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 🔹 Convertir BLOB en base64
    foreach ($dessins as &$d) {
        if (!empty($d['leDessin'])) {
            $d['image'] = base64_encode($d['leDessin']);
        } else {
            $d['image'] = null;
        }
        unset($d['leDessin']);
    }

    json_response([
        'success' => true,
        'concours' => $concours,
        'dessins' => $dessins
    ]);

} catch (PDOException $e) {
    json_response([
        'success' => false,
        'error' => 'DB_ERROR',
        'message' => $e->getMessage()
    ], 500);
}
