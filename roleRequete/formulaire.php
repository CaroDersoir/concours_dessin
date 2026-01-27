<?php
class Formulaire {
    private PDO $pdo;

    public function __construct() {
        $this->pdo = new PDO('mysql:host=localhost;dbname=concours_dessin', 'root', '');
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    // SECTION FORMULAIRE → créer un utilisateur et l’associer à un club
    public function renderForm(): string {
        return '
            <h2>Inscrire un membre au club</h2>
            <div id="formMessage"></div>
            <form id="inscriptionForm">
                <label>Nom :</label>
                <input type="text" name="nom" required><br>
                <label>Prénom :</label>
                <input type="text" name="prenom" required><br>
                <label>Email :</label>
                <input type="email" name="email_utilisateur" required><br>
                <label>Adresse :</label>
                <input type="text" name="adresse"><br>
                <label>Club :</label>
                <select name="numClub" required>
                    ' . $this->getClubOptions() . '
                </select><br>
                <label>Login :</label>
                <input type="text" name="login" required><br>
                <label>Mot de passe :</label>
                <input type="password" name="motDePasse" required><br>
                <button type="submit">Ajouter</button>
            </form>
        ';
    }

    private function getClubOptions(): string {
        $stmt = $this->pdo->query("SELECT numClub, nomClub FROM Club");
        $options = '';
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $options .= "<option value='{$row['numClub']}'>{$row['nomClub']}</option>";
        }
        return $options;
    }

    // SECTION DEMANDES → liste des demandes à valider
    public function renderDemandes(): string {
        $stmt = $this->pdo->query("
            SELECT d.id, u.nom, u.prenom, u.email_utilisateur, c.numConcours, c.theme, d.role, d.statut, d.dateDemande
            FROM DemandeParticipation d
            JOIN Utilisateur u ON d.numUtilisateur = u.numUtilisateur
            JOIN Concours c ON d.numConcours = c.numConcours
            WHERE d.statut = 'en_attente'
            ORDER BY d.dateDemande ASC
        ");

        $html = "<h2>Demandes de participation</h2>";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $html .= "
                <div class='demande-item'>
                    {$row['nom']} {$row['prenom']} veut s'inscrire au concours #{$row['numConcours']} en tant que {$row['role']}
                    <button class='btn-demande' data-id='{$row['id']}' data-action='accepte'>Accepter</button>
                    <button class='btn-demande' data-id='{$row['id']}' data-action='refuse'>Refuser</button>
                </div>
            ";
        }
        return $html;
    }

    // SECTION RESULTATS → exemple
    public function renderResultats(): string {
        return "<h2>Résultats du concours</h2><p>Les résultats apparaîtront ici une fois évalués.</p>";
    }

    // SECTION STATISTIQUES → exemple
    public function renderStats(): string {
        return "<h2>Statistiques</h2><p>Graphiques et chiffres ici...</p>";
    }
} 
?>
