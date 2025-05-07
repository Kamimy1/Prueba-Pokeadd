<?php
include 'session.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>PokéAdd</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <link rel="icon" href="resources/favicon.ico" type="image/x-icon">

</head>
<body data-logged="<?= isset($_SESSION['usuario']) ? 'true' : 'false' ?>" data-usuario="<?= $_SESSION['usuario'] ?? '' ?>">

  <!-- Barra superior -->
  <div id="user-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1em;">
    
    <div class="brand">
      <img src="resources/logo.png" alt="Logo de PokéAdd">
      <span>PokéAdd</span>
    </div>

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
  <div class="pokedex-selector">
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

  <footer id="main-footer">
    <p>&copy; 2025 PokéAdd. Desarrollado por <a href="https://africabermudezmejias.es/" target="_blank" rel="noopener noreferrer">Africa Maria Bermudez Mejias</a>. Todos los derechos reservados.</p>
  </footer>


  <script src="script.js"></script>
</body>
</html>
