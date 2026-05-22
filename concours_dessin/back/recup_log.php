<?php

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


    $hash = password_hash($password, PASSWORD_DEFAULT);

    if ($hash === false) {
        json_response(['success' => false, 'error' => 'HASHING_ERROR'], 500);
    }

$motDePasseValide = false;

// Vérifier que l'utilisateur existe
if (!$user || !isset($user['motDePasse'])) {
    json_response(['success' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
}

// Récupérer le hash/mot de passe stocké
$hashEnBase = $user['motDePasse'];

// Cas 1 : mot de passe hashé
if (password_verify($password, $hashEnBase)) {
    $motDePasseValide = true;

    // Rehash si nécessaire
    if (password_needs_rehash($hashEnBase, PASSWORD_DEFAULT)) {
        $nouveauHash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE Utilisateur SET motDePasse = :mdp WHERE numUtilisateur = :id");
        $stmt->execute([
            'mdp' => $nouveauHash,
            'id' => $user['numUtilisateur']
        ]);
    }
}
// Cas 2 : mot de passe en clair
elseif ($password === $hashEnBase) {
    $motDePasseValide = true;

    // Migrer vers hash
    $nouveauHash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE Utilisateur SET motDePasse = :mdp WHERE numUtilisateur = :id");
    $stmt->execute([
        'mdp' => $nouveauHash,
        'id' => $user['numUtilisateur']
    ]);
}

// Si aucun des deux n'est valide
if (!$motDePasseValide) {
    json_response(['success' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
}

/*
    // Comparaison en clair (temporaire)
    if (!$user || !isset($user['motDePasse']) || $password !== $user['motDePasse']) {
        json_response(['success' => false, 'error' => 'INVALID_CREDENTIALS'], 401);
    }*/

    // Génération d'un token opaque (simple)
    $token = $user['login'] . '_' . $user['nom']; 

    json_response([
        'success' => true,
        'token'   => $token,
        'hash'    => $hash,
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