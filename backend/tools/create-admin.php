<?php
declare(strict_types=1);
// Provision an admin account from the server shell. Public admin registration is intentionally not exposed by the API.
// Usage: php tools/create-admin.php "Full Name" admin@example.com "+91 90000 00000"
// The password is read from the BHOJJ_ADMIN_PASSWORD environment variable or prompted interactively.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
[$script, $name, $email, $phone] = array_pad($argv, 4, '');
$email = strtolower(trim($email));
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || trim($phone) === '') {
    fwrite(STDERR, "Usage: php tools/create-admin.php \"Full Name\" admin@example.com \"+91 90000 00000\"\n");
    exit(1);
}
$password = getenv('BHOJJ_ADMIN_PASSWORD') ?: '';
if ($password === '') {
    fwrite(STDOUT, 'Admin password (min 12 chars): ');
    if (DIRECTORY_SEPARATOR === '/') system('stty -echo');
    $password = trim((string)fgets(STDIN));
    if (DIRECTORY_SEPARATOR === '/') system('stty echo');
    fwrite(STDOUT, "\n");
}
if (strlen($password) < 12) { fwrite(STDERR, "Password must be at least 12 characters.\n"); exit(1); }
$cfgFile = __DIR__ . '/../api/config.local.php';
$cfg = is_file($cfgFile) ? (require $cfgFile) : [];
$env = fn(string $k, string $d = '') => (string)($cfg[$k] ?? (getenv($k) ?: $d));
$pdo = new PDO('mysql:host=' . $env('DB_HOST', 'localhost') . ';dbname=' . $env('DB_NAME') . ';charset=utf8mb4', $env('DB_USER'), $env('DB_PASSWORD'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$exists = $pdo->prepare('SELECT id FROM users WHERE LOWER(email)=?');
$exists->execute([$email]);
if ($exists->fetchColumn()) { fwrite(STDERR, "A user with this email already exists.\n"); exit(1); }
$id = 'user-admin-' . bin2hex(random_bytes(6));
$pdo->prepare('INSERT INTO users(id,name,email,phone,password_hash,role,created_at,is_active,updated_at) VALUES(?,?,?,?,?,\'admin\',NOW(),1,NOW())')
    ->execute([$id, $name, $email, trim($phone), password_hash($password, PASSWORD_DEFAULT)]);
fwrite(STDOUT, "Created admin $id ($email)\n");
