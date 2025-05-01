<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO usuarios (n_usuario, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $usuario, $email, $password);

    if ($stmt->execute()) {
        echo "Usuario registrado con éxito. <a href='login.php'>Iniciar sesión</a>";
    } else {
        echo "Error: " . $stmt->error;
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registrarse</title>
  <link rel="stylesheet" href="style.css"> <!-- ✅ Importante -->
</head>
<body>

    <h1>Registrarse</h1>

    <form method="POST">
    Usuario: <input type="text" name="usuario" required><br>
    Email: <input type="email" name="email" required><br>
    Contraseña: <input type="password" name="password" required><br>
    <button type="submit">Registrarse</button>
    </form>

    <a href="index.php"><button>← Volver a la Pokédex</button></a>

</body>
</html>




