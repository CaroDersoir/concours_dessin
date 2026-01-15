<?php

// Back/Recup_log.php
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

    $login    = isset($_POST['utilisateur']) ? trim((string)$_POST['utilisateur']) : '';
    $password = isset($_POST['password'])    ? (string)$_POST['password'] : '';

    if ($login === '' || $password === '') {
        json_response(['success' => false, 'error' => 'MISSING_FIELDS'], 400);
    }

    // ⚠️ Adapter les noms de colonnes à ta table : ici on suppose "motDePasse" en clair
    $sql = "SELECT 
                numUtilisateur,
                login,
                motDePasse,
                nom,
                prenom,
                numClub
            FROM Utilisateur
            WHERE login = :login
            LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':login' => $login]);
    $user = $stmt->fetch();

    // Comparaison en clair (temporaire)
    if (!$user || !isset($user['motDePasse']) || $password !== $user['motDePasse']) {
        json_response(['success' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
    }

    // Génération d'un token opaque (simple)
    $token = $user['login'] . '_' . $user['nom']; 

    json_response([
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'      => (int)$user['numUtilisateur'],
            'login'   => $user['login'],
            'nom'     => $user['nom'],
            'prenom'  => $user['prenom'],
            'numClub' => $user['numClub'],
        ]
    ], 200);

} catch (PDOException $e) {
    // error_log('DB ERROR: ' . $e->getMessage());
    json_response(['success' => false, 'error' => 'DB_ERROR'], 500);
} catch (Throwable $e) {
    // error_log('APP ERROR: ' . $e->getMessage());
    json_response(['success' => false, 'error' => 'SERVER_ERROR'], 500);
}

