<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';
session_start();

// On récupère le login du directeur (via session ou token)
$login = $_SESSION['login'] ?? explode('_', $_POST['utilisateur'] ?? '')[0];

try {
    // 1. Trouver le club du directeur
    $stmt = $pdo->prepare("SELECT numClub FROM Utilisateur WHERE login = :login");
    $stmt->execute(['login' => $login]);
    $user = $stmt->fetch();
    $numClub = $user['numClub'];

    // 2. Récupérer les concours et voir si AU MOINS un membre du club y participe
    $stmt = $pdo->prepare("
        SELECT DISTINCT
            c.numConcours, c.theme, c.dateDebut, c.dateFin, c.etat,
            CASE 
                WHEN EXISTS (
                    SELECT 1 FROM ParticipeCompetiteur pc 
                    JOIN Utilisateur u ON pc.numCompetiteur = u.numUtilisateur 
                    WHERE pc.numConcours = c.numConcours AND u.numClub = :numClub
                ) THEN 1 ELSE 0 
            END AS participe_club
        FROM Concours c
        ORDER BY c.dateDebut DESC
    ");
    $stmt->execute(['numClub' => $numClub]);
    $concours = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'concours' => $concours]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}