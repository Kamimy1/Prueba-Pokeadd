<?php
include 'config.php';
session_start();

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

    echo "Usuario o contraseña incorrectos.";
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Iniciar sesión</title>
  <link rel="stylesheet" href="style.css"> <!-- ✅ Importante -->
</head>
<body>

  <h1>Iniciar sesión</h1>

  <form method="POST">
    Usuario: <input type="text" name="usuario" required><br>
    Contraseña: <input type="password" name="password" required><br>
    <button type="submit">Entrar</button>
  </form>

  <a href="index.php"><button>← Volver a la Pokédex</button></a>

</body>
</html>

