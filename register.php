<?php
include 'config.php';

// Logica del registro
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $email = $_POST['email'];
    // Encriptacion de la contraseña
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO usuarios (n_usuario, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $usuario, $email, $password);

    if ($stmt->execute()) {
        echo "Usuario registrado con éxito. <a href='login.php'>Iniciar sesión</a>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registrarse</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <link rel="icon" href="resources/favicon.ico" type="image/x-icon">

</head>
<body>

    <h1>Registrarse</h1>

    <form method="POST">
    Usuario: <input type="text" name="usuario" required><br>
    Email: <input type="email" name="email" required><br>
    Contraseña:
    <div class="password-container">
      <input type="password" name="password" id="password" required>
      <span class="toggle-password" onclick="togglePassword()">
        <img src="resources/closedeye.svg" id="icon-closed" style="display: inline;" alt="Mostrar">
        <img src="resources/openeye.svg" id="icon-open" style="display: none;" alt="Ocultar">
      </span>
    </div>

    <br>

    <button type="submit">Registrarse</button>
    </form>

    <a href="index.php"><button>← Volver a la Pokédex</button></a>

    <!-- Script para mostrar/ocultar la contraseña -->
    <script>
    function togglePassword() {
      const password = document.getElementById("password");
      const openIcon = document.getElementById("icon-open");
      const closedIcon = document.getElementById("icon-closed");

      const visible = password.type === "text";
      password.type = visible ? "password" : "text";

      openIcon.style.display = visible ? "none" : "inline";
      closedIcon.style.display = visible ? "inline" : "none";
    }
    </script>

     

    <p>¿Ya tienes cuenta? <a href="login.php">Iniciar sesión</a></p>
</body>
</html>




