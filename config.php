<?php
$host = "192.168.1.144:3306";
$user = "pokeadd_user"; // o el usuario que uses
$pass = "rwWp93!qcM.3";     // contraseña del usuario
$dbname = "pokeadd";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}
?>
