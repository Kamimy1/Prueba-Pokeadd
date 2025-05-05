<?php
include 'session.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>PokéAdd</title>
  <link rel="stylesheet" href="style.css">
</head>
<body data-logged="<?= isset($_SESSION['usuario']) ? 'true' : 'false' ?>" data-usuario="<?= $_SESSION['usuario'] ?? '' ?>">

  <!-- Barra superior -->
  <div id="user-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1em;">
    <h1>PokéAdd</h1>
    <div>
      <?php if (isset($_SESSION['usuario'])): ?>
        <span>👤 <?= htmlspecialchars($_SESSION['usuario']) ?></span>
        <a href="dashboard.php"><button>Dashboard</button></a>
        <a href="logout.php"><button>Cerrar sesión</button></a>
      <?php else: ?>
        <a href="login.php"><button>Iniciar sesión</button></a>
        <a href="register.php"><button>Registrarse</button></a>
      <?php endif; ?>
    </div>
  </div>

  <!-- Selector de Pokédex -->
  <div style="margin-bottom: 1em;">
    <label for="pokedex-type"><strong>Tipo de Pokédex:</strong></label>
    <select id="pokedex-type">
      <option value="regional" selected>Regional</option>
      <option value="nacional">Nacional</option>
    </select>
  </div>

  <!-- Botones de generación -->
  <div id="generation-buttons">
    <button data-gen="1" class="active">Generación 1</button>
    <button data-gen="2">Generación 2</button>
    <button data-gen="3">Generación 3</button>
  </div>

  <!-- Contenedor de Pokémon -->
  <div id="pokemon-container"></div>

  <script src="script.js"></script>
</body>
</html>
