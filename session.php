<?php
// Configuracion de la sesión
ini_set('session.cookie_lifetime', 86400); // 1 día
ini_set('session.gc_maxlifetime', 86400);

session_start();

// Verifica si la cookie de sesión está configurada
if (!isset($_SESSION['usuario']) && isset($_COOKIE['usuario'])) {
    $_SESSION['usuario'] = $_COOKIE['usuario'];
}
?>
