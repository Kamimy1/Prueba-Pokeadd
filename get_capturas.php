<?php
header('Content-Type: application/json');
include 'session.php';
include 'config.php';

if (!isset($_GET['usuario'])) {
    echo json_encode([]);
    exit();
}

$usuario = $_GET['usuario'];

// Obtener ID del usuario
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE n_usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->bind_result($id_usuario);
$stmt->fetch();
$stmt->close();

if (!isset($id_usuario)) {
    echo json_encode([]);
    exit();
}

// Obtener todos los ID de Pokémon que ha capturado
$stmt = $conn->prepare("SELECT id_pokemon FROM capturas WHERE id_usuario = ?");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

$capturados = [];
while ($row = $result->fetch_assoc()) {
    $capturados[] = (int)$row['id_pokemon'];
}

echo json_encode($capturados);
