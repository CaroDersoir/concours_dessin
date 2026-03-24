<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    }

    $token = $_POST['utilisateur'] ?? '';
    if ($token === '') {
        json_response(['success' => false, 'error' => 'MISSING_TOKEN'], 400);
    }

    $login = explode('_', $token)[0];

    // 🔹 récupérer utilisateur
    $stmt = $pdo->prepare("
        SELECT numUtilisateur
        FROM Utilisateur
        WHERE login = :login
    ");
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        json_response(['success' => false, 'error' => 'USER_NOT_FOUND'], 404);
    }

    $numUtilisateur = $user['numUtilisateur'];

    // 🔹 concours où il NE participe PAS + ouverts
    $stmt = $pdo->prepare("
        SELECT
            c.numConcours,
            c.theme,
            c.dateDebut,
            c.dateFin
        FROM Concours c
        LEFT JOIN ParticipeCompetiteur pc
            ON pc.numConcours = c.numConcours
            AND pc.numCompetiteur = :numUtilisateur
        WHERE pc.numCompetiteur IS NULL
          AND (c.etat = 'en_cours' OR c.etat = 'pas_commence')
        ORDER BY c.dateDebut ASC
    ");

    $stmt->execute(['numUtilisateur' => $numUtilisateur]);
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
