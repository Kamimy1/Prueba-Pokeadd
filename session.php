<?php
// Configura el tiempo de vida de la sesión ANTES de iniciarla
ini_set('session.cookie_lifetime', 86400); // 1 día
ini_set('session.gc_maxlifetime', 86400);

session_start();

// Si la sesión no está iniciada pero existe una cookie, restáurala
if (!isset($_SESSION['usuario']) && isset($_COOKIE['usuario'])) {
    $_SESSION['usuario'] = $_COOKIE['usuario'];
}
?>
