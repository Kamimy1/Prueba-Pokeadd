<?php
header('Content-Type: application/json');
include 'session.php';
include 'config.php';

if (!isset($_GET['usuario'])) {
    echo json_encode([]);
    exit();
}

$usuario = $_GET['usuario'];
$gen_actual = isset($_GET['generacion']) ? (int) $_GET['generacion'] : 1;
$tipo = $_GET['tipo'] ?? 'regional';

// Obtener ID del usuario
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE n_usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->bind_result($id_usuario);
$stmt->fetch();
$stmt->close();

if (empty($id_usuario)) {
    echo json_encode([]);
    exit();
}

if ($tipo === 'regional') {
    $stmt = $conn->prepare("SELECT id_pokemon, id_generacion FROM capturas WHERE id_usuario = ? AND id_generacion = ?");
    $stmt->bind_param("ii", $id_usuario, $gen_actual);
} else {
    $stmt = $conn->prepare("SELECT id_pokemon, id_generacion FROM capturas WHERE id_usuario = ? AND id_generacion <= ?");
    $stmt->bind_param("ii", $id_usuario, $gen_actual);
}

$stmt->execute();
$result = $stmt->get_result();

$capturados = [];
while ($row = $result->fetch_assoc()) {
    $capturados[] = [
        'id_pokemon' => (int)$row['id_pokemon'],
        'id_generacion' => (int)$row['id_generacion']
    ];
}

echo json_encode($capturados);
