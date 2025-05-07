<?php
$host = "192.168.1.144:3306";
$user = "pokeadd_user";
$pass = "rwWp93!qcM.3";
$dbname = "pokeadd";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Error en la conexión: " . $conn->connect_error);
}
?>
