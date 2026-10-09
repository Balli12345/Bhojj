<?php
/**
 * Bhojj Satvik Platform - Hostinger Primary Entrypoint
 * This script ensures that Hostinger/LiteSpeed/Apache serves
 * the modern Bhojj React Single Page Application, replacing any
 * previous PHP templates.
 */

if (file_exists(__DIR__ . '/index.html')) {
    include_once(__DIR__ . '/index.html');
    exit;
}

header("Location: /index.html");
exit;
?>
