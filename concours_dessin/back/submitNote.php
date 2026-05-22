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
    $numDessin = $_POST['numDessin'] ?? '';
    $note = $_POST['note'] ?? '';

    if ($token === '' || $numDessin === '' || $note === '') {
        json_response(['success' => false, 'error' => 'MISSING_DATA'], 400);
    }

    $login = explode('_', $token)[0];

    // 🔹 Récupérer l’évaluateur
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

    // 🔹 Vérifier si une évaluation existe déjà
    $stmt = $pdo->prepare("
        SELECT * FROM Evaluation 
        WHERE numDessin = :numDessin AND numEvaluateur = :numEvaluateur
    ");
    $stmt->execute([
        'numDessin' => $numDessin,
        'numEvaluateur' => $numEvaluateur
    ]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // Mettre à jour
        $stmt = $pdo->prepare("
            UPDATE Evaluation 
            SET note = :note, dateEvaluation = NOW()
            WHERE numDessin = :numDessin AND numEvaluateur = :numEvaluateur
        ");
        $stmt->execute([
            'note' => $note,
            'numDessin' => $numDessin,
            'numEvaluateur' => $numEvaluateur
        ]);
    } else {
        // Créer une nouvelle évaluation
        $stmt = $pdo->prepare("
            INSERT INTO Evaluation (numEvaluateur, numDessin, dateEvaluation, note)
            VALUES (:numEvaluateur, :numDessin, NOW(), :note)
        ");
        $stmt->execute([
            'numEvaluateur' => $numEvaluateur,
            'numDessin' => $numDessin,
            'note' => $note
        ]);
    }

    json_response(['success' => true, 'message' => 'Note enregistrée']);

} catch (PDOException $e) {
    json_response([
        'success' => false,
        'error' => 'DB_ERROR',
        'message' => $e->getMessage()
    ], 500);
}
