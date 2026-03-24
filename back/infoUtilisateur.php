<?php
// back/infoUtilisateur.php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php'; // Doit fournir $pdo (PDO connecté en FETCH_ASSOC)

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    }

    $token = isset($_POST['utilisateur']) ? trim((string)$_POST['utilisateur']) : '';

    if ($token === '') {
        json_response(['success' => false, 'error' => 'MISSING_FIELDS'], 400);
    }

    // Extraction du login : tout avant le premier _
    $pos = strpos($token, '_');
    if ($pos === false) {
        json_response(['success' => false, 'error' => 'INVALID_TOKEN_FORMAT'], 400);
    }
    $login = substr($token, 0, $pos);

    // Requête SQL
    // a rajouter email
    $sql = "SELECT 
                numUtilisateur,
                login,
                nom,
                prenom,
                adresse,
                numClub
            FROM Utilisateur
            WHERE login = :login
            LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':login' => $login]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(['success' => false, 'error' => 'USER_NOT_FOUND'], 404);
    }

    json_response([
        'success' => true,
        'user'    => [
            'id'      => (int)$user['numUtilisateur'],
            'login'   => $user['login'],
            'nom'     => $user['nom'],
            'prenom'  => $user['prenom'],
            'adresse' => $user['adresse'],
            'numClub' => $user['numClub'],
            //'email'   => $user['email'],
        ]
    ], 200);

} catch (Exception $e) {
    json_response(['success' => false, 'error' => 'SERVER_ERROR'], 500);
}
