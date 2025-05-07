<?php
include 'config.php';
session_start();

// Logica del inicio de sesión
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT password FROM usuarios WHERE n_usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows == 1) {
        $stmt->bind_result($hash);
        $stmt->fetch();

        if (password_verify($password, $hash)) {
            $_SESSION['usuario'] = $usuario;
            setcookie("usuario", $usuario, time() + 86400, "/"); // 1 día
            header("Location: dashboard.php");
            exit();
        }
    }

    $stmt->close();

    echo "Usuario o contraseña incorrectos.";
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Iniciar sesión</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <link rel="icon" href="resources/favicon.ico" type="image/x-icon">

</head>
<body>

  <h1>Iniciar sesión</h1>

  <form method="POST">
    Usuario: <input type="text" name="usuario" required><br>
    Contraseña:
    <div class="password-container">
      <input type="password" name="password" id="password" required>
      <span class="toggle-password" onclick="togglePassword()">
        <img src="resources/closedeye.svg" id="icon-closed" style="display: inline;" alt="Mostrar">
        <img src="resources/openeye.svg" id="icon-open" style="display: none;" alt="Ocultar">
      </span>
    </div>


    <br>
    <button type="submit">Entrar</button>
  </form>

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

  <a href="index.php"><button>← Volver a la Pokédex</button></a>

  <p>¿No tienes cuenta? <a href="register.php">Registrarse</a></p>

</body>
</html>

