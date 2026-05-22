<?php
class Formulaire {
    private PDO $pdo;

    public function __construct() {
        try {
            $dsn = "mysql:host=127.0.0.1;port=3306;dbname=concours_dessin;charset=utf8mb4";
            $this->pdo = new PDO($dsn, 'db_etu', 'N3twork!', [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            //echo "Connexion réussie !"; // juste pour tester
        } catch (PDOException $e) {
            //echo "Erreur de connexion : " . $e->getMessage();
            exit; // arrête le script si échec
        }
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

    // SECTION RESULTATS
    public function renderResultats(): string {
        return '<h2>Les concours du club</h2>
        <div class="colonnes-concours-colonne">

            <!-- Concours en cours -->
            <div class="colonne" id="concoursInscrits">
                <h3>Concours où vous êtes inscrit :</h3>
                <ul id="concours-actuels">
                    <!-- Rempli dynamiquement par JS -->
                </ul>
            </div>

            <!-- Concours passés -->            
            <div class="colonne" id="ancienParticipations">
                <h3>Concours où vous avez participer :</h3>
                <ul id="concours-passes">
                    <!-- Rempli dynamiquement par JS -->
                </ul>
            </div>

        </div>';
    }

    // SECTION STATISTIQUES
    public function renderStats(): string {
        return '<h2>Statistiques de tous les concours</h2>

            <div class="colonnes-concours">
                <div class="colonne" id="Col1Statistique">
                    <h3>Nombre de concours en cours : </h3>
                    <p> <span id="enCours">...</span></p>

                    <h3>Nombre total de participants :</h3>
                    <p> <span id="participants">...</span></p>

                    <h3>Moyenne de note :</h3>
                    <p> <span id="moyenne">...</span></p>
                </div>

                <div class="colonne" id="Col2Statistique">
                    <h3>Nombre de concours finis :</h3>
                    <p> <span id="finis">...</span></p>
                    
                    <h3>Nombre total de dessins soumis :</h3>
                    <p> <span id="dessins">...</span></p>
                </div>
            </div>

            <h3>Clubs, leur département et leur numéro de téléphone :</h3>
            <ul id="clubs"></ul>
            <br>';
    }
} 
?>
