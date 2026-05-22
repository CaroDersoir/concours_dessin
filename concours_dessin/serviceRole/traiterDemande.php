<?php
try {
    $dsn = "mysql:host=127.0.0.1;port=3306;dbname=concours_dessin;charset=utf8mb4";
    $pdo = new PDO($dsn, 'db_etu', 'N3twork!', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    //echo "Connexion réussie !"; // juste pour tester

    // Vérifie que les données existent
    $id = $_POST['id'] ?? null;
    $action = $_POST['action'] ?? null; // 'accepte' ou 'refuse'

    if (!$id || !$action) {
        echo "Erreur : données manquantes !";
        exit;
    }

    // Vérifie que l'action est valide pour l'ENUM
    $validActions = ['en_attente', 'accepte', 'refuse'];
    if (!in_array($action, $validActions)) {
        echo "Erreur : action invalide !";
        exit;
    }

    if($action == 'accepte'){
        // Met à jour le statut de la demande
        $stmt = $pdo->prepare("UPDATE DemandeParticipation SET statut = :statut WHERE id = :id");
        $stmt->execute([
            ':statut' => $action,
            ':id' => $id
        ]);
        
        // 1. On récupère les infos de la demande
        $reqDem = $pdo->prepare("SELECT numUtilisateur, numConcours FROM DemandeParticipation WHERE id = :id");
        $reqDem->execute([':id' => $id]);
        $demande = $reqDem->fetch();

        $numUser = $demande['numUtilisateur'];
        $numConcours = $demande['numConcours'];

        // 2. Vérification : Le compétiteur existe-t-il déjà ?
        $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM Competiteur WHERE numCompetiteur = :num");
        $stmtCheck->execute([':num' => $numUser]);


        // s'il n'existe pas, on l'ajoute
        if ($stmtCheck->fetchColumn() == 0) {
            $crt = $pdo->prepare("INSERT INTO Competiteur (numCompetiteur, datePremiereParticipation) VALUES (:numCompetiteur, :datePremiereParticipation)");
            $crt->execute([
            ':numCompetiteur' => $numUser,
            ':datePremiereParticipation' => date('Y-m-d')   
        ]);
        } else {
            // Vérification si la participation existe déjà
            $stmtCheckPart = $pdo->prepare("SELECT COUNT(*) FROM ParticipeCompetiteur WHERE numCompetiteur = :numCompetiteur AND numConcours = :numConcours");
            $stmtCheckPart->execute([':numCompetiteur' => $numUser, ':numConcours' => $numConcours]);

            // s'il existe déjà, on annule la demande. Et on se casse
            if ($stmtCheckPart->fetchColumn() > 0) {
                echo("Le competiteur participe déjà à ce concours.");
                $stmtNull = $pdo->prepare("UPDATE DemandeParticipation SET statut = :statut WHERE id = :id");
                $stmtNull->execute([
                    ':statut' => 'refuse',
                    ':id' => $id]);
                exit;
            }
        }
        
        // 3. On ajoute l'entrée dans ParticipeCompetiteur
        $vld = $pdo->prepare("INSERT INTO ParticipeCompetiteur (numCompetiteur, numConcours) VALUES (:numCompetiteur, :numConcours)");
        $vld->execute([
            ':numCompetiteur' => $numUser,
            ':numConcours' => $numConcours
        ]);
        if($vld){
            echo "Participation du compétiteur enregistrée avec succès !";
        }

        echo "Demande $action avec succès !";

    } elseif ($action == 'refuse'){
    // Met à jour le statut de la demande
    $stmtRefuse = $pdo->prepare("UPDATE DemandeParticipation SET statut = :statut WHERE id = :id");
    $stmtRefuse->execute([
        ':statut' => $action,
        ':id' => $id
    ]);

    echo "Demande $action avec succès !";
    }

} catch (PDOException $e) {
    echo "Erreur SQL : " . $e->getMessage();
}