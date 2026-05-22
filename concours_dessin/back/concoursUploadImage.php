<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

$numConcours = $_POST['numConcours'] ?? null;
$token = $_POST['utilisateur'] ?? null;

if (!$numConcours || !$token || !isset($_FILES['dessin'])) {
    json_response(['success' => false], 400);
}

$login = explode('_', $token)[0];

try {
    /* 🔹 Compétiteur */
    $stmt = $pdo->prepare("
        SELECT c.numCompetiteur
        FROM Utilisateur u
        JOIN Competiteur c ON c.numCompetiteur = u.numUtilisateur
        WHERE u.login = ?
    ");
    $stmt->execute([$login]);
    $competiteur = $stmt->fetch(PDO::FETCH_ASSOC);

    $image = file_get_contents($_FILES['dessin']['tmp_name']);

    $stmt = $pdo->prepare("
        INSERT INTO Dessin
        (numConcours, numCompetiteur, dateRemise, leDessin)
        VALUES (?, ?, NOW(), ?)
    ");
    $stmt->bindParam(1, $numConcours);
    $stmt->bindParam(2, $competiteur['numCompetiteur']);
    $stmt->bindParam(3, $image, PDO::PARAM_LOB);
    $stmt->execute();

    json_response(['success' => true]);

} catch (PDOException $e) {
    json_response(['success' => false], 500);
}
