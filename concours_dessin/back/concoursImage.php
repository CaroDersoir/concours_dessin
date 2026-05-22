<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function json_response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

$numDessin = $_POST['numDessin'] ?? null;

if (!$numDessin) {
    json_response(['success' => false], 400);
}

$stmt = $pdo->prepare("
    SELECT TO_BASE64(leDessin) AS image
    FROM Dessin
    WHERE numDessin = ?
");
$stmt->execute([$numDessin]);
$img = $stmt->fetch(PDO::FETCH_ASSOC);

json_response([
    'success' => true,
    'image' => $img['image'] ?? null
]);
