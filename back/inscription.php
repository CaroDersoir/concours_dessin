<?php
// Back/inscription.php
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

    // Récupération des champs POST
    $numClub    = isset($_POST['numero_club']) ? intval($_POST['numero_club']) : null;
    $nom        = isset($_POST['nom']) ? trim($_POST['nom']) : '';
    $prenom     = isset($_POST['prenom']) ? trim($_POST['prenom']) : null;
    $adresse    = isset($_POST['adresse']) ? trim($_POST['adresse']) : null;
    $age        = isset($_POST['age']) ? intval($_POST['age']) : null;
    $login      = isset($_POST['username']) ? trim($_POST['username']) : '';
    $password   = isset($_POST['password']) ? $_POST['password'] : '';
    $confirm_pw = isset($_POST['confirm_password']) ? $_POST['confirm_password'] : '';

    // Vérifications simples
    if (!$numClub || !$nom || !$login || !$password || !$confirm_pw) {
        json_response(['success' => false, 'error' => 'MISSING_FIELDS'], 400);
    }

    if ($password !== $confirm_pw) {
        json_response(['success' => false, 'error' => 'PASSWORD_MISMATCH'], 400);
    }

    // Vérifier si le login existe déjà
    $sqlCheck = "SELECT numUtilisateur FROM Utilisateur WHERE login = :login LIMIT 1";
    $stmt = $pdo->prepare($sqlCheck);
    $stmt->execute([':login' => $login]);
    if ($stmt->fetch()) {
        json_response(['success' => false, 'error' => 'USER_EXISTS'], 409);
    }

    // Hash du mot de passe
    //$password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insertion dans la base
    $sqlInsert = "INSERT INTO Utilisateur (numClub, nom, prenom, adresse, age, login, motDePasse)
                  VALUES (:numClub, :nom, :prenom, :adresse, :age, :login, :motDePasse)";
    $stmt = $pdo->prepare($sqlInsert);
    $stmt->execute([
        ':numClub'    => $numClub,
        ':nom'        => $nom,
        ':prenom'     => $prenom ?: null,
        ':adresse'    => $adresse ?: null,
        ':age'        => $age ?: null,
        ':login'      => $login,
        ':motDePasse' => $password
    ]);

    // Récupération de l'ID nouvellement créé
    $userId = $pdo->lastInsertId();

    // Génération d'un token simple (exemple)
    $token = $login . '_' . $nom;

    // Réponse JSON
    json_response([
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'      => (int)$userId,
            'login'   => $login,
            'nom'     => $nom,
            'prenom'  => $prenom,
            'numClub' => $numClub,
        ]
    ], 201);

} catch (PDOException $e) {
    json_response(['success' => false, 'error' => 'DB_ERROR', 'message' => $e->getMessage()], 500);
} catch (Throwable $e) {
    json_response(['success' => false, 'error' => 'SERVER_ERROR'], 500);
}
