<?php
require_once '../roleRequete/formulaire.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $email = $_POST['email_utilisateur'];
    $adresse = $_POST['adresse'];
    $numClub = $_POST['numClub'];
    $login = $_POST['login'];
    $motDePasse = password_hash($_POST['motDePasse'], PASSWORD_DEFAULT);

    $pdo = new PDO('mysql:host=localhost;dbname=concours_dessin', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("INSERT INTO Utilisateur (numClub, nom, prenom, adresse, email_utilisateur, login, motDePasse) VALUES (?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([$numClub, $nom, $prenom, $adresse, $email, $login, $motDePasse]);
        echo "<p style='color:green;'>Utilisateur ajouté avec succès !</p>";
    } catch (PDOException $e) {
        echo "<p style='color:red;'>Erreur : " . $e->getMessage() . "</p>";
    }
}
?>