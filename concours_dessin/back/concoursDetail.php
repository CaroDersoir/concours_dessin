<?php
/*
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$numConcours = $_POST['numConcours'] ?? null;
$login = $_POST['utilisateur'] ?? null;

if (!$numConcours || !$login) {
    json_response([
        'success' => false,
        'error' => 'PARAM_MANQUANT'
    ], 400);
}

try {
    //🔹 Récupération du compétiteur via Utilisateur 
    $stmt = $pdo->prepare("
        SELECT c.numCompetiteur
        FROM Utilisateur u
        JOIN Competiteur c ON c.numCompetiteur = u.numUtilisateur
        WHERE u.login = ?
    ");
    $stmt->execute([$login]);
    $competiteur = $stmt->fetch();

    if (!$competiteur) {
        json_response([
            'success' => false,
            'error' => 'NOT_COMPETITEUR'
        ], 403);
    }

    //🔹 Infos du concours 
    $stmt = $pdo->prepare("
        SELECT 
            numConcours,
            theme,
            dateDebut,
            dateFin,
            etat
        FROM Concours
        WHERE numConcours = ?
    ");
    $stmt->execute([$numConcours]);
    $concours = $stmt->fetch();

    if (!$concours) {
        json_response([
            'success' => false,
            'error' => 'CONCOURS_NOT_FOUND'
        ], 404);
    }

    //🔹 Dessins DU COMPETITEUR pour ce concours 
    $stmt = $pdo->prepare("
        SELECT
            d.numDessin,
            TO_BASE64(d.leDessin) AS image,
            ROUND(AVG(e.note), 2) AS moyenne
        FROM Dessin d
        LEFT JOIN Evaluation e ON e.numDessin = d.numDessin
        WHERE d.numConcours = ?
          AND d.numCompetiteur = ?
        GROUP BY d.numDessin
        ORDER BY d.dateRemise ASC
    ");
    $stmt->execute([
        $numConcours,
        $competiteur['numCompetiteur']
    ]);
    $dessins = $stmt->fetchAll();

    json_response([
        'success' => true,
        'concours' => $concours,
        'dessins' => $dessins
    ]);

} catch (PDOException $e) {
    json_response([
        'success' => false,
        'error' => 'DB_ERROR'
    ], 500);
}*/

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$numConcours = $_POST['numConcours'] ?? null;
$token = $_POST['utilisateur'] ?? null;

if (!$numConcours || !$token) {
    json_response(['success' => false, 'error' => 'PARAM_MANQUANT'], 400);
}

$login = explode('_', $token)[0];

try {
    /* 🔹 Compétiteur */
    $stmt = $pdo->prepare("
        SELECT c.numCompetiteur
        FROM Utilisateur u
        JOIN Competiteur c ON c.numCompetiteur = u.numUtilisateur
        JOIN ParticipeCompetiteur pc 
            ON pc.numCompetiteur = c.numCompetiteur
        WHERE u.login = ?
          AND pc.numConcours = ?
    ");
    $stmt->execute([$login, $numConcours]);
    $competiteur = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$competiteur) {
        json_response(['success' => false, 'error' => 'NOT_ALLOWED'], 403);
    }

    $numCompetiteur = $competiteur['numCompetiteur'];

    /* 🔹 Infos concours */
    $stmt = $pdo->prepare("
        SELECT numConcours, theme, dateDebut, dateFin, etat
        FROM Concours
        WHERE numConcours = ?
    ");
    $stmt->execute([$numConcours]);
    $concours = $stmt->fetch(PDO::FETCH_ASSOC);

    /* 🔹 Dessins (SANS image) */
    $stmt = $pdo->prepare("
        SELECT
            d.numDessin,
            ROUND(AVG(e.note), 2) AS moyenne
        FROM Dessin d
        LEFT JOIN Evaluation e ON e.numDessin = d.numDessin
        WHERE d.numConcours = ?
          AND d.numCompetiteur = ?
        GROUP BY d.numDessin
        ORDER BY d.dateRemise ASC
    ");
    $stmt->execute([$numConcours, $numCompetiteur]);
    $dessins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    json_response([
        'success' => true,
        'concours' => $concours,
        'dessins' => $dessins
    ]);

} catch (PDOException $e) {
    json_response(['success' => false, 'error' => 'DB_ERROR'], 500);
}

