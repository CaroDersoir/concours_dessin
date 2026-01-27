<?php
require_once '../roleRequete/formulaire.php';

$section = $_GET['section'] ?? '';

$formulaire = new Formulaire();

switch($section) {
    case 'formulaire':
        echo $formulaire->renderForm();
        break;
    case 'demandes':
        echo $formulaire->renderDemandes();
        break;
    case 'resultats':
        echo $formulaire->renderResultats();
        break;
    case 'statistiques':
        echo $formulaire->renderStats();
        break;
    default:
        echo "<p>Section inconnue.</p>";
}
?>
