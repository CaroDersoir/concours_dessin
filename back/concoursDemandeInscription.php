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

    $token = $_POST['token'] ?? '';
    $numConcours = $_POST['concours'] ?? '';
    $role = $_POST['role'] ?? '';

    if (!$token || !$numConcours || !$role) {
        json_response(['success' => false, 'error' => 'MISSING_FIELDS'], 400);
    }

    $login = explode('_', $token)[0];

    // 🔹 récupérer utilisateur
    $stmt = $pdo->prepare("SELECT numUtilisateur FROM Utilisateur WHERE login = :login");
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        json_response(['success' => false, 'error' => 'USER_NOT_FOUND'], 404);
    }

    $numUtilisateur = $user['numUtilisateur'];

    // 🔹 vérifier si l'utilisateur est déjà inscrit
    $stmtCheck = $pdo->prepare("
        SELECT id 
        FROM DemandeParticipation 
        WHERE numUtilisateur = :numUtilisateur AND numConcours = :numConcours
    ");
    $stmtCheck->execute(['numUtilisateur' => $numUtilisateur, 'numConcours' => $numConcours]);
    if ($stmtCheck->fetch()) {
        json_response(['success' => false, 'error' => 'ALREADY_REGISTERED', 'message' => 'Vous êtes déjà inscrit à ce concours'], 400);
    }

    // 🔹 insérer la demande
    $roleEnum = $role === 'competiteur' ? 'Compétiteur' : 'Evaluateur';

    $stmtInsert = $pdo->prepare("
        INSERT INTO DemandeParticipation (numUtilisateur, numConcours, role) 
        VALUES (:numUtilisateur, :numConcours, :role)
    ");
    $stmtInsert->execute([
        ':numUtilisateur' => $numUtilisateur,
        ':numConcours' => $numConcours,
        ':role' => $roleEnum
    ]);

    json_response(['success' => true, 'message' => 'Inscription enregistrée']);

} catch (PDOException $e) {
    json_response(['success' => false, 'error' => 'DB_ERROR', 'message' => $e->getMessage()], 500);
}
