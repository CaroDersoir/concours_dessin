<?php
// back/statistiques.php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php'; // connexion PDO

// Fonction pour renvoyer le JSON
function json_response(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $resultats = [];

    // 1️⃣ Nombre de concours en cours
    $sql = "SELECT COUNT(*) as nb FROM Concours WHERE etat = 'en_cours'";
    $stmt = $pdo->query($sql);
    $resultats['concoursEnCours'] = (int) $stmt->fetch()['nb'];

    // 2️⃣ Nombre de concours fini
    $sql = "SELECT COUNT(*) as nb FROM Concours WHERE etat IN ('resultat', 'evalue')";
    $stmt = $pdo->query($sql);
    $resultats['concoursFini'] = (int) $stmt->fetch()['nb'];

    // 3️⃣ Nombre total de participants
    $sql = "SELECT COUNT(DISTINCT numUtilisateur) as nb FROM Utilisateur";
    $stmt = $pdo->query($sql);
    $resultats['participants'] = (int) $stmt->fetch()['nb'];

    // 4️⃣ Nombre total de dessins soumis
    $sql = "SELECT COUNT(*) as nb FROM Dessin";
    $stmt = $pdo->query($sql);
    $resultats['dessins'] = (int) $stmt->fetch()['nb'];

    // 5️⃣ Moyenne de note dans l'ensemble des concours
    $sql = "SELECT AVG(note) as moyenne FROM Evaluation";
    $stmt = $pdo->query($sql);
    $moyenne = $stmt->fetch()['moyenne'];
    $resultats['moyenneNotes'] = $moyenne !== null ? round((float)$moyenne, 2) : null;

    // 6️⃣ Liste des clubs + département + teléphone
    $sql = "SELECT nomClub, departement, numTelephone FROM Club ORDER BY nomClub ASC";
    $stmt = $pdo->query($sql);
    $clubs = $stmt->fetchAll();
    $resultats['clubs'] = $clubs;

    // Retour JSON
    json_response([
        'success' => true,
        'data'    => $resultats
    ]);

} catch (PDOException $e) {
    json_response([
        'success' => false,
        'error'   => 'DB_ERROR',
        'message' => $e->getMessage()
    ], 500);
}
