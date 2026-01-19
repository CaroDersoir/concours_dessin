<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_response(['success' => false, 'error' => 'METHOD_NOT_ALLOWED'], 405);
    }

    $token  = $_POST['token']  ?? '';
    $oldPwd = $_POST['oldPwd'] ?? '';
    $newPwd = $_POST['newPwd'] ?? '';

    if ($token === '' || $oldPwd === '' || $newPwd === '') {
        json_response(['success' => false, 'error' => 'CHAMPS_MANQUANTS'], 400);
    }

    // Extraction du login depuis le token
    $pos = strpos($token, '_');
    if ($pos === false) {
        json_response(['success' => false, 'error' => 'TOKEN_INVALIDE'], 400);
    }

    $login = substr($token, 0, $pos);

    // Récupération utilisateur
    $sql = "SELECT numUtilisateur, motDePasse FROM Utilisateur WHERE login = :login";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch();

    if (!$user) {
        json_response(['success' => false, 'error' => 'UTILISATEUR_INTRouvABLE'], 404);
    }

    // Vérification ancien mot de passe (EN CLAIR)
    if ($oldPwd !== $user['motDePasse']) {
        json_response(['success' => false, 'error' => 'ANCIEN_MDP_INCORRECT'], 401);
    }

    // Mise à jour du mot de passe
    $sql = "UPDATE Utilisateur SET motDePasse = :newPwd WHERE numUtilisateur = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'newPwd' => $newPwd,
        'id'     => $user['numUtilisateur']
    ]);

    json_response(['success' => true]);

} catch (PDOException $e) {
    error_log($e->getMessage());
    json_response(['success' => false, 'error' => 'ERREUR_SQL'], 500);
} catch (Throwable $e) {
    error_log($e->getMessage());
    json_response(['success' => false, 'error' => 'ERREUR_SERVEUR'], 500);
}
