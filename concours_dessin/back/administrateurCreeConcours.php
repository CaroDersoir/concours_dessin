<?php
// back/creerConcours.php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php'; // fichier avec $pdo PDO

// Fonction pour renvoyer le JSON
function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

// Vérification que toutes les données POST sont présentes
$required = ['theme', 'dateDebut', 'dateFin', 'etat', 'president'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        json_response([
            'success' => false,
            'error' => 'FIELD_MISSING',
            'message' => "Le champ $field est requis"
        ], 400);
    }
}

// Récupération des données
$theme = trim($_POST['theme']);
$dateDebut = $_POST['dateDebut'];
$dateFin = $_POST['dateFin'];
$etat = $_POST['etat'];
$numPresident = (int) $_POST['president']; // ID du président

try {
    // Insertion dans la table Concours


    $sql = "INSERT INTO Concours (theme, dateDebut, dateFin, etat, numPresident) 
            VALUES (:theme, :dateDebut, :dateFin, :etat, :numPresident)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':theme' => $theme,
        ':dateDebut' => $dateDebut,
        ':dateFin' => $dateFin,
        ':etat' => $etat,           // doit être un ENUM valide
        ':numPresident' => $numPresident
    ]);


    // Retour JSON succès
    json_response([
        'success' => true,
        'message' => 'Concours créé avec succès',
        'id' => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    json_response([
        'success' => false,
        'error' => 'DB_ERROR',
        'message' => $e->getMessage()
    ], 500);
}
