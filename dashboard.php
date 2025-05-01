<?php
include 'session.php';

if (!isset($_SESSION['usuario'])) {
  header("Location: login.php");
  exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
    <h1>Dashboard</h1>
    <div>
      <span>👤 <?= htmlspecialchars($_SESSION['usuario']) ?></span>
      <a href="index.php"><button>Volver a la Pokédex</button></a>
      <a href="logout.php"><button>Cerrar sesión</button></a>
    </div>
  </div>

  <p>Este es tu espacio privado. Aquí podrías guardar favoritos, historial, etc.</p>
</body>
</html>
