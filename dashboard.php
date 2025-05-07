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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <link rel="icon" href="resources/favicon.ico" type="image/x-icon">

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

  <p>Este es tu espacio privado. ¡Aqui podrás ver tus capturas en un futuro!</p>
</body>
</html>
