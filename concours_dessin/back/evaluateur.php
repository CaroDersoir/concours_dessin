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

    // 🔹 récupérer evaluateur
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

    /* ============================
       2️⃣ concours du jury + état évaluation
       ============================ */
    $stmt = $pdo->prepare("
        SELECT DISTINCT
            c.numConcours,
            c.theme,
            c.dateDebut,
            c.dateFin,
            c.etat,
            CASE
                WHEN ev.numEvaluateur IS NULL THEN 0
                ELSE 1
            END AS dejaEvalue
        FROM Concours c
        JOIN Jury j
            ON j.numConcours = c.numConcours
        LEFT JOIN Dessin d
            ON d.numConcours = c.numConcours
        LEFT JOIN Evaluation ev
            ON ev.numDessin = d.numDessin
            AND ev.numEvaluateur = :numEvaluateur
        WHERE j.numEvaluateur = :numEvaluateur2
        ORDER BY c.dateDebut DESC
    ");

    $stmt->execute([
        'numEvaluateur'  => $numEvaluateur,
        'numEvaluateur2' => $numEvaluateur
    ]);

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
