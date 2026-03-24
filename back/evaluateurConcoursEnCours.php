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
    $numConcours = $_POST['concours'] ?? '';

    if ($token === '' || $numConcours === '') {
        json_response(['success' => false, 'error' => 'MISSING_DATA'], 400);
    }

    // Récupérer le login depuis le token
    $login = explode('_', $token)[0];

    // 🔹 Vérifier que l'utilisateur est évaluateur
    $stmt = $pdo->prepare("
        SELECT u.numUtilisateur, e.numEvaluateur
        FROM Utilisateur u
        JOIN Evaluateur e ON e.numEvaluateur = u.numUtilisateur
        WHERE u.login = :login
    ");
    $stmt->execute(['login' => $login]);
    $evaluateur = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$evaluateur) {
        json_response(['success' => false, 'error' => 'NOT_EVALUATEUR'], 403);
    }

    $numEvaluateur = $evaluateur['numEvaluateur'];

    // 🔹 Récupérer les infos du concours
    $stmt = $pdo->prepare("
        SELECT numConcours, theme, dateDebut, dateFin, etat
        FROM Concours
        WHERE numConcours = :numConcours
    ");
    $stmt->execute(['numConcours' => $numConcours]);
    $concours = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$concours) {
        json_response(['success' => false, 'error' => 'CONCOURS_NOT_FOUND'], 404);
    }

    // 🔹 Récupérer les dessins du concours
    $stmt = $pdo->prepare("
        SELECT d.numDessin, d.commentaire, d.leDessin,
               e.note
        FROM Dessin d
        LEFT JOIN Evaluation e
          ON e.numDessin = d.numDessin
         AND e.numEvaluateur = :numEvaluateur
        WHERE d.numConcours = :numConcours
    ");
    $stmt->execute([
        'numConcours' => $numConcours,
        'numEvaluateur' => $numEvaluateur
    ]);
    $dessins = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
